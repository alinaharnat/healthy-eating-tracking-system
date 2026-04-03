import User from "../../models/user.js";
import { hashPassword } from "./helpers/hashPassword.js";

export const DEV_PASSWORD = "Test12345!";

const CORE_USERS = [
  {
    key: "admin_olena",
    name: "Olena Admin",
    email: "admin@macro.local",
    role: "admin",
    language: "en",
    isActive: true,
    plainPassword: DEV_PASSWORD,
  },
  {
    key: "dietitian_diana",
    name: "Diana Kovalenko",
    email: "diana.dietitian@macro.local",
    role: "dietitian",
    age: 34,
    weight: 62,
    height: 170,
    language: "en",
    isActive: true,
    plainPassword: DEV_PASSWORD,
  },
  {
    key: "dietitian_olha",
    name: "Olha Melnyk",
    email: "olha.dietitian@macro.local",
    role: "dietitian",
    age: 38,
    weight: 64,
    height: 168,
    language: "ua",
    isActive: true,
    plainPassword: DEV_PASSWORD,
  },
];

const CLIENT_USERS = [
  {
    key: "client_andrii",
    name: "Andrii Shevchenko",
    email: "andrii.client@macro.local",
    role: "client",
    age: 29,
    weight: 92,
    height: 182,
    language: "ua",
    goalType: "lose",
    dailyCalorieGoal: 2100,
    dietitianKey: "dietitian_diana",
    isActive: true,
    plainPassword: DEV_PASSWORD,
  },
  {
    key: "client_maria",
    name: "Maria Lewis",
    email: "maria.client@macro.local",
    role: "client",
    age: 31,
    weight: 67,
    height: 169,
    language: "en",
    goalType: "maintain",
    dailyCalorieGoal: 2000,
    dietitianKey: "dietitian_olha",
    isActive: true,
    plainPassword: DEV_PASSWORD,
  },
  {
    key: "client_oleksii",
    name: "Oleksii Bondar",
    email: "oleksii.client@macro.local",
    role: "client",
    age: 24,
    weight: 71,
    height: 177,
    language: "ua",
    goalType: "gain",
    dailyCalorieGoal: 2850,
    dietitianKey: "dietitian_diana",
    isActive: true,
    plainPassword: DEV_PASSWORD,
  },
  {
    key: "client_sophia",
    name: "Sophia Turner",
    email: "sophia.client@macro.local",
    role: "client",
    age: 27,
    weight: 60,
    height: 165,
    language: "en",
    goalType: "lose",
    dailyCalorieGoal: 1800,
    dietitianKey: "dietitian_olha",
    isActive: true,
    plainPassword: DEV_PASSWORD,
  },
  {
    key: "client_taras",
    name: "Taras Hnatiuk",
    email: "taras.client@macro.local",
    role: "client",
    age: 35,
    weight: 84,
    height: 180,
    language: "ua",
    goalType: "maintain",
    dailyCalorieGoal: 2350,
    dietitianKey: "dietitian_diana",
    isActive: true,
    plainPassword: DEV_PASSWORD,
  },
];

function getRequiredUser(usersByKey, key, label) {
  const user = usersByKey[key];

  if (!user) {
    throw new Error(`Missing required ${label}: ${key}`);
  }

  return user;
}

async function buildUserDocument(seedUser, usersByKey) {
  const { key, plainPassword, dietitianKey, ...rest } = seedUser;

  const passwordHash = await hashPassword(plainPassword);

  const document = {
    ...rest,
    passwordHash,
  };

  if (dietitianKey) {
    const assignedDietitian = getRequiredUser(
      usersByKey,
      dietitianKey,
      "dietitian",
    );
    document.dietitianId = assignedDietitian._id;
  }

  return {
    key,
    document,
  };
}

export async function seedUsers() {
  const usersByKey = {};

  for (const seedUser of CORE_USERS) {
    const { key, document } = await buildUserDocument(seedUser, usersByKey);
    const created = await User.create(document);
    usersByKey[key] = created;
  }

  const clientDocuments = [];

  for (const seedUser of CLIENT_USERS) {
    const { key, document } = await buildUserDocument(seedUser, usersByKey);
    clientDocuments.push({ key, document });
  }

  for (const entry of clientDocuments) {
    const created = await User.create(entry.document);
    usersByKey[entry.key] = created;
  }

  return {
    usersByKey,
    usersCount: Object.keys(usersByKey).length,
    devPassword: DEV_PASSWORD,
  };
}
