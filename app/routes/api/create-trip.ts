import { GoogleGenerativeAI } from "@google/generative-ai";
import { ID } from "appwrite";
import { data, type ActionFunctionArgs } from "react-router";
import { appwriteConfig, databases } from "~/appwrite/client";
import { parseMarkdownToJson } from "~/lib/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
  console.log("GEMINI_API_KEY length:", process.env.GEMINI_API_KEY?.length);
  const {
    country,
    duration,
    travelStyles,
    interests,
    budget,
    groupType,
    userId,
  } = await request.json();

  const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

  try {
    const prompt = `You are a JSON API.
    Generate a highly detailed ${duration}-day travel itinerary for ${country}, strictly based on the following user preferences:
- Budget: "${budget}"
- Interests: "${interests}"
- Travel style: "${travelStyles}"
- Group type: "${groupType}"

IMPORTANT RULES:
- Return ONLY valid JSON
- Do NOT include markdown, code blocks, comments, explanations, or extra text
- Do NOT include trailing commas
- All strings must be wrapped in double quotes
- All arrays must be complete (no "..." placeholders)

The JSON must follow EXACTLY this structure:

{
  "name": "A short, catchy title for the trip",
  "description": "A concise overview of the trip highlighting key experiences and attractions (maximum 100 words)",
  "estimatedPrice": "Lowest estimated average cost in USD, e.g. $1200",
  "duration": ${duration},
  "budget": "${budget}",
  "travelStyles": "${travelStyles}",
  "country": "${country}",
  "interests": "${interests}",
  "groupType": "${groupType}",
  "bestTimeToVisit": [
    "Spring (months): reason to visit",
    "Summer (months): reason to visit",
    "Autumn (months): reason to visit",
    "Winter (months): reason to visit"
  ],
  "weatherInfo": [
    "Spring: temperature range in Celsius (Fahrenheit)",
    "Summer: temperature range in Celsius (Fahrenheit)",
    "Autumn: temperature range in Celsius (Fahrenheit)",
    "Winter: temperature range in Celsius (Fahrenheit)"
  ],
  "location": {
    "city": "Primary city or region for the trip",
    "coordinates": [latitude, longitude],
    "openStreetMap": "Valid OpenStreetMap URL for the location"
  },
  "itinerary": [
    {
      "day": 1,
      "location": "City or region name",
      "activities": [
        {
          "time": "Morning",
          "description": "Detailed morning activity with local tips"
        },
        {
          "time": "Afternoon",
          "description": "Lunch and afternoon experience with local recommendations"
        },
        {
          "time": "Evening",
          "description": "Evening activity such as cultural events, nightlife, or scenic walks"
        }
      ],
      "transport": "Recommended transportation method for the day"
    }
  ],
  "additionalTips": [
    "Important safety tips and cultural etiquette",
    "Recommended souvenirs or shopping areas",
    "Best locations for photography"
  ]
}`;

    const textResult = await genAi
      .getGenerativeModel({ model: "gemini-2.0-flash" })
      .generateContent([prompt]);

    console.log(
      "Generated trip itinerary(Raw Gemini Response):",
      textResult.response.text(),
    );

    const tripData = parseMarkdownToJson(textResult.response.text());
    if (!tripData) {
      throw new Error("Failed to parse trip data from AI response");
    }
    console.log("Parsed trip data:", tripData);

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyles}&client_id=${unsplashApiKey}`,
    );
    const imageUrls = (await imageResponse.json()).results
      .slice(0, 3)
      .map((result: any) => result.urls?.regular || null);

    const result = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tripsId,
      ID.unique(),
      {
        tripDetail: JSON.stringify(tripData),
        createdAt: new Date().toISOString(),
        imageUrls,
        userId,
      },
    );
    return data(result.$id);
  } catch (e) {
    console.error("Error generating travel plans ", e);
  }
};
