// Environment configuration
// Workaround: Vercel is not picking up NEXT_PUBLIC_API_URL
// Using hardcoded production URL and local override
const isDevelopment = process.env.NODE_ENV === "development";
const productionApiUrl = "https://catering-api-production.up.railway.app/api";
const developmentApiUrl = "http://localhost:3000/api";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
  (isDevelopment ? developmentApiUrl : productionApiUrl);

export const env = {
  API_URL: apiUrl,
} as const;
