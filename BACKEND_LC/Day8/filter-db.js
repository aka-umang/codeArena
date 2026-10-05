require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('./src/models/problem');

async function fix() {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log('Connected');

        const allProblems = await Problem.find({});
        const grouped = {
            array: [],
            stack: [],
            string: [],
            linkedList: []
        };

        for (const p of allProblems) {
            if (grouped[p.tags]) {
                grouped[p.tags].push(p);
            }
        }

        const keepIds = [];
        
        for (const tag of Object.keys(grouped)) {
            let list = grouped[tag];
            // If less than 5, duplicate the last one
            while (list.length > 0 && list.length < 5) {
                const clone = new Problem(list[list.length - 1].toObject());
                clone._id = new mongoose.Types.ObjectId();
                clone.title = clone.title + ' ' + (list.length + 1);
                await clone.save();
                list.push(clone);
                console.log('Created dummy problem:', clone.title);
            }
            
            // Keep exactly 5
            for (let i = 0; i < 5 && i < list.length; i++) {
                keepIds.push(list[i]._id);
            }
        }

        // Delete all problems NOT in keepIds
        const result = await Problem.deleteMany({ _id: { $nin: keepIds } });
        console.log(`Deleted ${result.deletedCount} extra problems.`);
        console.log(`Remaining problems: ${keepIds.length}`);

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}
fix();
