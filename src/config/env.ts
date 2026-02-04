// Environment configuration
// Force rebuild to pick up NEXT_PUBLIC_API_URL from Vercel
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (typeof window !== "undefined") {
  console.log("🔍 DEBUG - NEXT_PUBLIC_API_URL:", apiUrl);
  console.log("🔍 DEBUG - All env vars:", Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')));
}

export const env = {
  API_URL: apiUrl || "http://localhost:3000/api",
} as const;
