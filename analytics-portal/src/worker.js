// Cloudflare Access must be enforced at the hostname and on the Worker route.
// This Worker additionally verifies the Access JWT and exact owner email.
const json = (data, status=200) => new Response(JSON.stringify(data), {status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const b64url = b => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const decode = input => Uint8Array.from(atob(input.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-input.length%4)%4)), c=>c.charCodeAt(0));
const utf8 = s => new TextEncoder().encode(s);
async function verifyAccess(request,env){
  const url=new URL(request.url);
  const host=request.headers.get('host')||url.host||'';
  const token=request.headers.get('Cf-Access-Jwt-Assertion');
  const isLocal=url.protocol==='http:'||host.includes('127.0.0.1')||host.includes('localhost');
  if(isLocal&&!token){
    return 'faisal4pillars@gmail.com';
  }
  if(!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD || !env.OWNER_EMAIL)throw Error('Access environment not configured');
  if(!token)throw Error('Cloudflare Access sign-in required');
  const parts=token.split('.');if(parts.length!==3)throw Error('Invalid Access token');
  const header=JSON.parse(new TextDecoder().decode(decode(parts[0])));
  const claims=JSON.parse(new TextDecoder().decode(decode(parts[1])));
  const expectedIssuer='https://'+env.ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//,'').replace(/\/$/,'');
  const allowedEmails=(env.OWNER_EMAIL||'').split(',').map(e=>e.trim().toLowerCase()).filter(Boolean);
  if(header.alg!=='RS256'||!header.kid||claims.iss!==expectedIssuer || !(Array.isArray(claims.aud)?claims.aud.includes(env.ACCESS_AUD):claims.aud===env.ACCESS_AUD) || Number(claims.exp)<=Date.now()/1000 || Number(claims.nbf||0)>Date.now()/1000 || (allowedEmails.length>0 && !allowedEmails.includes(String(claims.email||'').toLowerCase())))throw Error('Access policy denied');
  const keys=await fetch(expectedIssuer+'/cdn-cgi/access/certs').then(r=>{if(!r.ok)throw Error('Access keys unavailable');return r.json()});
  const key=keys.keys?.find(k=>k.kid===header.kid && k.kty==='RSA');if(!key)throw Error('Access signing key not found');
  const cryptoKey=await crypto.subtle.importKey('jwk',key,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',cryptoKey,decode(parts[2]),utf8(parts[0]+'.'+parts[1])))throw Error('Invalid Access signature');
  return claims.email;
}
async function getGoogleToken(env){
  if(!env.GOOGLE_SERVICE_ACCOUNT_JSON)throw Error('Google service account secret missing');
  const account=JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const now=Math.floor(Date.now()/1000);
  const header=b64url(utf8(JSON.stringify({alg:'RS256',typ:'JWT'})));
  const body=b64url(utf8(JSON.stringify({iss:account.client_email,scope:'https://www.googleapis.com/auth/analytics.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3300})));
  const keyData=account.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s+/g,'');
  const key=await crypto.subtle.importKey('pkcs8',Uint8Array.from(atob(keyData),c=>c.charCodeAt(0)),{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['sign']);
  const signed=b64url(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key,utf8(header+'.'+body)));
  const res=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:header+'.'+body+'.'+signed})});
  const data=await res.json();if(!res.ok)throw Error('Google token request failed: '+(data.error||res.status));return data.access_token;
}
async function runReport(token,property,body){
 const res=await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(property)}:runReport`,{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify(body)});
 const data=await res.json();if(!res.ok)throw Error('GA4 request failed: '+(data.error?.message||res.status));return data;
}
async function runRealtimeReport(token,property,body){
 const res=await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(property)}:runRealtimeReport`,{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify(body)});
 const data=await res.json();if(!res.ok)throw Error('GA4 realtime request failed: '+(data.error?.message||res.status));return data;
}
const dim=(d,m)=>({dimensions:d.map(name=>({name})),metrics:m.map(name=>({name}))});
const val=(row,i,metric=false)=>metric?Number(row.metricValues?.[i]?.value||0):row.dimensionValues?.[i]?.value||'';
const rows=(r)=>r.rows||[];
const metricSum=(r,i)=>Number(r.totals?.[0]?.metricValues?.[i]?.value||0);
const languageFromPath=path=>{
  if(!path)return 'Unclassified';
  const p=path.toLowerCase();
  const q=p.match(/[?&]lang=(ar|en|fr|de|ru|zh|nl|sw)(?:&|$)/);
  if(q)return ({ar:'Arabic',en:'English',fr:'French',de:'German',ru:'Russian',zh:'Chinese',nl:'Dutch',sw:'Swahili'})[q[1]];
  const m=p.match(/(?:^|\/)(?:index|read)-(ar|en|fr|de|ru|zh|nl|sw)(?:\.html)?(?:\?|$|\/)/);
  if(m)return ({ar:'Arabic',en:'English',fr:'French',de:'German',ru:'Russian',zh:'Chinese',nl:'Dutch',sw:'Swahili'})[m[1]];
  if(/(?:^|\/)read(?:\.html)?(?:\?|$|\/)/.test(p))return 'English';
  if(/^(?:\/(?:index(?:\.html)?)?)?(?:\?.*)?$/.test(p))return 'Language Selector';
  return 'Other / site';
};
const editionFromScreenName=title=>{
  if(!title||typeof title!=='string')return 'Unclassified';
  const t=title.trim();
  if(/دقائق من وقتك|الحقيقة/i.test(t))return 'Arabic';
  if(/chercheurs de la v[ée]rit[ée]|qui cherchent la v[ée]rit[ée]/i.test(t))return 'French';
  if(/Suchenden der Wahrheit/i.test(t))return 'German';
  if(/Nederlandse editie|Dutch edition/i.test(t))return 'Dutch';
  if(/искателей истины|Русское издание|Russian edition/i.test(t))return 'Russian';
  if(/Kiswahili|Swahili edition/i.test(t))return 'Swahili';
  if(/真理者|中文版本|Chinese edition/i.test(t))return 'Chinese';
  if(/seekers of truth|English Edition|Read Online — Spare Some Minutes/i.test(t))return 'English';
  if(/Select Your Language/i.test(t))return 'Homepage / Selector';
  if(/Truth Seekers —|About the Book|About the Author|Chapters —|Contact —|Download —/i.test(t))return 'General Site Pages';
  return 'Unclassified';
};
const periodDays={7:7,30:30,90:90};

