const Submission = require('../models/submission');

// Returns { currentStreak, longestStreak, heatmap } for a user, counting
// distinct days that have at least one accepted submission.
// Shared by the dashboard controller and the submission controller (rating logic)
// so the two never drift out of sync.
const getStreakData = async (userId, daysBack = 365) => {
    const since = new Date();
    since.setDate(since.getDate() - daysBack);

    const heatmapAgg = await Submission.aggregate([
        {
            $match: {
                userId: userId,
                status: 'accepted',
                createdAt: { $gte: since }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const heatmap = heatmapAgg.map((d) => ({ date: d._id, count: d.count }));
    const dateSet = new Set(heatmap.map((d) => d.date));

    let currentStreak = 0;
    let cursor = new Date();
    while (true) {
        const key = cursor.toISOString().slice(0, 10);
        if (dateSet.has(key)) {
            currentStreak++;
            cursor.setDate(cursor.getDate() - 1);
        } else {
            break;
        }
    }

    let longestStreak = 0;
    let running = 0;
    let prevDate = null;
    for (const entry of heatmap) {
        const d = new Date(entry.date);
        if (prevDate) {
            const diffDays = Math.round((d - prevDate) / (1000 * 60 * 60 * 24));
            running = diffDays === 1 ? running + 1 : 1;
        } else {
            running = 1;
        }
        longestStreak = Math.max(longestStreak, running);
        prevDate = d;
    }

    return { currentStreak, longestStreak, heatmap };
};

module.exports = { getStreakData };
