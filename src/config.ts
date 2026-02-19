export const APP_NAME = process.env.APP_NAME || "Tahfiz Community";

export const GOOGLE_REDIRECT_URI =
    process.env.GOOGLE_REDIRECT_URI ||
    `${process.env.APP_URL || "http://localhost:3000"}/auth/google/callback`;
