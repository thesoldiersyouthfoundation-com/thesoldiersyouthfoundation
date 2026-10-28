# Google Sheets: submissions, email alerts and impact stats

Every form on the site (Contact, Training application, Partnership enquiry) is sent to Formspree **and** to a Google Sheet. The sheet emails an alert for each submission and also supplies the impact figures shown on the home page.

Sign in to Google as **thesoldiersyouthfoundation@gmail.com** for every step.

## 1. Create the sheet

1. Go to sheets.google.com and create a blank spreadsheet named **SYF Website Submissions**.
2. **Extensions → Apps Script**. Delete the sample code.
3. Paste the whole of `apps-script/Code.gs` from this repo. Save.

## 2. Create the tabs

1. In the Apps Script editor, open the function dropdown next to **Run** and pick **setup** (it is the default). Then click **Run**. Do not run `doPost` or `doGet` from the editor; they only work when the website calls them.
2. Google asks for permission. Review it and allow it for the foundation's account. The script needs to edit this spreadsheet and send email as you.
3. The sheet now has tabs **Applications**, **Partnerships**, **Contact** and **Stats**.

## 3. Publish the web app

1. **Deploy → New deployment → Select type: Web app**.
2. Execute as: **Me**. Who has access: **Anyone**.
3. Deploy and copy the **Web app URL** (it ends in `/exec`).
4. Paste it into `js/config.js`:

```js
window.SYF_CONFIG = {
  sheetsUrl: "https://script.google.com/macros/s/XXXX/exec"
};
```

5. Commit and push. Leaving `sheetsUrl` empty switches Sheets off; Formspree keeps working.

After editing `Code.gs` later: **Deploy → Manage deployments → Edit → Version: New version → Deploy**. The URL stays the same.

## 4. Show impact figures on the site

In the **Stats** tab:

| Label | Value | Show on website |
|---|---|---|
| Young people trained | 240 | ☑ |
| Selected into the Armed Forces | 38 | ☑ |
| As of | October 2026 | |

- Only rows with a value **and** the box ticked appear. Add, rename or reorder rows freely.
- The **As of** row sets the line under the figures.
- Changes show on the site within 5 minutes.
- No ticked rows: the Impact section stays hidden.

## 5. Email alerts

- Each submission emails `NOTIFY_EMAIL` (top of `Code.gs`), with a link to the sheet. Reply goes straight to the sender when they gave an email.
- Formspree also emails each submission. To get only one email, either set `SEND_EMAIL_ALERTS = false` in `Code.gs` or turn off email in Formspree (Workflow → Actions).
- Gmail allows about 100 script emails a day on a free account (1,500 on Workspace).

## Privacy

Applications include minors' names, ages and phone numbers. Keep the sheet shared only with the people who need it, never "Anyone with the link".
