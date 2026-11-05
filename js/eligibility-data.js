// Entries into the Indian Armed Forces used by the eligibility checker (eligibility.html).
// Rules checked against the latest notifications in November 2026.
// When a new notification changes an age limit or a mark, edit the entry here;
// the checker reads everything from this list.
//
// age:     [minimum, maximum] in years. Each notification gives an exact date-of-birth
//          window counted on the course start date, so the checker treats these as a guide.
// gender:  "m", "f" or both.
// marital: "unmarried" | "any" | "ota"   ("ota": unmarried men; unmarried, widowed or
//          divorced women) | "afcat" (unmarried if under 25)
// edu:     a test run against the candidate's answers (see js/eligibility.js).

window.SYF_ENTRIES_CHECKED = "November 2026";

window.SYF_ENTRIES = [
  // ---------- Officer entries after Class 12 ----------
  {
    id: "nda-army", force: "Army", kind: "Officer", stage: "After Class 12",
    name: "NDA (Army wing)",
    via: "UPSC NDA and NA exam, twice a year",
    commission: "Permanent Commission. 3 years at NDA Khadakwasla, then 1 year at IMA Dehradun",
    age: [16.5, 19.5], gender: ["m", "f"], marital: "unmarried",
    eduText: "Class 12 in any stream. Students in Class 12 can apply.",
    edu: "nda-army",
    selection: "Written exam, SSB interview, medical",
    link: "https://upsc.gov.in"
  },
  {
    id: "nda-navy-af", force: "Navy / Air Force", kind: "Officer", stage: "After Class 12",
    name: "NDA (Navy and Air Force wings) and Naval Academy 10+2",
    via: "UPSC NDA and NA exam, twice a year",
    commission: "Permanent Commission. 3 years at NDA, then the Naval or Air Force Academy",
    age: [16.5, 19.5], gender: ["m", "f"], marital: "unmarried",
    eduText: "Class 12 with Physics and Mathematics. Students in Class 12 can apply.",
    edu: "nda-pm",
    selection: "Written exam, SSB interview, medical (Air Force: pilot aptitude test)",
    link: "https://upsc.gov.in"
  },
  {
    id: "tes", force: "Army", kind: "Officer", stage: "After Class 12",
    name: "Army 10+2 Technical Entry Scheme (TES)",
    via: "Direct application on joinindianarmy.nic.in, twice a year",
    commission: "Permanent Commission. Engineering degree while in training",
    age: [16.5, 19.5], gender: ["m"], marital: "unmarried",
    eduText: "Class 12 with Physics, Chemistry and Maths, at least 60% in PCM, and appeared in JEE (Main).",
    edu: "tes",
    selection: "Shortlisting on JEE (Main) score, SSB interview, medical",
    link: "https://joinindianarmy.nic.in"
  },
  {
    id: "navy-btech", force: "Navy", kind: "Officer", stage: "After Class 12",
    name: "Navy 10+2 B.Tech Cadet Entry",
    via: "Direct application on joinindiannavy.gov.in, twice a year",
    commission: "Permanent Commission. 4-year B.Tech at the Indian Naval Academy, Ezhimala",
    age: [16.5, 19.5], gender: ["m", "f"], marital: "unmarried",
    eduText: "Class 12 with at least 70% in Physics, Chemistry and Maths, 50% in English (Class 10 or 12), and appeared in JEE (Main).",
    edu: "navy-btech",
    selection: "Shortlisting on JEE (Main) rank, SSB interview, medical",
    link: "https://www.joinindiannavy.gov.in"
  },

  // ---------- Officer entries for graduates ----------
  {
    id: "cds-ima", force: "Army", kind: "Officer", stage: "Graduates",
    name: "CDS: Indian Military Academy (IMA)",
    via: "UPSC CDS exam, twice a year",
    commission: "Permanent Commission. 18 months at IMA Dehradun",
    age: [19, 24], gender: ["m"], marital: "unmarried",
    eduText: "Bachelor's degree in any subject. Final-year students can apply.",
    edu: "grad",
    selection: "Written exam, SSB interview, medical",
    link: "https://upsc.gov.in"
  },
  {
    id: "cds-ina", force: "Navy", kind: "Officer", stage: "Graduates",
    name: "CDS: Indian Naval Academy (INA)",
    via: "UPSC CDS exam, twice a year",
    commission: "Permanent Commission. Training at INA Ezhimala",
    age: [19, 24], gender: ["m"], marital: "unmarried",
    eduText: "Degree in Engineering (B.E. or B.Tech). Final-year students can apply.",
    edu: "btech",
    selection: "Written exam, SSB interview, medical",
    link: "https://upsc.gov.in"
  },
  {
    id: "cds-afa", force: "Air Force", kind: "Officer", stage: "Graduates",
    name: "CDS: Air Force Academy (AFA)",
    via: "UPSC CDS exam, twice a year",
    commission: "Permanent Commission in the Flying branch",
    age: [20, 24], gender: ["m"], marital: "unmarried",
    eduText: "Degree with Physics and Maths in Class 12, or B.E./B.Tech. Final-year students can apply.",
    edu: "grad-pm",
    selection: "Written exam, SSB interview with pilot aptitude test, medical",
    link: "https://upsc.gov.in"
  },
  {
    id: "cds-ota", force: "Army", kind: "Officer", stage: "Graduates",
    name: "CDS: Officers' Training Academy (OTA)",
    via: "UPSC CDS exam, twice a year",
    commission: "Short Service Commission. 49 weeks at OTA Chennai",
    age: [19, 25], gender: ["m", "f"], marital: "ota",
    eduText: "Bachelor's degree in any subject. Final-year students can apply.",
    edu: "grad",
    selection: "Written exam (English, GK), SSB interview, medical",
    link: "https://upsc.gov.in"
  },
  {
    id: "afcat-flying", force: "Air Force", kind: "Officer", stage: "Graduates",
    name: "AFCAT: Flying branch",
    via: "AFCAT exam, twice a year",
    commission: "Short Service Commission as a pilot",
    age: [20, 24], gender: ["m", "f"], marital: "unmarried",
    eduText: "Class 12 with at least 50% in Maths and Physics, plus a degree with 60% (or B.E./B.Tech with 60%).",
    edu: "afcat-flying",
    selection: "AFCAT exam, AFSB interview with pilot aptitude test, medical",
    link: "https://afcat.cdac.in"
  },
  {
    id: "afcat-tech", force: "Air Force", kind: "Officer", stage: "Graduates",
    name: "AFCAT: Ground Duty (Technical)",
    via: "AFCAT exam, twice a year",
    commission: "Short Service Commission as an aeronautical engineer",
    age: [20, 26], gender: ["m", "f"], marital: "afcat",
    eduText: "Class 12 with at least 50% in Physics and Maths, plus a 4-year engineering degree with 60%.",
    edu: "afcat-tech",
    selection: "AFCAT and EKT exams, AFSB interview, medical",
    link: "https://afcat.cdac.in"
  },
  {
    id: "afcat-ground", force: "Air Force", kind: "Officer", stage: "Graduates",
    name: "AFCAT: Ground Duty (Non-Technical)",
    via: "AFCAT exam, twice a year",
    commission: "Short Service Commission in Administration, Logistics, Accounts and other branches",
    age: [20, 26], gender: ["m", "f"], marital: "afcat",
    eduText: "Degree in any subject with 60% (Accounts branch: B.Com with 60%).",
    edu: "grad60",
    selection: "AFCAT exam, AFSB interview, medical",
    link: "https://afcat.cdac.in"
  },
  {
    id: "ncc", force: "Army", kind: "Officer", stage: "Graduates",
    name: "NCC Special Entry (Army)",
    via: "Direct application on joinindianarmy.nic.in, twice a year. No written exam",
    commission: "Short Service Commission. Training at OTA Chennai",
    age: [19, 25], gender: ["m", "f"], marital: "unmarried",
    eduText: "Degree with at least 50% marks and an NCC 'C' certificate with at least 'B' grade.",
    edu: "ncc",
    selection: "Shortlisting, SSB interview, medical",
    link: "https://joinindianarmy.nic.in"
  },
  {
    id: "ncc-af", force: "Air Force", kind: "Officer", stage: "Graduates",
    name: "NCC Special Entry (Air Force, Flying branch)",
    via: "Applied through the AFCAT notification, twice a year. No AFCAT exam",
    commission: "Short Service Commission as a pilot",
    age: [20, 24], gender: ["m", "f"], marital: "unmarried",
    eduText: "NCC Air Wing (Senior Division) 'C' certificate, plus the Flying branch education: degree with 60% and 50% in Maths and Physics in Class 12.",
    edu: "ncc-af",
    selection: "AFSB interview with pilot aptitude test, medical",
    link: "https://afcat.cdac.in"
  },
  {
    id: "tgc", force: "Army", kind: "Officer", stage: "Engineers",
    name: "Technical Graduate Course (TGC)",
    via: "Direct application on joinindianarmy.nic.in, twice a year. No written exam",
    commission: "Permanent Commission. Training at IMA Dehradun",
    age: [20, 27], gender: ["m"], marital: "unmarried",
    eduText: "B.E./B.Tech in a notified engineering stream. Final-year students can apply.",
    edu: "btech",
    selection: "Shortlisting on marks, SSB interview, medical",
    link: "https://joinindianarmy.nic.in"
  },
  {
    id: "ssc-tech", force: "Army", kind: "Officer", stage: "Engineers",
    name: "Short Service Commission (Technical)",
    via: "Direct application on joinindianarmy.nic.in, twice a year. No written exam",
    commission: "Short Service Commission. Training at OTA Chennai",
    age: [20, 27], gender: ["m", "f"], marital: "unmarried",
    eduText: "B.E./B.Tech in a notified engineering stream. Final-year students can apply.",
    edu: "btech",
    selection: "Shortlisting on marks, SSB interview, medical",
    link: "https://joinindianarmy.nic.in"
  },
  {
    id: "jag", force: "Army", kind: "Officer", stage: "Law graduates",
    name: "Judge Advocate General (JAG) Entry",
    via: "Direct application on joinindianarmy.nic.in, twice a year",
    commission: "Short Service Commission in the Army's legal branch",
    age: [21, 27], gender: ["m", "f"], marital: "unmarried",
    eduText: "LLB (3 or 5 years) with at least 55%, eligible to enrol with the Bar Council.",
    edu: "jag",
    selection: "Shortlisting (CLAT PG score), SSB interview, medical",
    link: "https://joinindianarmy.nic.in"
  },
  {
    id: "navy-ssc", force: "Navy", kind: "Officer", stage: "Graduates",
    name: "Navy Short Service Commission (Executive, Technical, Education, Logistics)",
    via: "Direct application on joinindiannavy.gov.in (INET exam), twice a year",
    commission: "Short Service Commission. Branch depends on your degree",
    age: [19.5, 25], gender: ["m", "f"], marital: "unmarried",
    eduText: "Most branches: B.E./B.Tech with 60%. Logistics also takes MBA, MCA or M.Sc (IT); Education takes some M.Sc degrees. Age limits differ by branch.",
    edu: "navy-ssc",
    selection: "INET exam, SSB interview, medical",
    link: "https://www.joinindiannavy.gov.in"
  },
  {
    id: "ta", force: "Army", kind: "Officer", stage: "Working professionals",
    name: "Territorial Army officer",
    via: "Territorial Army exam, about once a year (notified on the Join Territorial Army portal)",
    commission: "Part-time commission alongside your civilian job",
    age: [18, 42], gender: ["m", "f"], marital: "any",
    eduText: "Degree in any subject, and gainfully employed or self-employed.",
    edu: "ta",
    selection: "Written exam, interview, SSB, medical",
    link: ""
  },

  // ---------- Agniveer (4-year service under the Agnipath scheme) ----------
  {
    id: "agni-gd", force: "Army", kind: "Agniveer", stage: "After Class 10",
    name: "Army Agniveer: General Duty",
    via: "Online exam (CEE) and recruitment rally, once a year",
    commission: "4 years under Agnipath; up to 25% retained as regular soldiers",
    age: [17.5, 22], gender: ["m"], marital: "unmarried",
    eduText: "Class 10 with at least 45% overall and 33% in each subject.",
    edu: "agni-gd",
    selection: "Online exam, physical test (1.6 km run, pull-ups), medical",
    link: "https://joinindianarmy.nic.in"
  },
  {
    id: "agni-wmp", force: "Army", kind: "Agniveer", stage: "After Class 10",
    name: "Army Agniveer: Women Military Police",
    via: "Online exam (CEE) and recruitment rally, once a year",
    commission: "4 years under Agnipath",
    age: [17.5, 22], gender: ["f"], marital: "unmarried",
    eduText: "Class 10 with at least 45% overall and 33% in each subject.",
    edu: "agni-gd",
    selection: "Online exam, physical test, medical",
    link: "https://joinindianarmy.nic.in"
  },
  {
    id: "agni-tradesman", force: "Army", kind: "Agniveer", stage: "After Class 8 or 10",
    name: "Army Agniveer: Tradesman",
    via: "Online exam (CEE) and recruitment rally, once a year",
    commission: "4 years under Agnipath",
    age: [17.5, 22], gender: ["m"], marital: "unmarried",
    eduText: "Class 10 pass (Class 8 pass for some trades).",
    edu: "agni-trade",
    selection: "Online exam, physical test, trade test, medical",
    link: "https://joinindianarmy.nic.in"
  },
  {
    id: "agni-tech", force: "Army", kind: "Agniveer", stage: "After Class 12",
    name: "Army Agniveer: Technical",
    via: "Online exam (CEE) and recruitment rally, once a year",
    commission: "4 years under Agnipath",
    age: [17.5, 22], gender: ["m"], marital: "unmarried",
    eduText: "Class 12 with Physics, Chemistry, Maths and English, at least 50% overall and 40% in each subject.",
    edu: "agni-tech",
    selection: "Online exam, physical test, medical",
    link: "https://joinindianarmy.nic.in"
  },
  {
    id: "agni-clerk", force: "Army", kind: "Agniveer", stage: "After Class 12",
    name: "Army Agniveer: Clerk / Store Keeper Technical",
    via: "Online exam (CEE) and recruitment rally, once a year",
    commission: "4 years under Agnipath",
    age: [17.5, 22], gender: ["m"], marital: "unmarried",
    eduText: "Class 12 in any stream with at least 60% overall and 50% in each subject, including English.",
    edu: "agni-clerk",
    selection: "Online exam, typing test, physical test, medical",
    link: "https://joinindianarmy.nic.in"
  },
  {
    id: "vayu-sci", force: "Air Force", kind: "Agniveer", stage: "After Class 12",
    name: "Agniveervayu (Science subjects)",
    via: "Online exam on iafrecruitment.edcil.co.in, twice a year",
    commission: "4 years under Agnipath",
    age: [17.5, 21], gender: ["m", "f"], marital: "unmarried",
    eduText: "Class 12 with Physics, Maths and English, 50% overall and 50% in English; or a 3-year engineering diploma with 50%.",
    edu: "vayu-sci",
    selection: "Online exam, physical fitness test, adaptability test, medical",
    link: "https://iafrecruitment.edcil.co.in"
  },
  {
    id: "vayu-other", force: "Air Force", kind: "Agniveer", stage: "After Class 12",
    name: "Agniveervayu (Other than Science)",
    via: "Online exam on iafrecruitment.edcil.co.in, twice a year",
    commission: "4 years under Agnipath",
    age: [17.5, 21], gender: ["m", "f"], marital: "unmarried",
    eduText: "Class 12 in any stream with 50% overall and 50% in English.",
    edu: "vayu-other",
    selection: "Online exam, physical fitness test, adaptability test, medical",
    link: "https://iafrecruitment.edcil.co.in"
  },
  {
    id: "navy-ssr", force: "Navy", kind: "Agniveer", stage: "After Class 12",
    name: "Navy Agniveer: Senior Secondary Recruit (SSR)",
    via: "Online exam on joinindiannavy.gov.in, twice a year",
    commission: "4 years under Agnipath",
    age: [17.5, 22], gender: ["m", "f"], marital: "unmarried",
    eduText: "Class 12 with Maths and Physics and at least 50% overall; or a 3-year engineering diploma.",
    edu: "navy-ssr",
    selection: "Online exam, physical fitness test, medical",
    link: "https://www.joinindiannavy.gov.in"
  },
  {
    id: "navy-mr", force: "Navy", kind: "Agniveer", stage: "After Class 10",
    name: "Navy Agniveer: Matric Recruit (MR)",
    via: "Online exam on joinindiannavy.gov.in",
    commission: "4 years under Agnipath, as a chef, steward or hygienist",
    age: [17.5, 22], gender: ["m", "f"], marital: "unmarried",
    eduText: "Class 10 pass.",
    edu: "ten",
    selection: "Online exam, physical fitness test, medical",
    link: "https://www.joinindiannavy.gov.in",
    note: "Vacancies for women are not offered in every batch."
  }
];
