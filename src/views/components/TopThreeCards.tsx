import type { FC } from "hono/jsx";
import type { RankedUser } from "../../types.ts";

const Initials: FC<{ name: string; size?: string }> = ({ name, size = "w-20 h-20" }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div
      class={`${size} rounded-full bg-slate-100 flex items-center justify-center text-text-secondary text-lg font-bold border border-slate-200`}
    >
      {initials}
    </div>
  );
};

const SecondPlace: FC<{ member: RankedUser }> = ({ member }) => (
  <div class="order-2 md:order-1 relative flex flex-col bg-white border border-border-light rounded-xl p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
    <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-white border border-border-light text-text-secondary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
      <span class="material-symbols-outlined text-base text-slate-400">emoji_events</span> 2nd
      Place
    </div>
    <div class="flex flex-col items-center text-center gap-4 mt-2">
      <div class="relative">
        <div class="w-20 h-20 rounded-full p-1 border-2 border-slate-100">
          {member.avatar_url ? (
            <div
              class="w-full h-full rounded-full bg-cover bg-center"
              style={`background-image: url("${member.avatar_url}");`}
            />
          ) : (
            <Initials name={member.name} size="w-full h-full" />
          )}
        </div>
        <div class="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
          <span class="material-symbols-outlined text-blue-500 text-xl">verified</span>
        </div>
      </div>
      <div>
        <h3 class="text-text-main text-lg font-bold">{member.name}</h3>
        <p class="text-text-secondary text-sm">{member.juz_completed} Juz Completed</p>
      </div>
      <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div class="bg-slate-400 h-2.5 rounded-full" style={`width: ${member.progress_percent}%`} />
      </div>
      <div class="flex items-center justify-between w-full text-xs text-text-secondary font-medium">
        <span>{member.progress_percent}% Progress</span>
        {member.trend > 0 && (
          <span class="flex items-center gap-1 text-primary">
            <span class="material-symbols-outlined text-sm">trending_up</span> +{member.trend} Ayah
          </span>
        )}
      </div>
    </div>
  </div>
);

const FirstPlace: FC<{ member: RankedUser }> = ({ member }) => (
  <div class="order-1 md:order-2 relative flex flex-col bg-white border-2 border-primary/20 rounded-xl p-6 shadow-xl shadow-emerald-100 transform md:-translate-y-4 hover:shadow-2xl transition-all duration-300">
    <div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
      <span class="material-symbols-outlined text-lg">workspace_premium</span> 1st Place
    </div>
    <div class="flex flex-col items-center text-center gap-5 mt-4">
      <div class="relative">
        <div class="w-24 h-24 rounded-full p-1 border-4 border-primary shadow-sm">
          {member.avatar_url ? (
            <div
              class="w-full h-full rounded-full bg-cover bg-center"
              style={`background-image: url("${member.avatar_url}");`}
            />
          ) : (
            <Initials name={member.name} size="w-full h-full" />
          )}
        </div>
        <div class="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 border border-primary shadow-sm">
          <span class="material-symbols-outlined text-orange-500 text-xl">
            local_fire_department
          </span>
        </div>
      </div>
      <div>
        <h3 class="text-text-main text-xl font-bold">{member.name}</h3>
        <p class="text-primary-dark font-semibold text-sm">
          {member.juz_completed === 30 ? "Hafiz \u2022 " : ""}
          {member.juz_completed} Juz Completed
        </p>
      </div>
      <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
        <div
          class="bg-primary h-3 rounded-full relative overflow-hidden"
          style={`width: ${member.progress_percent}%`}
        >
          {member.progress_percent === 100 && (
            <div class="absolute top-0 left-0 bottom-0 right-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]" />
          )}
        </div>
      </div>
      <div class="flex items-center justify-between w-full text-xs font-semibold">
        <span class="text-primary">{member.progress_percent}% Progress</span>
        {member.juz_completed === 30 ? (
          <span class="text-text-secondary">Khatam Completed</span>
        ) : (
          member.trend > 0 && (
            <span class="text-text-secondary">+{member.trend} Ayah this week</span>
          )
        )}
      </div>
    </div>
  </div>
);

const ThirdPlace: FC<{ member: RankedUser }> = ({ member }) => (
  <div class="order-3 relative flex flex-col bg-white border border-border-light rounded-xl p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
    <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-white border border-border-light text-text-secondary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
      <span class="material-symbols-outlined text-base text-amber-700">emoji_events</span> 3rd
      Place
    </div>
    <div class="flex flex-col items-center text-center gap-4 mt-2">
      <div class="relative">
        <div class="w-20 h-20 rounded-full p-1 border-2 border-amber-100">
          {member.avatar_url ? (
            <div
              class="w-full h-full rounded-full bg-cover bg-center"
              style={`background-image: url("${member.avatar_url}");`}
            />
          ) : (
            <Initials name={member.name} size="w-full h-full" />
          )}
        </div>
      </div>
      <div>
        <h3 class="text-text-main text-lg font-bold">{member.name}</h3>
        <p class="text-text-secondary text-sm">{member.juz_completed} Juz Completed</p>
      </div>
      <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          class="bg-amber-600/70 h-2.5 rounded-full"
          style={`width: ${member.progress_percent}%`}
        />
      </div>
      <div class="flex items-center justify-between w-full text-xs text-text-secondary font-medium">
        <span>{member.progress_percent}% Progress</span>
        {member.trend > 0 && (
          <span class="flex items-center gap-1 text-primary">
            <span class="material-symbols-outlined text-sm">trending_up</span> +{member.trend} Ayah
          </span>
        )}
      </div>
    </div>
  </div>
);

export const TopThreeCards: FC<{ topThree: RankedUser[] }> = ({ topThree }) => {
  if (topThree.length === 0) {
    return (
      <div class="w-full text-center py-12 text-text-secondary">
        <span class="material-symbols-outlined text-4xl mb-2">group</span>
        <p>No members yet. Be the first to submit progress!</p>
      </div>
    );
  }

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  return (
    <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
      {second ? <SecondPlace member={second} /> : <div class="order-2 md:order-1" />}
      {first && <FirstPlace member={first} />}
      {third ? <ThirdPlace member={third} /> : <div class="order-3" />}
    </div>
  );
};
