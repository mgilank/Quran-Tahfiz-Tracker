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
            theme: {
              extend: {
                colors: {
                  "primary": "#10b981",
                  "primary-dark": "#065f46",
                  "primary-light": "#ecfdf5",
                  "background": "#f8faf9",
                  "surface": "#ffffff",
                  "border-light": "#e2e8f0",
                  "text-main": "#1e293b",
                  "text-secondary": "#64748b",
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
        <style
          type="text/tailwindcss"
          dangerouslySetInnerHTML={{
            __html: `
          @layer base {
            body {
              @apply bg-background text-text-main font-display;
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
