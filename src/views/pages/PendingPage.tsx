import type { FC } from "hono/jsx";
import { Layout } from "../Layout.tsx";
import type { User } from "../../types.ts";
import { APP_NAME } from "../../config.ts";

export const PendingPage: FC<{ user: User }> = ({ user }) => {
  return (
    <Layout title={`Awaiting Approval - ${APP_NAME}`}>
      <div class="flex-1 flex items-center justify-center px-4">
        <div class="w-full max-w-md text-center">
          <div class="bg-white border border-border-light rounded-2xl p-8 shadow-lg">
            <div class="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="material-symbols-outlined text-amber-500 text-3xl">hourglass_top</span>
            </div>
            <h1 class="text-text-main text-2xl font-black tracking-tight mb-2">
              Awaiting Approval
            </h1>
            <p class="text-text-secondary text-sm mb-6">
              Assalamu'alaikum, <strong class="text-text-main">{user.name}</strong>! Your account
              has been registered and is awaiting admin approval. You'll be able to access the
              community once approved.
            </p>
            <div class="bg-slate-50 rounded-lg p-4 text-left text-sm space-y-2">
              <div class="flex justify-between">
                <span class="text-text-secondary">Email</span>
                <span class="text-text-main font-medium">{user.email}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-secondary">Status</span>
                <span class="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">
                  Pending
                </span>
              </div>
            </div>
            <form method="POST" action="/auth/logout" class="mt-6">
              <button
                type="submit"
                class="text-text-secondary hover:text-red-500 transition-colors text-sm font-medium"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
