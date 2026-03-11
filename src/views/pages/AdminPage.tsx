import type { FC } from "hono/jsx";
import { Layout } from "../Layout.tsx";
import { Header } from "../components/Header.tsx";
import type { User } from "../../types.ts";
import { APP_NAME } from "../../config.ts";

export const AdminPage: FC<{
  user: User;
  pendingUsers: User[];
  allUsers: User[];
  success?: string;
}> = ({ user, pendingUsers, allUsers, success }) => {
  return (
    <Layout title={`Admin Panel - ${APP_NAME}`}>
      <Header user={user} currentPath="/admin" />
      <main class="flex-1 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
        <div class="w-full flex flex-col gap-2 mb-8">
          <h1 class="text-text-main dark:text-text-main-dark text-3xl font-black leading-tight tracking-[-0.033em]">
            Admin Panel
          </h1>
          <p class="text-text-secondary dark:text-text-secondary-dark text-base font-normal leading-normal">
            Manage community members. Approve or reject new registrations.
          </p>
        </div>

        {success && (
          <div class="w-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm px-4 py-3 rounded-lg mb-6 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">check_circle</span>
            {success}
          </div>
        )}

        {/* Pending approvals */}
        {pendingUsers.length > 0 && (
          <div class="w-full bg-surface dark:bg-surface-dark border border-amber-200 dark:border-amber-800/50 rounded-xl overflow-hidden shadow-sm mb-8">
            <div class="px-6 py-4 border-b border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10">
              <h2 class="text-text-main dark:text-text-main-dark text-lg font-bold flex items-center gap-2">
                <span class="material-symbols-outlined text-amber-500 dark:text-amber-400">hourglass_top</span>
                Pending Approvals ({pendingUsers.length})
              </h2>
            </div>
            <div class="divide-y divide-border-light dark:divide-border-light-dark">
              {pendingUsers.map((u) => (
                <div class="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div class="flex items-center gap-3">
                    {u.avatar_url ? (
                      <div
                        class="bg-center bg-no-repeat bg-cover rounded-full size-10 flex-shrink-0"
                        style={`background-image: url("${u.avatar_url}");`}
                      />
                    ) : (
                      <div class="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-text-secondary dark:text-text-secondary-dark text-xs font-bold border border-slate-200 dark:border-slate-700">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <p class="text-text-main dark:text-text-main-dark text-sm font-bold">{u.name}</p>
                      <p class="text-text-secondary dark:text-text-secondary-dark text-xs">{u.email}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <form method="POST" action={`/admin/users/${u.id}/approve`}>
                      <button
                        type="submit"
                        class="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm"
                      >
                        Approve
                      </button>
                    </form>
                    <form method="POST" action={`/admin/users/${u.id}/reject`}>
                      <button
                        type="submit"
                        class="px-4 py-2 bg-surface dark:bg-surface-dark text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All members */}
        <div class="w-full bg-surface dark:bg-surface-dark border border-border-light dark:border-border-light-dark rounded-xl overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-border-light dark:border-border-light-dark bg-slate-50/50 dark:bg-slate-800/50">
            <h2 class="text-text-main dark:text-text-main-dark text-lg font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">group</span>
              All Members ({allUsers.length})
            </h2>
          </div>
          <div class="divide-y divide-border-light dark:divide-border-light-dark">
            {allUsers.map((u) => (
              <div class="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div class="flex items-center gap-3">
                  {u.avatar_url ? (
                    <div
                      class="bg-center bg-no-repeat bg-cover rounded-full size-10 flex-shrink-0"
                      style={`background-image: url("${u.avatar_url}");`}
                    />
                  ) : (
                    <div class="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-text-secondary dark:text-text-secondary-dark text-xs font-bold border border-slate-200 dark:border-slate-700">
                      {u.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <p class="text-text-main dark:text-text-main-dark text-sm font-bold flex items-center gap-2">
                      {u.name}
                      {u.id === user.id && (
                        <span class="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded uppercase tracking-wider font-black">
                          You
                        </span>
                      )}
                    </p>
                    <p class="text-text-secondary dark:text-text-secondary-dark text-xs">{u.email}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span
                    class={`text-xs font-bold px-2 py-1 rounded ${u.role === "admin"
                      ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50"
                      : u.role === "member"
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                        : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
                      }`}
                  >
                    {u.role}
                  </span>
                  {u.role === "member" && u.id !== user.id && (
                    <form method="POST" action={`/admin/users/${u.id}/role`}>
                      <input type="hidden" name="role" value="admin" />
                      <button
                        type="submit"
                        class="text-text-secondary dark:text-text-secondary-dark hover:text-primary transition-colors text-xs font-medium transition-colors"
                      >
                        Make Admin
                      </button>
                    </form>
                  )}
                  {u.role !== "admin" && u.id !== user.id && (
                    <form
                      method="POST"
                      action={`/admin/users/${u.id}/delete`}
                      onsubmit="return confirm('Remove ' + this.dataset.name + '? This will delete all their progress data and cannot be undone.')"
                      data-name={u.name}
                    >
                      <button
                        type="submit"
                        class="text-text-secondary dark:text-text-secondary-dark hover:text-red-500 dark:hover:text-red-400 text-xs font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
};
