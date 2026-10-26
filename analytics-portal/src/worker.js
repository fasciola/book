// Cloudflare Access must be enforced at the hostname and on the Worker route.
// This Worker additionally verifies the Access JWT and exact owner email.
const json = (data, status=200) => new Response(JSON.stringify(data), {status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const b64url = b => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const decode = input => Uint8Array.from(atob(input.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-input.length%4)%4)), c=>c.charCodeAt(0));
const utf8 = s => new TextEncoder().encode(s);
async function verifyAccess(request,env){
  if(!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD || !env.OWNER_EMAIL)throw Error('Access environment not configured');
  const token=request.headers.get('Cf-Access-Jwt-Assertion');
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
const dim=(d,m)=>({dimensions:d.map(name=>({name})),metrics:m.map(name=>({name}))});
const val=(row,i,metric=false)=>metric?Number(row.metricValues?.[i]?.value||0):row.dimensionValues?.[i]?.value||'';
const rows=(r)=>r.rows||[];
const metricSum=(r,i)=>Number(r.totals?.[0]?.metricValues?.[i]?.value||0);
const languageFromPath=path=>{
  const p=path.toLowerCase();const q=p.match(/[?&]lang=(ar|en|fr|de|ru|zh|nl|sw)(?:&|$)/);if(q)return ({ar:'Arabic',en:'English',fr:'French',de:'German',ru:'Russian',zh:'Chinese',nl:'Dutch',sw:'Swahili'})[q[1]];
  const m=p.match(/(?:index|read)-(ar|en|fr|de|ru|zh|nl|sw)\.html/);if(m)return ({ar:'Arabic',en:'English',fr:'French',de:'German',ru:'Russian',zh:'Chinese',nl:'Dutch',sw:'Swahili'})[m[1]];
  if(/(?:^|\/)read\.html(?:\?|$)/.test(p))return 'English';
  return 'Other / selector';
};
const periodDays={7:7,30:30,90:90};
export default {async fetch(request,env){
  const url=new URL(request.url);
  const isLocal = url.hostname === '127.0.0.1' || url.hostname === 'localhost';
  try{
    if(isLocal && !url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }
    const email=await verifyAccess(request,env);
    if(url.pathname==='/api/health')return json({ok:true,authenticated:true,email,configured:!!(env.GA4_PROPERTY_ID&&env.GOOGLE_SERVICE_ACCOUNT_JSON)});
    if(url.pathname==='/api/report'){
      if(request.method!=='GET')return json({error:'Method not allowed'},405);
      if(!/^\d+$/.test(env.GA4_PROPERTY_ID||''))return json({error:'GA4 numeric property ID is not configured'},503);
      const days=periodDays[Number(url.searchParams.get('days'))]||30;
      const range=[{startDate:`${days}daysAgo`,endDate:'yesterday'}];
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
      // Per-page user counts cannot be summed to unique users across a language's pages.
      return json({periodDays:days,updatedAt:new Date().toISOString(),notes:['Language views are classified from GA4 page URLs. Users across pages are not deduplicated; language ranking uses views.','GA4 data shown through yesterday; recent activity may not be fully processed.'],overview:{users:metricSum(overview,0),activeUsers:metricSum(overview,1),sessions:metricSum(overview,2),views:metricSum(overview,3),engagementRate:metricSum(overview,4),averageSessionDuration:metricSum(overview,5)},traffic:rows(traffic).map(r=>({date:val(r,0),users:val(r,0,true),views:val(r,1,true)})),countries:rows(countries).map(r=>({name:val(r,0),value:val(r,0,true)})),channels:rows(channels).map(r=>({name:val(r,0),value:val(r,0,true)})),devices:rows(devices).map(r=>({name:val(r,0),value:val(r,0,true)})),languages:Object.values(languages).sort((a,b)=>b.views-a.views),pages:rows(pages).slice(0,30).map(r=>({path:val(r,0),views:val(r,0,true),engagementSeconds:val(r,2,true)})),events:rows(events).map(r=>({name:val(r,0),count:val(r,0,true)}))});
    }
    return env.ASSETS.fetch(request);
  }catch(e){return json({error:url.pathname.startsWith('/api/')?(e.message||'Request failed'):'Access denied'},url.pathname.startsWith('/api/')?403:403)};
}};
