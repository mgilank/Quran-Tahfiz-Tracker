import type { FC } from "hono/jsx";
import { Layout } from "../Layout.tsx";

export const LoginPage: FC<{ error?: string }> = ({ error }) => {
  return (
    <Layout title="Sign In - Tahfiz Community">
      <div class="flex-1 flex items-center justify-center px-4">
        <div class="w-full max-w-md">
          <div class="bg-white border border-border-light rounded-2xl p-8 shadow-lg text-center">
            <div class="size-16 text-primary mx-auto mb-6">
              <svg class="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 class="text-text-main text-2xl font-black tracking-tight mb-2">
              Tahfiz Community
            </h1>
            <p class="text-text-secondary text-sm mb-8">
              Track your Quran memorization progress and stay motivated with your community during Ramadan.
            </p>

            {error && (
              <div class="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6 border border-red-200">
                Authentication failed. Please try again.
              </div>
            )}

            <a
              href="/auth/google"
              class="flex items-center justify-center gap-3 w-full px-6 py-3 bg-white border-2 border-border-light rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-text-main font-semibold text-sm shadow-sm"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </a>

            <p class="text-text-secondary text-xs mt-6">
              New members need admin approval before accessing the leaderboard.
            </p>
          </div>

          <div class="text-center mt-6">
            <p class="text-text-secondary text-xs">
              Goal: Memorize 30 Juz within Ramadan
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
