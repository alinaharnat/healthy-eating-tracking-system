import Report from "../../models/report.js";
import { seedDate } from "./helpers/randomDate.js";

const REPORT_DATA = [
  {
    userKey: "client_andrii",
    fileUrl: "https://files.macro.local/reports/andrii-blood-panel-2026-03.pdf",
    daysAgo: 10,
    hour: 10,
    minute: 5,
  },
  {
    userKey: "client_andrii",
    fileUrl:
      "https://files.macro.local/reports/andrii-body-composition-2026-02.pdf",
    daysAgo: 34,
    hour: 9,
    minute: 40,
  },
  {
    userKey: "client_maria",
    fileUrl:
      "https://files.macro.local/reports/maria-thyroid-check-2026-03.pdf",
    daysAgo: 18,
    hour: 11,
    minute: 20,
  },
  {
    userKey: "client_oleksii",
    fileUrl:
      "https://files.macro.local/reports/oleksii-sports-screening-2026-03.pdf",
    daysAgo: 12,
    hour: 8,
    minute: 50,
  },
  {
    userKey: "client_sophia",
    fileUrl:
      "https://files.macro.local/reports/sophia-vitamin-panel-2026-03.pdf",
    daysAgo: 22,
    hour: 14,
    minute: 10,
  },
  {
    userKey: "client_taras",
    fileUrl:
      "https://files.macro.local/reports/taras-cardiology-check-2026-03.pdf",
    daysAgo: 15,
    hour: 16,
    minute: 35,
  },
];

function getRequiredUser(usersByKey, userKey) {
  const user = usersByKey[userKey];

  if (!user) {
    throw new Error(`Missing required user: ${userKey}`);
  }

  return user;
}

export async function seedReports({ usersByKey }) {
  const documents = REPORT_DATA.map((entry) => {
    const user = getRequiredUser(usersByKey, entry.userKey);

    return {
      userId: user._id,
      fileUrl: entry.fileUrl,
      createdAt: seedDate({
        daysAgo: entry.daysAgo,
        hour: entry.hour,
        minute: entry.minute,
      }),
    };
  });

  const reports = await Report.insertMany(documents, { ordered: true });

  return {
    reportsCount: reports.length,
  };
}
