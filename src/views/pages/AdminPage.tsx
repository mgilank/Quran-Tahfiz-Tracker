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
          <h1 class="text-text-main text-3xl font-black leading-tight tracking-[-0.033em]">
            Admin Panel
          </h1>
          <p class="text-text-secondary text-base font-normal leading-normal">
            Manage community members. Approve or reject new registrations.
          </p>
        </div>

        {success && (
          <div class="w-full bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-lg mb-6 border border-emerald-200 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">check_circle</span>
            {success}
          </div>
        )}

        {/* Pending approvals */}
        {pendingUsers.length > 0 && (
          <div class="w-full bg-white border border-amber-200 rounded-xl overflow-hidden shadow-sm mb-8">
            <div class="px-6 py-4 border-b border-amber-200 bg-amber-50/50">
              <h2 class="text-text-main text-lg font-bold flex items-center gap-2">
                <span class="material-symbols-outlined text-amber-500">hourglass_top</span>
                Pending Approvals ({pendingUsers.length})
              </h2>
            </div>
            <div class="divide-y divide-border-light">
              {pendingUsers.map((u) => (
                <div class="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div class="flex items-center gap-3">
                    {u.avatar_url ? (
                      <div
                        class="bg-center bg-no-repeat bg-cover rounded-full size-10 flex-shrink-0"
                        style={`background-image: url("${u.avatar_url}");`}
                      />
                    ) : (
                      <div class="size-10 rounded-full bg-slate-100 flex items-center justify-center text-text-secondary text-xs font-bold border border-slate-200">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <p class="text-text-main text-sm font-bold">{u.name}</p>
                      <p class="text-text-secondary text-xs">{u.email}</p>
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
                        class="px-4 py-2 bg-white text-red-500 border border-red-200 rounded-lg font-bold text-sm hover:bg-red-50 transition-colors"
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
        <div class="w-full bg-white border border-border-light rounded-xl overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-border-light bg-slate-50/50">
            <h2 class="text-text-main text-lg font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">group</span>
              All Members ({allUsers.length})
            </h2>
          </div>
          <div class="divide-y divide-border-light">
            {allUsers.map((u) => (
              <div class="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                <div class="flex items-center gap-3">
                  {u.avatar_url ? (
                    <div
                      class="bg-center bg-no-repeat bg-cover rounded-full size-10 flex-shrink-0"
                      style={`background-image: url("${u.avatar_url}");`}
                    />
                  ) : (
                    <div class="size-10 rounded-full bg-slate-100 flex items-center justify-center text-text-secondary text-xs font-bold border border-slate-200">
                      {u.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <p class="text-text-main text-sm font-bold flex items-center gap-2">
                      {u.name}
                      {u.id === user.id && (
                        <span class="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded uppercase tracking-wider font-black">
                          You
                        </span>
                      )}
                    </p>
                    <p class="text-text-secondary text-xs">{u.email}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span
                    class={`text-xs font-bold px-2 py-1 rounded ${u.role === "admin"
                      ? "bg-purple-50 text-purple-600 border border-purple-200"
                      : u.role === "member"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-amber-50 text-amber-600 border border-amber-200"
                      }`}
                  >
                    {u.role}
                  </span>
                  {u.role === "member" && u.id !== user.id && (
                    <form method="POST" action={`/admin/users/${u.id}/role`}>
                      <input type="hidden" name="role" value="admin" />
                      <button
                        type="submit"
                        class="text-text-secondary hover:text-primary text-xs font-medium transition-colors"
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
                        class="text-text-secondary hover:text-red-500 text-xs font-medium transition-colors"
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
