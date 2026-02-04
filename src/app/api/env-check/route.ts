import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "NOT SET",
    allPublicVars: Object.keys(process.env)
      .filter((k) => k.startsWith("NEXT_PUBLIC_"))
      .reduce(
        (acc, key) => {
          acc[key] = process.env[key];
          return acc;
        },
        {} as Record<string, string | undefined>,
      ),
  });
}
