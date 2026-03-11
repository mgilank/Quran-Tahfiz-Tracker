import type { FC } from "hono/jsx";

export const SearchFilter: FC<{ search?: string; sort?: string }> = ({
  search = "",
  sort = "juz",
}) => {
  return (
    <form
      method="GET"
      action="/leaderboard"
      class="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-surface dark:bg-surface-dark border border-border-light dark:border-border-light-dark p-3 rounded-xl shadow-sm"
    >
      <div class="relative w-full sm:w-auto sm:min-w-[320px]">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark material-symbols-outlined text-[20px]">
          search
        </span>
        <input
          class="w-full bg-slate-50 dark:bg-slate-800/50 text-text-main dark:text-text-main-dark text-sm placeholder:text-text-secondary/60 dark:placeholder:text-text-secondary-dark/60 rounded-lg border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary pl-10 pr-4 py-2.5 transition-all"
          placeholder="Search members by name..."
          type="text"
          name="search"
          value={search}
        />
      </div>
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <select
          name="sort"
          class="px-4 py-2 bg-transparent text-text-secondary dark:text-text-secondary-dark hover:text-text-main dark:hover:text-text-main-dark rounded-lg text-sm font-medium border border-border-light dark:border-border-light-dark transition-colors"
          onchange="this.form.submit()"
        >
          <option value="juz" selected={sort === "juz"} class="bg-surface dark:bg-surface-dark">
            Sort by: Juz
          </option>
          <option value="name" selected={sort === "name"} class="bg-surface dark:bg-surface-dark">
            Sort by: Name
          </option>
        </select>
        <button
          type="submit"
          class="flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary-dark dark:text-primary-light border border-primary/20 dark:border-primary/30 rounded-lg text-sm font-semibold whitespace-nowrap"
        >
          <span class="material-symbols-outlined text-[18px]">search</span>
          Search
        </button>
      </div>
    </form>
  );
};
