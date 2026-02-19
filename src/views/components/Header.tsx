import type { FC } from "hono/jsx";
import type { User } from "../../types.ts";

const Logo: FC = () => (
  <svg class="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
      fill="currentColor"
    />
  </svg>
);

export const Header: FC<{ user: User | null; currentPath: string }> = ({
  user,
  currentPath,
}) => {
  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/progress", label: "Submit Progress" },
  ];

  return (
    <header class="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light bg-white/80 backdrop-blur-md px-4 sm:px-10 py-3">
      <div class="flex items-center gap-4">
        <div class="size-8 text-primary">
          <Logo />
        </div>
        <h2 class="text-text-main text-xl font-bold leading-tight tracking-[-0.015em]">
          Tahfiz Community
        </h2>
      </div>
      <div class="hidden md:flex flex-1 justify-end gap-8 items-center">
        <nav class="flex items-center gap-9">
          {navItems.map((item) => (
            <a
              class={
                currentPath === item.href
                  ? "text-primary text-sm font-semibold leading-normal border-b-2 border-primary pb-0.5"
                  : "text-text-secondary hover:text-primary transition-colors text-sm font-medium leading-normal"
              }
              href={item.href}
            >
              {item.label}
            </a>
          ))}
          {user?.role === "admin" && (
            <a
              class={
                currentPath === "/admin"
                  ? "text-primary text-sm font-semibold leading-normal border-b-2 border-primary pb-0.5"
                  : "text-text-secondary hover:text-primary transition-colors text-sm font-medium leading-normal"
              }
              href="/admin"
            >
              Admin
            </a>
          )}
        </nav>
        {user && (
          <>
            <div class="h-8 w-px bg-border-light"></div>
            <div class="flex items-center gap-4">
              <span class="text-text-secondary text-sm">{user.name}</span>
              {user.avatar_url ? (
                <div
                  class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ring-2 ring-border-light"
                  style={`background-image: url("${user.avatar_url}");`}
                />
              ) : (
                <div class="size-9 rounded-full bg-slate-100 flex items-center justify-center text-text-secondary text-xs font-bold border border-slate-200">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              )}
              <form method="POST" action="/auth/logout">
                <button
                  type="submit"
                  class="text-text-secondary hover:text-red-500 transition-colors text-sm"
                >
                  <span class="material-symbols-outlined text-xl">logout</span>
                </button>
              </form>
            </div>
          </>
        )}
      </div>
      {/* Mobile menu */}
      {user && (
        <div class="flex md:hidden items-center gap-3">
          {user.avatar_url ? (
            <div
              class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 ring-2 ring-border-light"
              style={`background-image: url("${user.avatar_url}");`}
            />
          ) : (
            <div class="size-8 rounded-full bg-slate-100 flex items-center justify-center text-text-secondary text-xs font-bold border border-slate-200">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
