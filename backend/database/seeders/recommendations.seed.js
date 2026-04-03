import Recommendation from "../../models/recommendation.js";

const RECOMMENDATION_DATA = [
  {
    userKey: "client_andrii",
    dietitianKey: "dietitian_diana",
    message:
      "For this week, keep dinner carbs under 60 grams and add a 25 minute evening walk 5 days out of 7.",
  },
  {
    userKey: "client_andrii",
    dietitianKey: "dietitian_diana",
    message:
      "Increase daily water intake to at least 2.5 liters and include one extra serving of vegetables at lunch.",
  },
  {
    userKey: "client_maria",
    dietitianKey: "dietitian_olha",
    message:
      "Keep protein at 1.4 grams per kg body weight and avoid skipping breakfast to stabilize appetite.",
  },
  {
    userKey: "client_maria",
    dietitianKey: "dietitian_olha",
    message:
      "Swap one sweet snack per day for Greek yogurt with fruit and monitor evening hunger levels.",
  },
  {
    userKey: "client_oleksii",
    dietitianKey: "dietitian_diana",
    message:
      "Add one extra post workout snack with at least 25 grams of protein and 50 grams of carbs.",
  },
  {
    userKey: "client_sophia",
    dietitianKey: "dietitian_olha",
    message:
      "Maintain a calorie deficit of about 300 kcal and target at least 10000 steps on weekdays.",
  },
  {
    userKey: "client_taras",
    dietitianKey: "dietitian_diana",
    message:
      "Keep meal timing consistent and reduce late evening sodium to improve morning weight stability.",
  },
];

function getRequiredUser(usersByKey, key, label) {
  const user = usersByKey[key];

  if (!user) {
    throw new Error(`Missing required ${label}: ${key}`);
  }

  return user;
}

export async function seedRecommendations({ usersByKey }) {
  const documents = RECOMMENDATION_DATA.map((entry) => {
    const user = getRequiredUser(usersByKey, entry.userKey, "client user");
    const dietitian = getRequiredUser(
      usersByKey,
      entry.dietitianKey,
      "dietitian user",
    );

    return {
      userId: user._id,
      dietitianId: dietitian._id,
      message: entry.message,
    };
  });

  const recommendations = await Recommendation.insertMany(documents, {
    ordered: true,
  });

  return {
    recommendationsCount: recommendations.length,
  };
}