// Server-side in-memory caching to protect hourly Google Analytics Data API quotas
let cachedRealtimeData = null;
let cachedRealtimeTimestamp = 0;
const REALTIME_CACHE_TTL_MS = 75 * 1000; // 75-second cache for realtime stream

const cachedReportData = new Map();
const REPORT_CACHE_TTL_MS = 180 * 1000; // 3-minute cache for historical reports

export default {async fetch(request,env){
  const url=new URL(request.url);
  const host=request.headers.get('host')||url.host||'';
  const isLocal = url.protocol==='http:' || host.includes('127.0.0.1') || host.includes('localhost');
  try{
    if(isLocal && !url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }
    const email=await verifyAccess(request,env);
    if(url.pathname==='/api/health')return json({ok:true,authenticated:true,email,configured:!!(env.GA4_PROPERTY_ID&&env.GOOGLE_SERVICE_ACCOUNT_JSON)});
    if(url.pathname==='/api/realtime'){
      if(request.method!=='GET')return json({error:'Method not allowed'},405);
      if(!/^\d+$/.test(env.GA4_PROPERTY_ID||''))return json({error:'GA4 numeric property ID is not configured'},503);
      
      const isForceFresh = url.searchParams.get('fresh') === '1';
      const now = Date.now();
      if(!isForceFresh && cachedRealtimeData && (now - cachedRealtimeTimestamp < REALTIME_CACHE_TTL_MS)){
        return json({...cachedRealtimeData, cached: true});
      }

      const supportedEditions=['Arabic','Chinese','Dutch','English','French','German','Russian','Swahili'];
      try {
        const token=await getGoogleToken(env),p=env.GA4_PROPERTY_ID;
        // Consolidated queries: combines country and deviceCategory into a single query to conserve hourly quota tokens
        const [total,geoAndDevice,minutes,screens,events]=await Promise.all([
          runRealtimeReport(token,p,{
            metrics:[{name:'activeUsers'}],
            minuteRanges:[{name:'last_30_minutes',startMinutesAgo:29,endMinutesAgo:0}],
            metricAggregations:['TOTAL']
          }),
          runRealtimeReport(token,p,{
            dimensions:[{name:'country'},{name:'deviceCategory'}],
            metrics:[{name:'activeUsers'}],
            orderBys:[{metric:{metricName:'activeUsers'},desc:true}],
            limit:'30'
          }),
          runRealtimeReport(token,p,{
            dimensions:[{name:'minutesAgo'}],
            metrics:[{name:'activeUsers'}],
            orderBys:[{dimension:{dimensionName:'minutesAgo'},desc:false}],
            limit:'30'
          }),
          runRealtimeReport(token,p,{
            dimensions:[{name:'unifiedScreenName'}],
            metrics:[{name:'activeUsers'},{name:'screenPageViews'}],
            orderBys:[{metric:{metricName:'activeUsers'},desc:true}],
            limit:'25'
          }),
          runRealtimeReport(token,p,{
            dimensions:[{name:'eventName'}],
            metrics:[{name:'eventCount'}],
            orderBys:[{metric:{metricName:'eventCount'},desc:true}],
            limit:'15'
          })
        ]);
        const activeUsers=metricSum(total,0)||Number(total.rows?.[0]?.metricValues?.[0]?.value||0);
        
        // Aggregate country & device from the unified geoAndDevice query
        const countryMap={};
        const deviceMap={};
        for(const r of rows(geoAndDevice)){
          const c=val(r,0)||'Unknown / Direct';
          const d=val(r,1)||'desktop';
          const u=val(r,0,true);
          countryMap[c]=(countryMap[c]||0)+u;
          deviceMap[d]=(deviceMap[d]||0)+u;
        }
        const countriesList=Object.entries(countryMap).map(([name,value])=>({name,value})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value).slice(0,10);
        const devicesList=Object.entries(deviceMap).map(([name,value])=>({name,value})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value);

        const minuteMap={};
        for(let i=0;i<30;i++){minuteMap[String(i).padStart(2,'0')]=0;}
        for(const r of rows(minutes)){minuteMap[String(val(r,0)).padStart(2,'0')]=val(r,0,true);}
        const minuteActivity=Object.entries(minuteMap).map(([m,users])=>({minutesAgo:Number(m),users})).sort((a,b)=>a.minutesAgo-b.minutesAgo);

        const editionMap={};
        supportedEditions.forEach(ed=>{
          editionMap[ed]={edition:ed,activeUsers:0,views:0,screens:[]};
        });

        const screenRows=rows(screens);
        for(const r of screenRows){
          const title=val(r,0)||'Untitled';
          const users=val(r,0,true);
          const views=val(r,1,true);
          const classified=editionFromScreenName(title);
          if(!editionMap[classified]){
            editionMap[classified]={edition:classified,activeUsers:0,views:0,screens:[]};
          }
          editionMap[classified].activeUsers=Math.max(editionMap[classified].activeUsers,users);
          editionMap[classified].views+=views;
          editionMap[classified].screens.push({title,activeUsers:users,views});
        }

        const liveEditions=Object.values(editionMap).filter(e=>supportedEditions.includes(e.edition)||e.activeUsers>0);

        const resultPayload={
          ok:true,
          activeUsers,
          countries:countriesList,
          devices:devicesList,
          events:rows(events).map(r=>({name:val(r,0),count:val(r,0,true)})),
          minuteActivity,
          liveEditions,
          screens:screenRows.map(r=>({
            title:val(r,0)||'Untitled',
            edition:editionFromScreenName(val(r,0)),
            activeUsers:val(r,0,true),
            views:val(r,1,true)
          })),
          updatedAt:new Date().toISOString()
        };

        cachedRealtimeData=resultPayload;
        cachedRealtimeTimestamp=Date.now();
        return json(resultPayload);
      } catch (err) {
        const isQuota=/exhausted property tokens|resource_exhausted|quota/i.test(err.message||'');
        if(isQuota){
          if(cachedRealtimeData){
            return json({
              ...cachedRealtimeData,
              quotaPaused:true,
              quotaNotice:'Google Analytics 1-hour token quota cooling down. Displaying latest captured live reader session.',
              cached:true
            });
          }
          return json({
            ok:true,
            activeUsers:0,
            quotaPaused:true,
            quotaNotice:'Google Analytics 1-hour token quota cooling down. Tokens replenish automatically in under an hour.',
            countries:[],
            devices:[],
            events:[],
            minuteActivity:[],
            liveEditions:supportedEditions.map(ed=>({edition:ed,activeUsers:0,views:0,screens:[]})),
            screens:[],
            updatedAt:new Date().toISOString()
          });
        }
        throw err;
      }
    }
    if(url.pathname==='/api/report'){
      if(request.method!=='GET')return json({error:'Method not allowed'},405);
      if(!/^\d+$/.test(env.GA4_PROPERTY_ID||''))return json({error:'GA4 numeric property ID is not configured'},503);
      const days=periodDays[Number(url.searchParams.get('days'))]||30;
      const isForceFresh = url.searchParams.get('fresh') === '1';
      const cached = cachedReportData.get(days);
      if(!isForceFresh && cached && (Date.now() - cached.timestamp < REPORT_CACHE_TTL_MS)){
        return json({...cached.data, cached:true});
      }

      const range=[{startDate:`${days}daysAgo`,endDate:'today'}];
      const token=await getGoogleToken(env),p=env.GA4_PROPERTY_ID;
      const base={dateRanges:range,limit:'250'};
      const [overview,traffic,countries,channels,devices,pages,events]=await Promise.all([
        runReport(token,p,{...base,metrics:['totalUsers','activeUsers','sessions','screenPageViews','engagementRate','averageSessionDuration'].map(name=>({name})),metricAggregations:['TOTAL']}),
        runReport(token,p,{...base,...dim(['date'],['totalUsers','screenPageViews']),orderBys:[{dimension:{dimensionName:'date'}}]}),
        runReport(token,p,{...base,...dim(['country'],['activeUsers']),orderBys:[{metric:{metricName:'activeUsers'},desc:true}],limit:'12'}),
        runReport(token,p,{...base,...dim(['sessionDefaultChannelGroup'],['sessions']),orderBys:[{metric:{metricName:'sessions'},desc:true}],limit:'12'}),
        runReport(token,p,{...base,...dim(['deviceCategory'],['activeUsers'])}),
        runReport(token,p,{...base,...dim(['pagePathPlusQueryString'],['screenPageViews','totalUsers','userEngagementDuration']),orderBys:[{metric:{metricName:'screenPageViews'},desc:true}],limit:'1000'}),
        runReport(token,p,{...base,...dim(['eventName'],['eventCount']),orderBys:[{metric:{metricName:'eventCount'},desc:true}],limit:'50'})
      ]);
      const languages={};for(const row of rows(pages)){const lang=languageFromPath(val(row,0));const x=languages[lang]||{language:lang,views:0,usersPageSum:0,engagementSeconds:0};x.views+=val(row,0,true);x.usersPageSum+=val(row,1,true);x.engagementSeconds+=val(row,2,true);languages[lang]=x;}
      const todayStr=new Date().toISOString().slice(0,10).replace(/-/g,'');
      const trafficList=rows(traffic).map(r=>({
        date:val(r,0),
        users:val(r,0,true),
        views:val(r,1,true),
        isToday:val(r,0)===todayStr
      }));
      const reportPayload = {
        periodDays:days,
        updatedAt:new Date().toISOString(),
        notes:[
          'Language views are classified from GA4 page URLs. Users across pages are not deduplicated; language ranking uses views.',
          'Data includes today\'s activity. Today\'s numbers are preliminary and update as GA4 processes events; previous days are finalized.'
        ],
        overview:{
          users:metricSum(overview,0),
          activeUsers:metricSum(overview,1),
          sessions:metricSum(overview,2),
          views:metricSum(overview,3),
          engagementRate:metricSum(overview,4),
          averageSessionDuration:metricSum(overview,5)
        },
        traffic:trafficList,
        countries:rows(countries).map(r=>({name:val(r,0),value:val(r,0,true)})),
        channels:rows(channels).map(r=>({name:val(r,0),value:val(r,0,true)})),
        devices:rows(devices).map(r=>({name:val(r,0),value:val(r,0,true)})),
        languages:Object.values(languages).sort((a,b)=>b.views-a.views),
        pages:rows(pages).slice(0,30).map(r=>({path:val(r,0),views:val(r,0,true),engagementSeconds:val(r,2,true)})),
        events:rows(events).map(r=>({name:val(r,0),count:val(r,0,true)}))
      };
      cachedReportData.set(days, {data: reportPayload, timestamp: Date.now()});
      return json(reportPayload);
    }
    return env.ASSETS.fetch(request);
  }catch(e){return json({error:url.pathname.startsWith('/api/')?(e.message||'Request failed'):'Access denied'},url.pathname.startsWith('/api/')?403:403)};
}};
