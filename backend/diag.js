const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://dineingoapp:FzyC357xJaxj6oXM@cluster0dine.sofa1gx.mongodb.net/dineingoapp?retryWrites=true&w=majority&appName=Cluster0dine';

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const Achievements = mongoose.connection.collection('achievements');
        const all = await Achievements.find({ progress: { $gt: 0 } }).toArray();
        console.log(`Found ${all.length} achievements with progress > 0`);

        for (const a of all) {
            console.log(`User: ${a.userId}, ID: ${a.achievementId}, Progress: ${a.progress}/${a.maxProgress}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
