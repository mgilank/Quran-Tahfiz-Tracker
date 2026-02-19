import type { FC } from "hono/jsx";

export const SearchFilter: FC<{ search?: string; sort?: string }> = ({
  search = "",
  sort = "juz",
}) => {
  return (
    <form
      method="GET"
      action="/leaderboard"
      class="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-white border border-border-light p-3 rounded-xl shadow-sm"
    >
      <div class="relative w-full sm:w-auto sm:min-w-[320px]">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined text-[20px]">
          search
        </span>
        <input
          class="w-full bg-slate-50 text-text-main text-sm placeholder:text-text-secondary/60 rounded-lg border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary pl-10 pr-4 py-2.5 transition-all"
          placeholder="Search members by name..."
          type="text"
          name="search"
          value={search}
        />
      </div>
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <select
          name="sort"
          class="px-4 py-2 bg-transparent text-text-secondary hover:text-text-main rounded-lg text-sm font-medium border border-border-light transition-colors"
          onchange="this.form.submit()"
        >
          <option value="juz" selected={sort === "juz"}>
            Sort by: Juz
          </option>
          <option value="name" selected={sort === "name"}>
            Sort by: Name
          </option>
        </select>
        <button
          type="submit"
          class="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary-dark border border-primary/20 rounded-lg text-sm font-semibold whitespace-nowrap"
        >
          <span class="material-symbols-outlined text-[18px]">search</span>
          Search
        </button>
      </div>
    </form>
  );
};
