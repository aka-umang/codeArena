const User = require('../models/user');
const Problem = require('../models/problem');
const { getStreakData } = require('../utils/streak');

const getDashboard = async (req, res) => {
    try {
        const userId = req.user._id;

        // ----- 1. Total solved + difficulty breakdown -----
        const solvedProblemIds = req.user.problemsSolved || [];
        const totalSolved = solvedProblemIds.length;

        const solvedProblems = await Problem.find(
            { _id: { $in: solvedProblemIds } },
            { difficulty: 1 }
        );

        const difficultyBreakdown = { easy: 0, medium: 0, hard: 0 };
        solvedProblems.forEach((p) => {
            if (difficultyBreakdown[p.difficulty] !== undefined) {
                difficultyBreakdown[p.difficulty]++;
            }
        });

        const totalProblemsByDifficulty = await Problem.aggregate([
            { $group: { _id: '$difficulty', count: { $sum: 1 } } }
        ]);
        const totalByDifficulty = { easy: 0, medium: 0, hard: 0 };
        totalProblemsByDifficulty.forEach((d) => {
            if (totalByDifficulty[d._id] !== undefined) totalByDifficulty[d._id] = d.count;
        });

        const totalProblemsOverall = await Problem.countDocuments();

        // ----- 2. Heatmap + streaks (shared helper, also used when awarding rating) -----
        const { heatmap, currentStreak, longestStreak } = await getStreakData(userId);

        // ----- 3. Rank among all users, by rating -----
        // Rating starts at 0 and only rises when a user actually solves problems
        // (see userSubmission controller). A brand new / inactive user has
        // rating 0 and is shown as rank 0 ("unranked") instead of being dropped
        // to the bottom of the leaderboard, which used to look confusing
        // (e.g. "#47 / 50" for someone who just signed up).
        const myRating = req.user.rating || 0;

        const totalUsers = await User.countDocuments();
        let rank = 0;

        if (myRating > 0) {
            // Rank = 1 + number of users with a strictly higher rating.
            const higherRatedCount = await User.countDocuments({ rating: { $gt: myRating } });
            rank = higherRatedCount + 1;
        }

        res.status(200).json({
            totalSolved,
            totalProblemsOverall,
            difficultyBreakdown,
            totalByDifficulty,
            heatmap,
            currentStreak,
            longestStreak,
            rank,
            rating: myRating,
            totalUsers
        });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Failed to load dashboard' });
    }
};

// Lightweight endpoint just for the current streak, used by the navbar
// streak icon on the problems page so it doesn't have to fetch the whole
// dashboard payload.
const getStreak = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentStreak, longestStreak } = await getStreakData(userId);
        res.status(200).json({ currentStreak, longestStreak });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Failed to load streak' });
    }
};

module.exports = { getDashboard, getStreak };
