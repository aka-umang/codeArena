import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";

// Builds a 53-week x 7-day grid ending today, filling in counts from the
// heatmap data returned by the backend ({ date: 'YYYY-MM-DD', count }[]).
function buildHeatmapGrid(heatmapData) {
  const countByDate = {};
  heatmapData.forEach((d) => {
    countByDate[d.date] = d.count;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays = 365;
  const start = new Date(today);
  start.setDate(start.getDate() - (totalDays - 1));
  // Align start to the previous Sunday so the grid forms clean week columns
  const startDay = start.getDay();
  start.setDate(start.getDate() - startDay);

  const weeks = [];
  let cursor = new Date(start);
  while (cursor <= today) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const key = cursor.toISOString().slice(0, 10);
      const inRange = cursor >= start && cursor <= today;
      week.push({
        date: key,
        count: inRange ? countByDate[key] || 0 : null,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function levelForCount(count) {
  if (count === null) return "invisible";
  if (count === 0) return "bg-base-300";
  if (count === 1) return "bg-green-300";
  if (count <= 3) return "bg-green-500";
  return "bg-green-700";
}

const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function Heatmap({ data }) {
  const weeks = buildHeatmapGrid(data);

  // figure out which week columns should get a month label
  const monthTicks = [];
  let lastMonth = null;
  weeks.forEach((week, wi) => {
    const firstValid = week.find((d) => d.count !== null);
    if (!firstValid) return;
    const m = new Date(firstValid.date).getMonth();
    if (m !== lastMonth) {
      monthTicks.push({ index: wi, label: monthLabels[m] });
      lastMonth = m;
    }
  });

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex gap-1 mb-1 ml-8">
          {weeks.map((_, wi) => {
            const tick = monthTicks.find((t) => t.index === wi);
            return (
              <div key={wi} className="w-3 text-[10px] text-base-content/50">
                {tick ? tick.label : ""}
              </div>
            );
          })}
        </div>
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 mr-1 justify-between text-[10px] text-base-content/50 w-7">
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`w-3 h-3 rounded-sm ${levelForCount(day.count)}`}
                  title={
                    day.count !== null
                      ? `${day.count} accepted submission${day.count === 1 ? "" : "s"} on ${day.date}`
                      : undefined
                  }
                ></div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 mt-3 ml-8 text-[10px] text-base-content/50">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-base-300"></div>
          <div className="w-3 h-3 rounded-sm bg-green-300"></div>
          <div className="w-3 h-3 rounded-sm bg-green-500"></div>
          <div className="w-3 h-3 rounded-sm bg-green-700"></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

// Circular "ring" progress bar showing overall problems-solved progress.
function ProgressRing({ solved, total }) {
  const pct = total > 0 ? Math.min(100, Math.round((solved / total) * 100)) : 0;

  const size = 128;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative w-32 h-32 shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-base-300"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-primary"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-bold">{pct}%</span>
        <span className="text-[11px] text-base-content/60">{solved}/{total}</span>
      </div>
    </div>
  );
}

function DifficultyBar({ label, solved, total, colorClass }) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="capitalize font-medium">{label}</span>
        <span className="text-base-content/60">{solved} / {total}</span>
      </div>
      <div className="w-full bg-base-300 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorClass}`}
          style={{ width: `${pct}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosClient.get("/dashboard");
        setStats(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Couldn't load your dashboard right now. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
        <NavLink to="/" className="btn btn-primary btn-sm">Back to Home</NavLink>
      </div>
    );
  }

  const {
    totalSolved,
    totalProblemsOverall,
    difficultyBreakdown,
    totalByDifficulty,
    heatmap,
    currentStreak,
    longestStreak,
    rank,
    totalUsers,
  } = stats;

  return (
    <div className="min-h-screen bg-base-100 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">
              {user?.firstName}'s Dashboard
            </h1>
            <p className="text-base-content/60 text-sm">
              Track your progress and streaks
            </p>
          </div>
          <NavLink to="/" className="btn btn-ghost btn-sm">
            ← Back to Problems
          </NavLink>
        </div>

        {/* Progress ring + stat cards */}
        <div className="card bg-base-200 border border-base-300 shadow p-4 flex flex-col sm:flex-row items-center gap-6">
          <ProgressRing solved={totalSolved} total={totalProblemsOverall} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 w-full">
            <div>
              <span className="text-sm text-base-content/60">Total Solved</span>
              <div className="font-mono text-3xl font-bold text-primary">
                {totalSolved}
                <span className="text-base font-normal text-base-content/50">
                  {" "}/ {totalProblemsOverall}
                </span>
              </div>
            </div>

            <div>
              <span className="text-sm text-base-content/60">Your Rank</span>
              <div className="font-mono text-3xl font-bold text-secondary">
                {rank > 0 ? (
                  <>
                    #{rank}
                    <span className="text-base font-normal text-base-content/50">
                      {" "}/ {totalUsers}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl">Unranked</span>
                )}
              </div>
              {rank === 0 && (
                <span className="text-[11px] text-base-content/50">
                  Solve a problem to get on the board
                </span>
              )}
            </div>

            <div>
              <span className="text-sm text-base-content/60">Current Streak</span>
              <div className="font-mono text-3xl font-bold text-accent">
                {currentStreak}
                <span className="text-base font-normal text-base-content/50"> days</span>
              </div>
            </div>

            <div>
              <span className="text-sm text-base-content/60">Longest Streak</span>
              <div className="font-mono text-3xl font-bold text-accent/80">
                {longestStreak}
                <span className="text-base font-normal text-base-content/50"> days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="card bg-base-200 border border-base-300 shadow p-4">
          <h2 className="font-display font-semibold mb-4">Submission Activity</h2>
          <Heatmap data={heatmap} />
        </div>

        {/* Difficulty breakdown */}
        <div className="card bg-base-200 border border-base-300 shadow p-4 space-y-4">
          <h2 className="font-display font-semibold">Solved by Difficulty</h2>
          <DifficultyBar
            label="easy"
            solved={difficultyBreakdown.easy}
            total={totalByDifficulty.easy}
            colorClass="bg-green-500"
          />
          <DifficultyBar
            label="medium"
            solved={difficultyBreakdown.medium}
            total={totalByDifficulty.medium}
            colorClass="bg-yellow-500"
          />
          <DifficultyBar
            label="hard"
            solved={difficultyBreakdown.hard}
            total={totalByDifficulty.hard}
            colorClass="bg-red-500"
          />
        </div>

      </div>
    </div>
  );
}
