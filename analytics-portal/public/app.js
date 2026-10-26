const $ = x => document.querySelector(x);
const fmt = n => Number(n || 0).toLocaleString('en-US');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let data = null;
let realtimeData = null;
let realtimeError = null;
let realtimeLoading = false;
let realtimePollInterval = null;
let view = 'overview';

const titles = {
  overview: ['Audience overview', 'A clearer picture of your book’s reach around the world.'],
  audience: ['Audience & reach', 'Where readers come from and how they discover the book.'],
  languages: ['Language editions', 'Which translations attract the most reader interest.'],
  content: ['Reader engagement', 'The pages and interactions that keep visitors reading.']
};

const card = (title, value, desc = 'GA4 · selected period', isLive = false, liveBadge = '') => `
  <div class="tile ${isLive ? 'live-kpi' : ''}">
    <small>${esc(title)} ${liveBadge}</small>
    <strong>${esc(value)}</strong>
    <span class="hint">${esc(desc)}</span>
  </div>
`;

const panel = (title, subtitle, body) => `
  <section class="panel">
    <h2>${esc(title)}</h2>
    <p class="muted">${esc(subtitle)}</p>
    ${body}
  </section>
`;

const bars = (items, formatter = fmt) => {
  if (!items || !items.length) return '<p class="empty">No data for this period.</p>';
  const maxVal = Math.max(1, ...items.map(x => x.value || 0));
  return `
    <div class="bars">
      ${items.map(x => `
        <div>
          <div class="bar-title">
            <span>${esc(x.name)}</span>
            <span>${esc(formatter(x.value))}</span>
          </div>
          <div class="track">
            <div class="fill" style="width:${Math.max(0, Math.min(100, 100 * (x.value || 0) / maxVal))}%"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

function minuteHistogram(minutes) {
  if (!minutes || !minutes.length) return '';
  const maxUsers = Math.max(1, ...minutes.map(m => m.users || 0));
  return `
    <div class="realtime-widget">
      <div class="realtime-widget-title">
        <span>Activity per minute (last 30m)</span>
        <span>${minutes.reduce((s, m) => s + m.users, 0)} events recorded</span>
      </div>
      <div class="minute-histogram">
        ${minutes.map(m => {
          const h = m.users > 0 ? Math.max(15, Math.min(100, (m.users / maxUsers) * 100)) : 6;
          return `
            <div class="minute-bar-wrap" title="${m.minutesAgo} min ago: ${m.users} active">
              <div class="minute-bar ${m.users > 0 ? 'has-users' : ''}" style="height:${h}%"></div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="minute-labels">
        <span>30m ago</span>
        <span>15m ago</span>
        <span>Now</span>
      </div>
    </div>
  `;
}

function lineChart(items) {
  if (!items || !items.length) return '<p class="empty">No traffic data is available yet.</p>';
  const max = Math.max(1, ...items.map(x => x.users));
  const min = 0;
  const points = items.map((x, i) => `${(i / Math.max(1, items.length - 1) * 640).toFixed(2)},${(195 - (x.users - min) / (max - min) * 170).toFixed(2)}`);
  const line = points.map((p, i) => (i ? 'L' : 'M') + p).join(' ');
  const lastPoint = points[points.length - 1].split(',');

  return `
    <svg class="chart" viewBox="0 0 640 230" role="img" aria-label="Daily users trend">
      ${[25, 80, 135, 195].map(y => `<line x1="0" y1="${y}" x2="640" y2="${y}"/>`).join('')}
      <path class="area" d="${line} L640 205 L0 205Z"/>
      <path class="line" d="${line}"/>
      <circle class="point-today" cx="${lastPoint[0]}" cy="${lastPoint[1]}" r="4.5" />
      <text x="0" y="225">${esc(items[0].date)}</text>
      <text x="520" y="225">${esc(items.at(-1).date)} (Today*)</text>
    </svg>
    <div style="font-size:11px;color:#899bb4;margin-top:6px;display:flex;justify-content:space-between">
      <span>* Today's figures are preliminary and update as GA4 processes events.</span>
      <span>● Today's data point</span>
    </div>
  `;
}

const table = (headers, rows) => `
  <div class="table-wrap">
    <table>
      <thead>
        <tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows.length ? rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${headers.length}">No data yet</td></tr>`}
      </tbody>
    </table>
  </div>
`;

function renderRealtimePill() {
  const pill = $('#live-pill-count');
  if (!pill) return;
  if (realtimeError) {
    pill.textContent = 'Offline';
    pill.style.color = '#f87171';
  } else if (realtimeData !== null) {
    pill.textContent = fmt(realtimeData.activeUsers);
    pill.style.color = '#86efac';
  } else {
    pill.textContent = '—';
  }
}

function render() {
  const t = titles[view];
  $('#section-title').textContent = t[0];
  $('#section-subtitle').textContent = t[1];
  document.querySelectorAll('.nav').forEach(b => b.classList.toggle('active', b.dataset.view === view));

  renderRealtimePill();

  if (!data) {
    $('#view').innerHTML = '<p class="empty">Connect a valid GA4 property to populate your dashboard.</p>';
    return;
  }

  const o = data.overview;

  // Realtime display logic
  let liveCardValue = '—';
  let liveCardDesc = 'Checking real-time...';
  let liveBadge = '<span class="live-badge-inline"><span class="pulse-dot" style="margin-right:4px;width:6px;height:6px"></span> LIVE</span>';
  let realtimeMinutesHtml = '';
  let realtimeCountryHtml = '';

  if (realtimeError) {
    liveCardValue = 'Unavailable';
    liveCardDesc = 'Realtime API check failed';
    liveBadge = '<span class="live-badge-inline" style="background:#451a1a;color:#fca5a5;border-color:#7f1d1d">Error</span>';
  } else if (realtimeData !== null) {
    liveCardValue = fmt(realtimeData.activeUsers);
    liveCardDesc = realtimeData.activeUsers > 0
      ? `Active readers right now (last 30m)`
      : `0 live readers in the last 30 minutes`;
    realtimeMinutesHtml = minuteHistogram(realtimeData.minuteActivity);
    
    if (realtimeData.countries && realtimeData.countries.length > 0) {
      realtimeCountryHtml = `
        <div style="margin-top:14px;padding-top:14px;border-top:1px solid #213348">
          <div class="realtime-widget-title">
            <span>Live readers by country</span>
            <span>Real-time</span>
          </div>
          ${bars(realtimeData.countries)}
        </div>
      `;
    }
  }

  // Realtime Live Editions logic
  const liveSupported = ['Arabic', 'Chinese', 'Dutch', 'English', 'French', 'German', 'Russian', 'Swahili'];
  const activeTranslationEditions = (realtimeData?.liveEditions || []).filter(e => e.activeUsers > 0 && liveSupported.includes(e.edition));
  const activeAllEditions = (realtimeData?.liveEditions || []).filter(e => e.activeUsers > 0);
  const totalLiveEditionUsers = activeTranslationEditions.reduce((max, e) => Math.max(max, e.activeUsers), 0);

  let liveEditionsHtml = '';
  if (realtimeError) {
    liveEditionsHtml = `<p class="empty" style="color:#f87171">Realtime edition data currently unavailable.</p>`;
  } else if (realtimeData) {
    if (activeAllEditions.length > 0) {
      liveEditionsHtml = `
        <div class="live-edition-grid">
          ${activeAllEditions.map(item => `
            <div class="live-edition-card ${liveSupported.includes(item.edition) ? 'active-translation' : 'meta-card'}">
              <div class="live-edition-head">
                <span class="live-edition-name">${esc(item.edition)}</span>
                <span class="live-badge-inline"><span class="pulse-dot"></span> ${fmt(item.activeUsers)} active ${item.activeUsers === 1 ? 'reader' : 'readers'}</span>
              </div>
              <div class="live-edition-meta">
                <span>${fmt(item.views)} ${item.views === 1 ? 'view' : 'views'} in last 30m</span>
              </div>
              ${item.screens && item.screens.length ? `
                <div class="screen-sublist">
                  ${item.screens.map(s => `
                    <div class="screen-subitem">
                      <span class="screen-title" title="${esc(s.title)}">${esc(s.title)}</span>
                      <span class="screen-badge">${fmt(s.activeUsers)} live</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        <p class="realtime-disclaimer">
          * Live counts reflect active readers per edition recorded in GA4's in-memory stream over the last 30 minutes. A visitor navigating across multiple editions is counted within each visited edition; deduplicated reach is reported at the total portal level.
        </p>
      `;
    } else {
      liveEditionsHtml = `
        <div class="live-empty-state">
          <span class="pulse-dot" style="opacity:0.5"></span>
          <p>No active edition readers recorded in the last 30 minutes. Real-time reader activity will appear here automatically as visitors navigate book translations.</p>
        </div>
      `;
    }
  } else {
    liveEditionsHtml = `<p class="empty">Checking live edition activity...</p>`;
  }

  const totalHistoricalViews = data.languages.reduce((s, x) => s + (x.views || 0), 0);
  const processingNoticeHtml = totalHistoricalViews === 0 ? `
    <div class="processing-notice">
      <div class="notice-icon">⏳</div>
      <div>
        <strong>Historical Reporting Processing in Progress</strong>
        <p>Google Analytics 4 standard aggregation requires 24 to 48 hours to compile daily historical data tables for newly connected properties. Live readers currently active on book translations are displayed above in real time while historical batch processing completes.</p>
      </div>
    </div>
  ` : '';

  const overview = `
    <div class="kpis">
      ${card('Live Visitors', liveCardValue, liveCardDesc, true, liveBadge)}
      ${card('Visitors (Total)', fmt(o.totalUsers ?? o.users), 'Selected period incl. today')}
      ${card('Page views', fmt(o.views))}
      ${card('Sessions', fmt(o.sessions))}
      ${card('Engagement rate', (100 * o.engagementRate).toFixed(1) + '%')}
    </div>
    <div class="panels">
      ${panel('Visitor activity', 'Daily users through today (preliminary)', lineChart(data.traffic))}
      ${panel('Active Audience (Realtime & Top)', 'Live location & top countries', `
        ${realtimeMinutesHtml}
        ${realtimeCountryHtml}
        <div style="margin-top:18px">
          <div class="realtime-widget-title"><span>Top countries (Historical)</span><span>${fmt(data.countries.length)} total</span></div>
          ${bars(data.countries.slice(0, 5))}
        </div>
      `)}
    </div>
    <div class="panels">
      ${panel('Most popular languages', 'Based on page views', totalHistoricalViews === 0 && activeTranslationEditions.length > 0 ? `
        <div style="margin-bottom:12px">
          <div class="realtime-widget-title"><span>Live active translations</span><span>Real-time</span></div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">
            ${activeTranslationEditions.map(e => `<span class="notice-pill" style="margin-left:0;background:#13261f;color:#86efac;border-color:#22c55e">● ${esc(e.edition)}: ${fmt(e.activeUsers)} active</span>`).join('')}
          </div>
        </div>
        ${bars(data.languages.slice(0, 7).map(x => ({ name: x.language, value: x.views })))}
      ` : bars(data.languages.slice(0, 7).map(x => ({ name: x.language, value: x.views }))))}
      ${panel('Traffic channels', 'Sessions by acquisition channel', bars(data.channels.slice(0, 7)))}
    </div>
  `;

  const audience = `
    <div class="kpis">
      ${card('Live Visitors', liveCardValue, liveCardDesc, true, liveBadge)}
      ${card('Active users', fmt(o.activeUsers))}
      ${card('Sessions', fmt(o.sessions))}
      ${card('Average session', Math.round(o.averageSessionDuration) + ' sec')}
      ${card('Countries', fmt(data.countries.length), 'Countries in report')}
    </div>
    <div class="panels">
      ${panel('Visitors by country', 'Top countries by active users', bars(data.countries))}
      ${panel('Device breakdown', 'Active users by device', bars([...data.devices].sort((a, b) => b.value - a.value)))}
    </div>
    ${panel('Acquisition channels', 'How visitors reached the book', bars(data.channels))}
  `;

  const languages = `
    <div class="kpis">
      ${card('Live Edition Readers', fmt(totalLiveEditionUsers || (activeAllEditions.length ? 1 : 0)), 'Active in translations (last 30m)', true, liveBadge)}
      ${card('Active Translations', `${activeTranslationEditions.length} of 8`, 'Translations with live readers')}
      ${card('Edition views (Hist.)', fmt(data.languages.filter(x => x.language !== 'Language Selector' && x.language !== 'Other / site').reduce((s, x) => s + x.views, 0)), 'Finalized historical reports')}
      ${card('Languages supported', '8', 'Full editions available')}
    </div>
    ${panel('Active Editions (Last 30 Minutes)', 'Real-time reader activity across translations from GA4 stream', liveEditionsHtml)}
    ${processingNoticeHtml}
    <div class="panels">
      ${panel('Most-read editions (Historical)', 'Ranked by cumulative page views from finalized reports', bars(data.languages.filter(x => x.language !== 'Language Selector' && x.language !== 'Other / site').map(x => ({ name: x.language, value: x.views }))))}
      ${panel('Edition performance (Historical)', 'Engagement shown as total seconds, not average per reader', table(['Language', 'Views', 'Engagement'], data.languages.filter(x => x.language !== 'Language Selector' && x.language !== 'Other / site').map(x => [x.language, fmt(x.views), fmt(x.engagementSeconds) + 's'])))}
    </div>
    ${panel('Data interpretation', 'GA4 page paths determine edition classification. Clean routes (/index-fr, /read-ar) and query parameters (?lang=) are recognized.', '<p class="muted">This analysis uses URL-based estimates for historical tables and verified page title classifications for live telemetry. It does not count individual readers uniquely across pages.</p>')}
  `;

  const downloads = data.events.filter(x => /file_download|download/i.test(x.name));
  const audio = data.events.filter(x => /audio|play|listen/i.test(x.name));

  const content = `
    <div class="kpis">
      ${card('Book page views', fmt(o.views))}
      ${card('Average session', Math.round(o.averageSessionDuration) + ' sec')}
      ${card('Download events', fmt(downloads.reduce((n, x) => n + x.count, 0)), 'Only recorded GA4 events')}
      ${card('Audio events', fmt(audio.reduce((n, x) => n + x.count, 0)), 'Requires website event instrumentation')}
    </div>
    <div class="panels">
      ${panel('Top content', 'Pages ranked by views', table(['Page path', 'Views', 'Engagement'], data.pages.slice(0, 24).map(x => [x.path, fmt(x.views), fmt(x.engagementSeconds) + 's'])))}
      ${panel('Events being collected', 'GA4 event names and counts', table(['Event name', 'Count'], data.events.map(x => [x.name, fmt(x.count)])))}
    </div>
  `;

  $('#view').innerHTML = ({ overview, audience, languages, content })[view];
}

async function loadRealtime() {
  if (realtimeLoading) return;
  realtimeLoading = true;
  try {
    const res = await fetch('/api/realtime', { credentials: 'same-origin', cache: 'no-store' });
    const val = await res.json();
    if (!res.ok) throw Error(val.error || 'Realtime API failed');
    realtimeData = val;
    realtimeError = null;
    render();
  } catch (err) {
    realtimeError = err.message;
    console.warn('Realtime fetch failed:', err.message);
    render();
  } finally {
    realtimeLoading = false;
  }
}

async function load() {
  const alert = $('#alert');
  alert.hidden = true;
  $('#refresh').disabled = true;
  try {
    const res = await fetch('/api/report?days=' + encodeURIComponent($('#period').value), { credentials: 'same-origin', cache: 'no-store' });
    const value = await res.json();
    if (!res.ok) throw Error(value.error || 'Analytics request failed');
    data = value;
    $('#updated').textContent = 'Updated ' + new Date(value.updatedAt).toLocaleString();
    render();
    // Also fetch realtime data in parallel
    loadRealtime();
  } catch (e) {
    data = null;
    alert.textContent = 'Analytics unavailable: ' + e.message + '. Check Cloudflare Access, the numeric GA4 property ID, and the service account permissions.';
    alert.hidden = false;
    render();
  } finally {
    $('#refresh').disabled = false;
  }
}

// Navigation and Event Listeners
document.querySelectorAll('.nav').forEach(b => b.addEventListener('click', () => {
  view = b.dataset.view;
  render();
}));

$('#period').addEventListener('change', load);
$('#refresh').addEventListener('click', () => {
  load();
  loadRealtime();
});

// Periodic background polling every 60 seconds without overlapping requests
if (realtimePollInterval) clearInterval(realtimePollInterval);
realtimePollInterval = setInterval(() => {
  loadRealtime();
}, 60000);

// Initial Load
load();
