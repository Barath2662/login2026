require("dotenv").config();
const { sequelize } = require("./config/db/postgres");
const eventModel = require("./models/postgres/eventModel");

const seedEvents = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL");
    
    // Create some sample events
    const today = new Date().toISOString().split('T')[0];
    
    const events = [
      {
        name: "Cyber Security CTF",
        description: "Capture the flag competition focusing on web exploitation.",
        date: today,
        start_time: "10:00:00",
        end_time: "13:00:00",
        venue: "Lab 4",
        max_participants: 50,
        status: "open"
      },
      {
        name: "Algorithm Arena",
        description: "Competitive programming contest.",
        date: today,
        start_time: "14:00:00",
        end_time: "17:00:00",
        venue: "Lab 5",
        max_participants: 100,
        status: "open"
      },
      {
        name: "Web3 Workshop",
        description: "Introduction to smart contracts.",
        date: today,
        start_time: "10:00:00",
        end_time: "11:30:00",
        venue: "Hall A",
        max_participants: 200,
        status: "open"
      }
    ];

    for (const event of events) {
      await eventModel.findOrCreate({
        where: { name: event.name },
        defaults: event
      });
    }

    console.log("Events seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed events:", error);
    process.exit(1);
  }
};

seedEvents();
