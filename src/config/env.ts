// Environment configuration
// Force rebuild to pick up NEXT_PUBLIC_API_URL from Vercel
export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
} as const;
