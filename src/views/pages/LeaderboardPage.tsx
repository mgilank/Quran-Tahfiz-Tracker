import type { FC } from "hono/jsx";
import { Layout } from "../Layout.tsx";
import { Header } from "../components/Header.tsx";
import { TopThreeCards } from "../components/TopThreeCards.tsx";
import { SearchFilter } from "../components/SearchFilter.tsx";
import { LeaderboardTable } from "../components/LeaderboardTable.tsx";
import { MobileBottomBar } from "../components/MobileBottomBar.tsx";
import type { User, RankedUser } from "../../types.ts";

export const LeaderboardPage: FC<{
  user: User;
  topThree: RankedUser[];
  members: RankedUser[];
  currentUserRank: RankedUser | null;
  page: number;
  totalMembers: number;
  perPage: number;
  search?: string;
  sort?: string;
}> = ({ user, topThree, members, currentUserRank, page, totalMembers, perPage, search, sort }) => {
  return (
    <Layout title="Leaderboard - Tahfiz Community">
      <Header user={user} currentPath="/leaderboard" />
      <main class="flex-1 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div class="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div class="flex flex-col gap-2">
            <h1 class="text-text-main text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Community Leaderboard
            </h1>
            <p class="text-text-secondary text-base font-normal leading-normal max-w-2xl">
              Track progress, celebrate milestones, and stay motivated in your Quran memorization
              journey together.
            </p>
          </div>
        </div>

        <TopThreeCards topThree={topThree} />
        <SearchFilter search={search} sort={sort} />
        <LeaderboardTable
          members={members}
          currentUserId={user.id}
          page={page}
          totalMembers={totalMembers}
          perPage={perPage}
          search={search}
          sort={sort}
        />
        <MobileBottomBar userRank={currentUserRank} />
      </main>
    </Layout>
  );
};
