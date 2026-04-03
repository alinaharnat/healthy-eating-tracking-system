import IoTMeasurement from "../../models/iotMeasurement.js";
import { seedDate } from "./helpers/randomDate.js";

const IOT_MEASUREMENT_DATA = [
  {
    userKey: "client_andrii",
    daysAgo: 2,
    hour: 7,
    minute: 30,
    pulse: 74,
    steps: 3200,
    weight: 92.1,
  },
  {
    userKey: "client_andrii",
    daysAgo: 2,
    hour: 20,
    minute: 40,
    pulse: 82,
    steps: 10450,
    weight: 91.9,
  },
  {
    userKey: "client_andrii",
    daysAgo: 1,
    hour: 20,
    minute: 35,
    pulse: 79,
    steps: 11220,
    weight: 91.6,
  },

  {
    userKey: "client_maria",
    daysAgo: 2,
    hour: 8,
    minute: 0,
    pulse: 68,
    steps: 2800,
    weight: 67.2,
  },
  {
    userKey: "client_maria",
    daysAgo: 1,
    hour: 18,
    minute: 50,
    pulse: 76,
    steps: 9870,
    weight: 67.0,
  },
  {
    userKey: "client_maria",
    daysAgo: 0,
    hour: 19,
    minute: 15,
    pulse: 74,
    steps: 10340,
    weight: 66.9,
  },

  {
    userKey: "client_oleksii",
    daysAgo: 3,
    hour: 7,
    minute: 25,
    pulse: 70,
    steps: 3600,
    weight: 71.0,
  },
  {
    userKey: "client_oleksii",
    daysAgo: 2,
    hour: 20,
    minute: 30,
    pulse: 88,
    steps: 13100,
    weight: 71.2,
  },
  {
    userKey: "client_oleksii",
    daysAgo: 1,
    hour: 20,
    minute: 10,
    pulse: 86,
    steps: 12580,
    weight: 71.4,
  },

  {
    userKey: "client_sophia",
    daysAgo: 1,
    hour: 7,
    minute: 45,
    pulse: 66,
    steps: 2400,
    weight: 60.3,
  },
  {
    userKey: "client_sophia",
    daysAgo: 1,
    hour: 18,
    minute: 20,
    pulse: 78,
    steps: 11860,
    weight: 60.1,
  },
  {
    userKey: "client_sophia",
    daysAgo: 0,
    hour: 19,
    minute: 0,
    pulse: 75,
    steps: 10950,
    weight: 60.0,
  },

  {
    userKey: "client_taras",
    daysAgo: 2,
    hour: 7,
    minute: 15,
    pulse: 72,
    steps: 2900,
    weight: 84.2,
  },
  {
    userKey: "client_taras",
    daysAgo: 1,
    hour: 19,
    minute: 30,
    pulse: 80,
    steps: 10130,
    weight: 84.1,
  },
  {
    userKey: "client_taras",
    daysAgo: 0,
    hour: 20,
    minute: 0,
    pulse: 77,
    steps: 9600,
    weight: 84.0,
  },
];

function getRequiredUser(usersByKey, userKey) {
  const user = usersByKey[userKey];

  if (!user) {
    throw new Error(`Missing required user: ${userKey}`);
  }

  return user;
}

export async function seedIoTMeasurements({ usersByKey }) {
  const documents = IOT_MEASUREMENT_DATA.map((entry) => {
    const user = getRequiredUser(usersByKey, entry.userKey);

    return {
      userId: user._id,
      timestamp: seedDate({
        daysAgo: entry.daysAgo,
        hour: entry.hour,
        minute: entry.minute,
      }),
      pulse: entry.pulse,
      steps: entry.steps,
      weight: entry.weight,
    };
  });

  const measurements = await IoTMeasurement.insertMany(documents, {
    ordered: true,
  });

  return {
    measurementsCount: measurements.length,
  };
}
