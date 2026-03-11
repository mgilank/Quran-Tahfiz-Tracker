import type { FC } from "hono/jsx";
import type { RankedUser } from "../../types.ts";

export const MobileBottomBar: FC<{ userRank: RankedUser | null }> = ({ userRank }) => {
  if (!userRank) return null;

  return (
    <div class="fixed bottom-0 left-0 right-0 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-lg border-t border-border-light dark:border-border-light-dark p-4 md:hidden shadow-[0_-10px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_20px_rgba(0,0,0,0.2)] z-40">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-sm">
            {userRank.rank}
          </span>
          <div>
            <p class="text-text-main dark:text-text-main-dark text-sm font-bold">You</p>
            <p class="text-text-secondary dark:text-text-secondary-dark text-xs">
              Juz {userRank.current_juz} &bull; {userRank.progress_percent}%
            </p>
          </div>
        </div>
        <a
          href="/dashboard"
          class="text-primary dark:text-primary-light text-sm font-bold hover:underline transition-colors"
        >
          View Details
        </a>
      </div>
    </div>
  );
};
