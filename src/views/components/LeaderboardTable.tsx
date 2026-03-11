import type { FC } from "hono/jsx";
import type { RankedUser } from "../../types.ts";

const TrendBadge: FC<{ trend: number }> = ({ trend }) => {
  if (trend > 0) {
    return (
      <div class="flex items-center gap-1 text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded">
        <span class="material-symbols-outlined text-[16px]">arrow_upward</span>
        {trend}
      </div>
    );
  }
  if (trend < 0) {
    return (
      <div class="flex items-center gap-1 text-rose-500 text-xs font-bold bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded">
        <span class="material-symbols-outlined text-[16px]">arrow_downward</span>
        {Math.abs(trend)}
      </div>
    );
  }
  return (
    <div class="flex items-center gap-1 text-text-secondary dark:text-text-secondary-dark text-xs font-medium px-2 py-1">
      <span class="material-symbols-outlined text-[16px]">remove</span>
    </div>
  );
};

const LeaderboardRow: FC<{ member: RankedUser; isCurrentUser: boolean }> = ({
  member,
  isCurrentUser,
}) => {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const rowClass = isCurrentUser
    ? "group grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-4 items-center bg-emerald-50/50 dark:bg-emerald-900/10 border-l-4 border-l-primary shadow-[inset_0_0_12px_rgba(16,185,129,0.05)]"
    : "group grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors";

  return (
    <div class={rowClass}>
      {/* Rank */}
      <div class="flex items-center md:justify-center col-span-12 md:col-span-1 mb-2 md:mb-0">
        {isCurrentUser ? (
          <span class="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-sm">
            {member.rank}
          </span>
        ) : (
          <span class="bg-slate-100 dark:bg-slate-800 text-text-secondary dark:text-text-secondary-dark w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold border border-border-light dark:border-border-light-dark">
            {member.rank}
          </span>
        )}
        <span
          class={`ml-2 md:hidden text-sm font-medium ${isCurrentUser ? "text-primary-dark font-bold" : "text-text-secondary dark:text-text-secondary-dark"}`}
        >
          {isCurrentUser ? "Your Rank" : "Rank"}
        </span>
      </div>

      {/* Member */}
      <div class="col-span-12 md:col-span-4 flex items-center gap-3">
        {member.avatar_url ? (
          <div
            class={`bg-center bg-no-repeat bg-cover rounded-full size-10 flex-shrink-0 ${isCurrentUser ? "ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-surface-dark" : ""}`}
            style={`background-image: url("${member.avatar_url}");`}
          />
        ) : (
          <div
            class={`size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-text-secondary dark:text-text-secondary-dark text-xs font-bold border border-slate-200 dark:border-slate-700 flex-shrink-0 ${isCurrentUser ? "ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-surface-dark" : ""}`}
          >
            {initials}
          </div>
        )}
        <div>
          <p class="text-text-main dark:text-text-main-dark text-sm font-bold flex items-center gap-2">
            {member.name}
            {isCurrentUser && (
              <span class="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded uppercase tracking-wider font-black">
                You
              </span>
            )}
          </p>
          <p class="text-text-secondary dark:text-text-secondary-dark text-xs">
            {isCurrentUser ? "Keep it up, you're doing great!" : member.joined_label}
          </p>
        </div>
      </div>

      {/* Current Location */}
      <div class="col-span-6 md:col-span-3">
        <div class="flex items-center gap-2 text-text-secondary dark:text-text-secondary-dark md:hidden mb-1 text-xs uppercase font-bold">
          Location
        </div>
        {member.in_progress_surahs.length > 0 ? (
          <div class="flex flex-col gap-1.5">
            {/* Primary/Latest Surah */}
            <div>
              <p class={`text-text-main dark:text-text-main-dark text-sm ${isCurrentUser ? "font-semibold" : "font-medium"}`}>
                Juz {member.current_juz} &bull; {member.current_surah}
              </p>
              <p class="text-text-secondary dark:text-text-secondary-dark text-[11px]">Ayah {member.current_ayah}</p>
            </div>
            
            {/* Other active surahs */}
            {member.in_progress_surahs.length > 1 && (
              <div class="flex flex-wrap gap-1 mt-0.5">
                {member.in_progress_surahs
                  .filter(s => s.number !== member.current_surah_number)
                  .map(s => (
                    <span 
                      title={`${s.name}: Ayah ${s.last_ayah}/${s.total_ayahs}`}
                      class="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-text-secondary dark:text-text-secondary-dark rounded border border-border-light dark:border-border-light-dark font-bold"
                    >
                      {s.name}
                    </span>
                  ))
                }
              </div>
            )}
          </div>
        ) : (
          <p class="text-text-secondary dark:text-text-secondary-dark text-sm italic">Not started yet</p>
        )}
      </div>

      {/* Progress */}
      <div class="col-span-6 md:col-span-3">
        <div class="flex items-center gap-2 text-text-secondary dark:text-text-secondary-dark md:hidden mb-1 text-xs uppercase font-bold">
          Progress
        </div>
        <div class="flex items-center gap-3">
          <div
            class={`flex-1 rounded-full h-2 ${isCurrentUser ? "bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700" : "bg-slate-100 dark:bg-slate-800"}`}
          >
            <div
              class={`h-2 rounded-full ${isCurrentUser ? "bg-primary shadow-[0_0_8px_rgba(16,185,129,0.4)]" : member.progress_percent > 80 ? "bg-primary" : member.progress_percent > 50 ? "bg-primary/80" : member.progress_percent > 20 ? "bg-primary/60" : "bg-primary/40"}`}
              style={`width: ${member.progress_percent}%`}
            />
          </div>
          <span class="text-text-main dark:text-text-main-dark text-sm font-bold">{member.progress_percent}%</span>
        </div>
      </div>

      {/* Trend */}
      <div class="col-span-12 md:col-span-1 flex justify-end">
        {isCurrentUser ? (
          <div class="flex items-center gap-1 text-primary text-xs font-bold bg-surface dark:bg-surface-dark px-2 py-1 rounded border border-primary/20">
            <span class="material-symbols-outlined text-[16px]">arrow_upward</span>
            {member.trend || 0}
          </div>
        ) : (
          <TrendBadge trend={member.trend} />
        )}
      </div>
    </div>
  );
};

