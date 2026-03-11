import { db } from "../src/db/connection.ts";

async function seedDummyData() {
  console.log("Seeding dummy users and progress...");

  const dummyUsers = [
    { name: "Ahmad Dummy", email: "ahmad@example.com", google_id: "dummy_1" },
    { name: "Siti Dummy", email: "siti@example.com", google_id: "dummy_2" },
    { name: "Zaid Dummy", email: "zaid@example.com", google_id: "dummy_3" },
  ];

  for (const u of dummyUsers) {
    db.prepare(`
      INSERT INTO users (google_id, email, name, role)
      VALUES (?, ?, ?, 'member')
      ON CONFLICT(google_id) DO UPDATE SET name=excluded.name
    `).run(u.google_id, u.email, u.name);
  }

  const users = db.prepare("SELECT id, name FROM users WHERE google_id LIKE 'dummy_%'").all() as { id: number, name: string }[];
  
  const ahmad = users.find(u => u.name === "Ahmad Dummy");
  const siti = users.find(u => u.name === "Siti Dummy");
  const zaid = users.find(u => u.name === "Zaid Dummy");

  if (ahmad) {
    // Ahmad: Ali 'Imran (3) Ayah 5
    db.prepare("INSERT INTO progress_entries (user_id, surah_number, last_ayah) VALUES (?, ?, ?) ON CONFLICT DO UPDATE SET last_ayah=excluded.last_ayah")
      .run(ahmad.id, 3, 5);
    db.prepare("INSERT INTO progress_log (user_id, surah_number, ayah_from, ayah_to) VALUES (?, ?, ?, ?)")
      .run(ahmad.id, 3, 0, 5);
  }

  if (siti) {
    // Siti: Al-Baqarah (2) Ayah 2
    db.prepare("INSERT INTO progress_entries (user_id, surah_number, last_ayah) VALUES (?, ?, ?) ON CONFLICT DO UPDATE SET last_ayah=excluded.last_ayah")
      .run(siti.id, 2, 2);
    db.prepare("INSERT INTO progress_log (user_id, surah_number, ayah_from, ayah_to) VALUES (?, ?, ?, ?)")
      .run(siti.id, 2, 0, 2);
  }

  if (zaid) {
    // Zaid: Both
    db.prepare("INSERT INTO progress_entries (user_id, surah_number, last_ayah) VALUES (?, ?, ?) ON CONFLICT DO UPDATE SET last_ayah=excluded.last_ayah")
      .run(zaid.id, 3, 5);
    db.prepare("INSERT INTO progress_entries (user_id, surah_number, last_ayah) VALUES (?, ?, ?) ON CONFLICT DO UPDATE SET last_ayah=excluded.last_ayah")
      .run(zaid.id, 2, 2);
    db.prepare("INSERT INTO progress_log (user_id, surah_number, ayah_from, ayah_to) VALUES (?, ?, ?, ?)")
      .run(zaid.id, 3, 0, 5);
    db.prepare("INSERT INTO progress_log (user_id, surah_number, ayah_from, ayah_to) VALUES (?, ?, ?, ?)")
      .run(zaid.id, 2, 0, 2);
  }

  console.log("Dummy data seeded successfully.");
}

seedDummyData();
