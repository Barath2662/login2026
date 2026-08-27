const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config();
const { connectPostgres, sequelize } = require("./config/db/postgres");
const eventModel = require("./models/postgres/eventModel");
const { Op } = require("sequelize");

const seedEvents = async () => {
  try {
    await connectPostgres();
    console.log("Connected to database for event seeding...");

    // Synchronize model schema changes first so tables exist
    await sequelize.sync();

    await sequelize.query('ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "is_online" BOOLEAN NOT NULL DEFAULT FALSE;');
    await sequelize.query('ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "coordinator_name" VARCHAR(255);');
    await sequelize.query('ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "coordinator_phone" VARCHAR(255);');

    const eventsData = [
      {
        name: "Code Relay",
        description: "A fast-paced collaborative coding challenge where teammates take turns coding and must quickly understand and continue each other’s work. Success depends on coding ability, adaptability, communication, and teamwork.",
        coordinator_name: "Kartheesvaran S; Sibidharan R",
        coordinator_phone: "8637635291; 8903289194",
        category: "TECHNICAL",
        team_type: "TEAM",
        min_team_size: 2,
        max_team_size: 2,
        day: 18,
        date: "2026-09-18",
        start_time: "10:30:00",
        end_time: "12:30:00",
        venue: "CAT Lab",
        max_participants: 50,
        is_flagship: false,
        guardian_asset: "/assets/events/code_relay.png",
        entry_fee: 0.0,
        status: "open",
      },
      {
        name: "Hunt your Treasure — QR Escape Challenge",
        description: "Hunt Your Treasure is a QR-based treasure hunt where teams solve clues, scan hidden QR codes, and answer MCA and general knowledge questions while racing to unlock the next stage.",
        coordinator_name: "Mowlidharan; Hari Anand",
        coordinator_phone: "6385703353; 6384996961",
        category: "NON_TECHNICAL",
        team_type: "TEAM",
        min_team_size: 2,
        max_team_size: 4,
        day: 18,
        date: "2026-09-18",
        start_time: "10:30:00",
        end_time: "12:30:00",
        venue: "K503, K504",
        max_participants: 100,
        is_flagship: false,
        guardian_asset: "/assets/events/hunt_your_treasure.png",
        entry_fee: 0.0,
        status: "open",
      },
      {
        name: "Pixel Paradox: AI or Reality?",
        description: "Can you tell AI from reality? Analyze realistic images and media, spot subtle AI-generated artifacts, identify hidden inconsistencies, and reconstruct prompts to prove your observation and AI awareness.",
        coordinator_name: "Vignesh; Yashwanth",
        coordinator_phone: "9042223938; 7094674171",
        category: "NON_TECHNICAL",
        team_type: "TEAM",
        min_team_size: 2,
        max_team_size: 2,
        day: 18,
        date: "2026-09-18",
        start_time: "13:30:00",
        end_time: "15:30:00",
        venue: "IS Lab",
        max_participants: 90,
        is_flagship: false,
        guardian_asset: "/assets/events/pixel_paradox.png",
        entry_fee: 0.0,
        status: "open",
      },
      {
        name: "Project Phoenix: System Recovery",
        description: "Enter a simulated company facing a critical production failure. Work as a Recovery Squad to debug applications, recover hidden services, restore infrastructure, and handle live technical incidents before production goes down.",
        coordinator_name: "Surya Krishna; Sathish",
        coordinator_phone: "6369447530; 7305522754",
        category: "TECHNICAL",
        team_type: "TEAM",
        min_team_size: 3,
        max_team_size: 3,
        day: 18,
        date: "2026-09-18",
        start_time: "13:30:00",
        end_time: "16:00:00",
        venue: "CAT Lab",
        max_participants: 45,
        is_flagship: false,
        guardian_asset: "/assets/events/phoenix.png",
        entry_fee: 0.0,
        status: "open",
      },
      {
        name: "In The Slot",
        description: "Step into the world of IPL-style franchise auctions. Identify players from statistics, manage your budget, decode opponents’ hidden strategies, and make smart bidding decisions to build the strongest squad.",
        coordinator_name: "Keerthanaa; Deepa",
        coordinator_phone: "7904872566; 7603879932",
        category: "NON_TECHNICAL",
        team_type: "TEAM",
        min_team_size: 2,
        max_team_size: 4,
        day: 18,
        date: "2026-09-18",
        start_time: "15:00:00",
        end_time: "17:30:00",
        venue: "F202",
        max_participants: 60,
        is_flagship: false,
        guardian_asset: "/assets/events/in_the_slot.png",
        entry_fee: 0.0,
        status: "open",
      },
      {
        name: "Blind Coding",
        description: "When vision fades, logic takes over. Solve programming problems through an intentionally blurred coding interface, relying on your memory, syntax knowledge, algorithms, and problem-solving ability.",
        coordinator_name: "Chinnaya K; NitheeshMuthu Krishnan",
        coordinator_phone: "8056576531; 9944725360",
        category: "TECHNICAL",
        team_type: "INDIVIDUAL",
        min_team_size: 1,
        max_team_size: 1,
        day: 18,
        date: "2026-09-18",
        start_time: "15:30:00",
        end_time: "17:30:00",
        venue: "CC Lab",
        max_participants: 60,
        is_flagship: false,
        guardian_asset: "/assets/events/blind_coding.png",
        entry_fee: 0.0,
        status: "open",
      },
      {
        name: "The Extraction",
        description: "Step into a story-driven cybersecurity mission where you decode encrypted data, analyze digital clues, crack hashes, and solve multi-layered challenges to complete the final extraction.",
        coordinator_name: "Tino Britty; Srinithi",
        coordinator_phone: "9786350537; 6369227481",
        category: "TECHNICAL",
        team_type: "TEAM",
        min_team_size: 1,
        max_team_size: 2,
        day: 19,
        date: "2026-09-19",
        start_time: "09:30:00",
        end_time: "11:30:00",
        venue: "CAT Lab",
        max_participants: 50,
        is_flagship: false,
        guardian_asset: "/assets/events/the_extraction.png",
        entry_fee: 0.0,
        status: "open",
      },
      {
        name: "CodeXcape",
        description: "CodeXcape is a team-based technical escape room that tests programming, debugging, logical reasoning, teamwork, and problem-solving through a quiz round and timed coding challenges to unlock a six-digit escape code.",
        coordinator_name: "Abishek S; Sivapradeesh M",
        coordinator_phone: "7092294121; 8139081875",
        category: "TECHNICAL",
        team_type: "TEAM",
        min_team_size: 2,
        max_team_size: 2,
        day: 19,
        date: "2026-09-19",
        start_time: "10:00:00",
        end_time: "12:00:00",
        venue: "IS Lab",
        max_participants: 40,
        is_flagship: false,
        guardian_asset: "/assets/events/code_x_cape.png",
        entry_fee: 0.0,
        status: "open",
      },
      {
        name: "Debug Arena",
        description: "Take the role of a software engineer and hunt down bugs in faulty programs. Identify errors, fix code, optimize solutions, and tackle real-world debugging challenges across programming languages.",
        coordinator_name: "Sudharsanan G; Thamizh Thilaga",
        coordinator_phone: "9597055162; 7825007711",
        category: "TECHNICAL",
        team_type: "TEAM",
        min_team_size: 2,
        max_team_size: 2,
        day: 19,
        date: "2026-09-19",
        start_time: "10:00:00",
        end_time: "12:00:00",
        venue: "CC Lab",
        max_participants: 80,
        is_flagship: false,
        guardian_asset: "/assets/events/debug_arena.png",
        entry_fee: 0.0,
        status: "open",
      },
      {
        name: "NOSTOS: The Journey Home",
        description: "Embark on an Odyssey-inspired team adventure filled with riddles, wordplay, logic, patterns, and visual puzzles. Work together as a ship’s crew, overcome challenging trials, and find your way back to Ithaca.",
        coordinator_name: "Dayananda J; Induja E",
        coordinator_phone: "9524785141; 9791868857",
        category: "NON_TECHNICAL",
        team_type: "TEAM",
        min_team_size: 3,
        max_team_size: 4,
        day: 16,
        date: "2026-09-16",
        start_time: "13:30:00",
        end_time: "16:30:00",
        venue: "Assembly Hall",
        is_online: true,
        max_participants: 75,
        is_flagship: false,
        guardian_asset: "/assets/events/nostos.png",
        entry_fee: 0.0,
        status: "open",
      },
      {
        name: "Star of LOGIN",
        description: "The headline flagship event of LOGIN 2026. Only winners of other events qualify to compete in this event. Coordinators will communicate directly with qualified participants.",
        coordinator_name: "Mithulesh; Nandthitasri",
        coordinator_phone: "9488893193; 6380916334",
        category: "TECHNICAL",
        team_type: "INDIVIDUAL",
        min_team_size: 1,
        max_team_size: 1,
        day: 19,
        date: "2026-09-19",
        start_time: "12:30:00",
        end_time: "15:30:00",
        venue: "F202 & D Block Conference Hall",
        max_participants: 120,
        is_flagship: true,
        guardian_asset: "/assets/guardians/the_last_standing.svg",
        entry_fee: 0.0,
        status: "open",
      },
    ];

    // Clean up duplicate events
    await eventModel.destroy({
      where: {
        name: {
          [Op.in]: ['Extraction', 'extraction', 'Hunt Your Treasure — QR Escape Challenge']
        }
      }
    });

    for (const event of eventsData) {
      const [record, created] = await eventModel.findOrCreate({
        where: { name: event.name },
        defaults: event,
      });

      if (!created) {
        await record.update(event);
      }
    }

    const allEvents = await eventModel.findAll();
    console.log(`Successfully seeded ${allEvents.length} official LOGIN 2026 events!`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed LOGIN 2026 events:", error);
    process.exit(1);
  }
};

seedEvents();
