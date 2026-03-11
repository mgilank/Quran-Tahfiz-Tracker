import type { FC, Child } from "hono/jsx";
import { APP_NAME } from "../config.ts";

export const Layout: FC<{ title?: string; children: Child }> = ({ title, children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>{title || APP_NAME}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                colors: {
                  "primary": "#10b981",
                  "primary-dark": "#059669",
                  "primary-light": "#ecfdf5",
                  "background": {
                    DEFAULT: "#f8faf9",
                    dark: "#0f172a"
                  },
                  "surface": {
                    DEFAULT: "#ffffff",
                    dark: "#1e293b"
                  },
                  "border-light": {
                    DEFAULT: "#e2e8f0",
                    dark: "#334155"
                  },
                  "text-main": {
                    DEFAULT: "#1e293b",
                    dark: "#f1f5f9"
                  },
                  "text-secondary": {
                    DEFAULT: "#64748b",
                    dark: "#94a3b8"
                  },
                },
                fontFamily: {
                  "display": ["Lexend", "sans-serif"]
                },
                borderRadius: {
                  "DEFAULT": "0.25rem",
                  "lg": "0.5rem",
                  "xl": "0.75rem",
                  "2xl": "1rem",
                  "full": "9999px"
                },
              },
            },
          }
        `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        `,
          }}
        />
        <style
          type="text/tailwindcss"
          dangerouslySetInnerHTML={{
            __html: `
          @layer base {
            body {
              @apply bg-background text-text-main font-display transition-colors duration-200 dark:bg-background-dark dark:text-text-main-dark;
            }
          }
        `,
          }}
        />
      </head>
      <body class="min-h-screen flex flex-col">{children}</body>
    </html>
  );
};
