// Environment configuration
const isDevelopment = process.env.NODE_ENV === "development";
const productionApiUrl = "https://catering-api-production.up.railway.app/api";
const developmentApiUrl = "http://localhost:3000/api";

export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 
    (isDevelopment ? developmentApiUrl : productionApiUrl),
} as const;
