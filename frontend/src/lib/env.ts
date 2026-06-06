const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  userId: process.env.NEXT_PUBLIC_USER_ID ?? "demo-user",
} as const;

export const getRequiredEnv = getEnv;
