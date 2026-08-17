require("dotenv").config();
const { connectPostgres, sequelize } = require("./config/db/postgres");
const { LegacyEdition, LegacyItem } = require("./models/postgres");

async function seedLegacyData() {
  try {
    await connectPostgres();
    await sequelize.sync();

    const [edition, created] = await LegacyEdition.findOrCreate({
      where: { year: 2025 },
      defaults: {
        edition_number: 34,
        year: 2025,
        title: "LOGIN 2025 — 34th Edition",
        description: "Official photo and video archive of LOGIN 2025 held at PSG College of Technology.",
        cover_image: "/assets/guardians/the_last_standing.svg",
        is_published: true,
      },
    });

    const items = [
      {
        edition_id: edition.id,
        type: "PHOTO",
        storage_key: "/assets/guardians/veil.svg",
        caption: "Blind Coding Arena Finalists — LOGIN 2025",
        credit: "CAA Media Cell",
        consent_confirmed: true,
        sort_order: 1,
      },
      {
        edition_id: edition.id,
        type: "PHOTO",
        storage_key: "/assets/guardians/vaultwarden.svg",
        caption: "CodeXcape Technical Escape Room — Stage 2",
        credit: "CAA Media Cell",
        consent_confirmed: true,
        sort_order: 2,
      },
      {
        edition_id: edition.id,
        type: "VIDEO",
        storage_key: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        caption: "LOGIN 2025 Official Aftermovie & Valedictory Highlights",
        credit: "CAA Video Team",
        consent_confirmed: true,
        sort_order: 3,
      },
    ];

    for (const itemData of items) {
      await LegacyItem.findOrCreate({
        where: { edition_id: edition.id, caption: itemData.caption },
        defaults: itemData,
      });
    }

    console.log("Successfully seeded Legacy Edition and Media Items!");
    process.exit(0);
  } catch (err) {
    console.error("Legacy seed error:", err);
    process.exit(1);
  }
}

seedLegacyData();