export const LeaderboardTable: FC<{
  members: RankedUser[];
  currentUserId: number;
  page: number;
  totalMembers: number;
  perPage: number;
  search?: string;
  sort?: string;
}> = ({ members, currentUserId, page, totalMembers, perPage, search, sort }) => {
  const totalPages = Math.ceil(totalMembers / perPage);

  return (
    <div class="w-full bg-surface dark:bg-surface-dark border border-border-light dark:border-border-light-dark rounded-xl overflow-hidden mb-20 shadow-sm">
      {/* Table header */}
      <div class="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-light dark:border-border-light-dark bg-slate-50/50 dark:bg-slate-800/50 text-text-secondary dark:text-text-secondary-dark text-xs font-bold uppercase tracking-wider">
        <div class="col-span-1 text-center">Rank</div>
        <div class="col-span-4">Member</div>
        <div class="col-span-3">Current Location</div>
        <div class="col-span-3">Progress</div>
        <div class="col-span-1 text-right">Trend</div>
      </div>

      {/* Table body */}
      <div class="divide-y divide-border-light dark:divide-border-light-dark">
        {members.length === 0 ? (
          <div class="px-6 py-12 text-center text-text-secondary dark:text-text-secondary-dark">
            <span class="material-symbols-outlined text-3xl mb-2">search_off</span>
            <p>No members found.</p>
          </div>
        ) : (
          members.map((member) => (
            <LeaderboardRow member={member} isCurrentUser={member.id === currentUserId} />
          ))
        )}
      </div>

      {/* Pagination */}
      <div class="bg-slate-50/50 dark:bg-slate-800/50 border-t border-border-light dark:border-border-light-dark px-6 py-4 flex items-center justify-between">
        <p class="text-text-secondary dark:text-text-secondary-dark text-sm">
          Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, totalMembers)} of{" "}
          {totalMembers} members
        </p>
        <div class="flex gap-2">
          {page > 1 ? (
            <a
              href={`/leaderboard?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}${sort ? `&sort=${sort}` : ""}`}
              class="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-light-dark bg-surface dark:bg-surface-dark text-text-secondary dark:text-text-secondary-dark text-sm hover:text-text-main dark:hover:text-text-main-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              Previous
            </a>
          ) : (
            <button
              class="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-light-dark bg-surface dark:bg-surface-dark text-text-secondary dark:text-text-secondary-dark text-sm font-medium disabled:opacity-50"
              disabled
            >
              Previous
            </button>
          )}
          {page < totalPages ? (
            <a
              href={`/leaderboard?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}${sort ? `&sort=${sort}` : ""}`}
              class="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-light-dark bg-surface dark:bg-surface-dark text-text-secondary dark:text-text-secondary-dark text-sm hover:text-text-main dark:hover:text-text-main-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              Next
            </a>
          ) : (
            <button
              class="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-light-dark bg-surface dark:bg-surface-dark text-text-secondary dark:text-text-secondary-dark text-sm font-medium disabled:opacity-50"
              disabled
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
