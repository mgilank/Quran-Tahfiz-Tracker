import type { FC } from "hono/jsx";
import type { User } from "../../types.ts";
import { APP_NAME } from "../../config.ts";

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
    { href: "/quran", label: "Quran" },
    { href: "/progress", label: "Submit Progress" },
  ];

  const menuScript = `
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileIcon = document.getElementById('mobile-menu-icon');
    const body = document.body;

    // Mobile menu toggle
    if (mobileBtn && mobileMenu && mobileIcon) {
      mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        if (mobileMenu.classList.contains('hidden')) {
           mobileIcon.textContent = 'menu';
           body.style.overflow = '';
        } else {
           mobileIcon.textContent = 'close';
           body.style.overflow = 'hidden';
        }
      });
    }

    // Desktop profile dropdown toggle
    const desktopProfileBtn = document.getElementById('desktop-profile-btn');
    const desktopProfileDropdown = document.getElementById('desktop-profile-dropdown');
    
    if (desktopProfileBtn && desktopProfileDropdown) {
        desktopProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            desktopProfileDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!desktopProfileBtn.contains(e.target) && !desktopProfileDropdown.contains(e.target)) {
                desktopProfileDropdown.classList.add('hidden');
            }
        });
    }
  `;

  return (
    <>
      <header class="sticky top-0 z-50 flex flex-col border-b border-solid border-border-light bg-white/80 backdrop-blur-md">
        <div class="flex items-center justify-between px-4 sm:px-10 w-full h-16">
          <div class="flex items-center gap-4">
            <div class="size-8 text-primary">
              <Logo />
            </div>
            <h2 class="text-text-main text-xl font-bold leading-tight tracking-[-0.015em]">
              {APP_NAME}
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
                <div class="relative">
                  <button
                    id="desktop-profile-btn"
                    class="flex items-center gap-3 hover:bg-slate-50 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-slate-100 group"
                  >
                    <div class="hidden lg:block text-right">
                      <p class="text-text-main text-sm font-semibold group-hover:text-primary transition-colors">{user.name}</p>
                    </div>
                    {user.avatar_url ? (
                      <div
                        class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ring-2 ring-border-light group-hover:ring-primary/50 transition-all"
                        style={`background-image: url("${user.avatar_url}");`}
                      />
                    ) : (
                      <div
                        class="size-9 rounded-full bg-slate-100 flex items-center justify-center text-text-secondary text-xs font-bold border border-slate-200 group-hover:border-primary/50 transition-all"
                      >
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                    )}
                    <span class="material-symbols-outlined text-text-secondary text-xl group-hover:text-primary transition-colors">arrow_drop_down</span>
                  </button>

                  {/* Desktop Dropdown */}
                  <div
                    id="desktop-profile-dropdown"
                    class="hidden absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-border-light z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right overflow-hidden flex flex-col"
                  >
                    <div class="px-4 py-3 border-b border-border-light lg:hidden">
                      <p class="text-sm font-semibold text-text-main truncate">{user.name}</p>
                      <p class="text-xs text-text-secondary">Signed in</p>
                    </div>
                    <form method="post" action="/auth/logout" class="my-0 py-0">
                      <button
                        type="submit"
                        class="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span class="material-symbols-outlined text-lg">logout</span>
                        Logout
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Mobile menu button */}
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
              <button
                id="mobile-menu-btn"
                class="text-text-main hover:text-primary transition-colors ml-1 p-1"
              >
                <span id="mobile-menu-icon" class="material-symbols-outlined text-3xl">
                  menu
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu dropdown */}
        {user && (
          <div
            id="mobile-menu"
            class="hidden md:hidden absolute top-16 left-0 right-0 h-[calc(100vh-64px)] bg-white z-50 flex flex-col shadow-xl overflow-y-auto"
          >
            <nav class="flex flex-col gap-2 p-4">
              {navItems.map((item) => (
                <a
                  class={
                    currentPath === item.href
                      ? "text-primary text-base font-semibold bg-primary-light/50 px-4 py-3 rounded-xl border border-primary/10"
                      : "text-text-secondary hover:text-primary hover:bg-slate-50 transition-colors text-base font-medium px-4 py-3 rounded-xl border border-transparent"
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
                      ? "text-primary text-base font-semibold bg-primary-light/50 px-4 py-3 rounded-xl border border-primary/10"
                      : "text-text-secondary hover:text-primary hover:bg-slate-50 transition-colors text-base font-medium px-4 py-3 rounded-xl border border-transparent"
                  }
                  href="/admin"
                >
                  Admin
                </a>
              )}
            </nav>

            <div class="mt-auto border-t border-border-light bg-slate-50/50 p-6 pb-20">
              <div class="flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  {user.avatar_url ? (
                    <div
                      class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 ring-2 ring-border-light"
                      style={`background-image: url("${user.avatar_url}");`}
                    />
                  ) : (
                    <div class="size-12 rounded-full bg-white flex items-center justify-center text-text-secondary text-base font-bold border border-slate-200 shadow-sm">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <p class="text-text-main font-bold text-base">{user.name}</p>
                    <p class="text-text-secondary text-xs">Signed in</p>
                  </div>
                </div>
                <form method="post" action="/auth/logout" class="w-full">
                  <button
                    type="submit"
                    class="w-full flex items-center justify-center gap-2 text-red-600 bg-white hover:bg-red-50 transition-colors text-sm font-bold px-4 py-3 rounded-xl border border-border-light hover:border-red-100 shadow-sm"
                  >
                    <span>Logout</span>
                    <span class="material-symbols-outlined text-xl">logout</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </header>
      <script dangerouslySetInnerHTML={{ __html: menuScript }} />
    </>
  );
};
