// The Soldiers Youth Foundation — website submissions and impact stats.
// Paste into Extensions > Apps Script of the foundation's Google Sheet.
// Setup steps: docs/google-sheets-setup.md

const NOTIFY_EMAIL = 'thesoldiersyouthfoundation@gmail.com';
const SEND_EMAIL_ALERTS = true;

const TABS = {
  'Training application': 'Applications',
  'Partnership enquiry': 'Partnerships',
  'Contact': 'Contact'
};
const STATS_TAB = 'Stats';
const MAX_FIELD_LENGTH = 2000;

// STEP 1: choose "setup" in the dropdown next to Run, then click Run once.
// It creates the Applications, Partnerships, Contact and Stats tabs.
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(TABS).forEach(k => {
    const s = ss.getSheetByName(TABS[k]) || ss.insertSheet(TABS[k]);
    if (!s.getLastRow()) { s.appendRow(['Received']); s.setFrozenRows(1); }
  });
  let st = ss.getSheetByName(STATS_TAB);
  if (!st) {
    st = ss.insertSheet(STATS_TAB);
    st.appendRow(['Label', 'Value', 'Show on website']);
    [['Young people trained'], ['Selected into the Armed Forces'], ['Placed in jobs'], ['Veteran mentors'], ['As of']]
      .forEach(r => st.appendRow([r[0], '', false]));
    st.getRange(2, 3, 5, 1).insertCheckboxes();
    st.setFrozenRows(1);
  }
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  // Run from the editor (no form data) or a spam bot: do nothing.
  if (!Object.keys(p).length || p._gotcha) return json_({ ok: true, ignored: true });

  const formName = TABS[p.form] ? p.form : 'Contact';
  const fields = Object.keys(p).filter(k => k !== 'form' && k.charAt(0) !== '_');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(TABS[formName]) || ss.insertSheet(TABS[formName]);
    let headers = sheet.getLastRow() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    if (!headers.length) {
      headers = ['Received'];
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
    }
    fields.forEach(f => {
      if (headers.indexOf(f) === -1) {
        headers.push(f);
        sheet.getRange(1, headers.length).setValue(f);
      }
    });
    sheet.appendRow(headers.map(h => h === 'Received' ? new Date() : clean_(p[h])));
  } finally {
    lock.releaseLock();
  }

  if (SEND_EMAIL_ALERTS) {
    const body = fields.map(f => f + ': ' + clean_(p[f])).join('\n') +
      '\n\nAll submissions: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl();
    const mail = {
      to: NOTIFY_EMAIL,
      subject: 'New website ' + formName.toLowerCase() + (p.name ? ': ' + clean_(p.name).slice(0, 80) : ''),
      body: body
    };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email || '')) mail.replyTo = p.email;
    MailApp.sendEmail(mail);
  }
  return json_({ ok: true });
}

function doGet(e) {
  if (!e || !e.parameter || e.parameter.action !== 'stats') return json_({ ok: true });
  const cache = CacheService.getScriptCache();
  const hit = cache.get('stats');
  if (hit) return ContentService.createTextOutput(hit).setMimeType(ContentService.MimeType.JSON);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(STATS_TAB);
  const out = { asOf: '', stats: [] };
  if (sheet && sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getDisplayValues().forEach(r => {
      const label = String(r[0]).trim(), value = String(r[1]).trim(), show = String(r[2]).toUpperCase() === 'TRUE';
      if (!label || !value) return;
      if (label.toLowerCase() === 'as of') { out.asOf = value; return; }
      if (show) out.stats.push({ label: label, value: value });
    });
  }
  const text = JSON.stringify(out);
  cache.put('stats', text, 300);
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
}

function clean_(v) {
  let s = String(v == null ? '' : v).slice(0, MAX_FIELD_LENGTH);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
