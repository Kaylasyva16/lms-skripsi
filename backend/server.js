import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

dotenv.config();

const app = express();

// fungsi untuk mengubah bytes → MB
function formatFileSize(bytes) {
  if (!bytes) return null;

  const mb = bytes / (1024 * 1024);
  return mb.toFixed(1) + " MB";
}

app.use(cors());
app.use(express.json());

// supaya file uploads bisa diakses browser
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Backend LMS Skripsi jalan 🚀");
});

app.post("/register", async (req, res) => {
  const { nama, email, password, role, nis, kelas } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query("INSERT INTO users (nama, email, password, role, nis, kelas) VALUES ($1,$2,$3,$4,$5,$6)", [nama, email.toLowerCase(), hashedPassword, role, nis, kelas]);

    if (role === "siswa") {
      await pool.query("INSERT INTO siswa (nis, nama, kelas) VALUES ($1,$2,$3)", [nis, nama, kelas]);
    }

    res.json({ message: "User berhasil dibuat" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Email tidak ditemukan" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login berhasil",
      token,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    next();
  };
};

///GURU///
app.get("/guru", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.nama,
        u.email,
        m.nama AS mapel
      FROM users u
      LEFT JOIN guru_mapel gm ON u.id = gm.guru_id
      LEFT JOIN mapel m ON gm.mapel_id = m.id
      WHERE u.role = 'guru'
      ORDER BY u.id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/guru", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  const { nama, email, password, mapel_id } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const userResult = await pool.query("INSERT INTO users (nama, email, password, role) VALUES ($1,$2,$3,'guru') RETURNING *", [nama, email.toLowerCase(), hashedPassword]);

  const user = userResult.rows[0];

  await pool.query("INSERT INTO guru_mapel (guru_id, mapel_id) VALUES ($1,$2)", [user.id, mapel_id]);

  res.json(user);
});

app.put("/guru/:id", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { nama, email, mapel_id } = req.body;

  try {
    const result = await pool.query("UPDATE guru SET nama=$1, email=$2, mapel_id=$3 WHERE id=$4 RETURNING *", [nama, email, mapel_id, id]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DASHBOARD GURU //
app.get("/dashboard/guru", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const userId = req.user.id;

    // Ambil mapel guru
    const mapelResult = await pool.query(
      `
      SELECT m.id, m.nama
      FROM guru_mapel gm
      JOIN mapel m ON gm.mapel_id = m.id
      WHERE gm.guru_id = $1
    `,
      [userId]
    );

    const mapelIds = mapelResult.rows.map((m) => m.id);

    if (mapelIds.length === 0) {
      return res.json({
        totalStudents: 0,
        activeProjects: 0,
        pendingGrades: 0,
        completionRate: 0,
      });
    }

    // Total siswa berdasarkan tugas mapel guru
    const siswaResult = await pool.query(
      `
      SELECT COUNT(DISTINCT u.id)
      FROM users u
      JOIN nilai n ON n.siswa_id = u.id
      JOIN tugas t ON t.id = n.tugas_id
      WHERE u.role = 'siswa'
      AND t.mapel_id = ANY($1)
    `,
      [mapelIds]
    );

    // Total tugas mapel guru
    const tugasResult = await pool.query(
      `
      SELECT COUNT(*)
      FROM tugas
      WHERE mapel_id = ANY($1)
    `,
      [mapelIds]
    );

    // Pending nilai hanya mapel guru
    const pendingResult = await pool.query(
      `
      SELECT COUNT(*)
      FROM nilai n
      JOIN tugas t ON t.id = n.tugas_id
      WHERE n.status = 'belum_dinilai'
      AND t.mapel_id = ANY($1)
    `,
      [mapelIds]
    );

    // Completion rate hanya mapel guru
    const completionResult = await pool.query(
      `
      SELECT 
        ROUND(
          COUNT(n.id) * 100.0 / NULLIF(COUNT(DISTINCT u.id),0),
          0
        ) AS completion
      FROM users u
      JOIN nilai n ON n.siswa_id = u.id
      JOIN tugas t ON t.id = n.tugas_id
      WHERE u.role = 'siswa'
      AND t.mapel_id = ANY($1)
    `,
      [mapelIds]
    );

    res.json({
      totalStudents: parseInt(siswaResult.rows[0].count) || 0,
      activeProjects: parseInt(tugasResult.rows[0].count) || 0,
      pendingGrades: parseInt(pendingResult.rows[0].count) || 0,
      completionRate: completionResult.rows[0].completion || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/dashboard/guru/progress", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        u.kelas,
        COUNT(DISTINCT u.id) AS total_siswa,
        ROUND(AVG(n.nilai),0) AS rata_rata,
        ROUND(
          COUNT(n.id) * 100.0 / NULLIF(COUNT(DISTINCT u.id),0),
          0
        ) AS completion
      FROM users u
      JOIN nilai n ON n.siswa_id = u.id
      JOIN tugas t ON t.id = n.tugas_id
      JOIN guru_mapel gm ON gm.mapel_id = t.mapel_id
      WHERE u.role = 'siswa'
      AND gm.guru_id = $1
      GROUP BY u.kelas
      ORDER BY u.kelas ASC
    `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/dashboard/guru/deadlines", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        t.id,
        t.judul,
        t.kelas,
        t.deadline,
        COUNT(n.id) AS submissions,
        (
          SELECT COUNT(*) 
          FROM users 
          WHERE role = 'siswa' 
          AND kelas = t.kelas
        ) AS total_siswa
      FROM tugas t
      JOIN guru_mapel gm ON gm.mapel_id = t.mapel_id
      LEFT JOIN nilai n ON n.tugas_id = t.id
      WHERE gm.guru_id = $1
      GROUP BY t.id
      ORDER BY t.deadline ASC
      LIMIT 5
    `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GURU UPLOAD MATERI //
app.post("/api/modules", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const { course_id, title, subtitle, description, type, file_url, order_number, duration, kelas, color, topics } = req.body;

    const result = await pool.query(
      `
      INSERT INTO modules
      (course_id, title, subtitle, description, type, file_url, order_number, duration, kelas, color, topics)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
      `,
      [course_id, title, subtitle, description, type, file_url, order_number, duration, kelas, color, JSON.stringify(topics ?? [])]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log("CREATE MODULE ERROR:", err);
    res.status(500).json({ message: "Upload gagal", error: err.message });
  }
});
// DELETE MODULE //
app.delete("/api/modules/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM modules WHERE id=$1", [id]);

  res.json({ message: "Module dihapus" });
});

app.put("/api/modules/:id", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, duration, kelas, color, topics } = req.body;

    console.log("HIT PUT /api/modules/:id");
    console.log("PARAM ID:", id);
    console.log("BODY UPDATE MODULE:", req.body);

    const result = await pool.query(
      `
      UPDATE modules
      SET title = $1,
          subtitle = $2,
          description = $3,
          duration = $4,
          kelas = $5,
          color = $6,
          topics = $7
      WHERE id = $8
      RETURNING *
      `,
      [title, subtitle, description, duration, kelas, color, JSON.stringify(topics ?? []), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Module tidak ditemukan" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE MODULE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// API AMBIL MATERI UNTUK SISWA //
app.get("/api/courses/:id/modules", async (req, res) => {
  const courseId = req.params.id;
  const siswaId = req.query.siswaId;

  try {
    const result = await pool.query(
      `
      SELECT 
        m.id,
        m.course_id,
        m.title,
        m.subtitle,
        m.description,
        m.type,
        m.file_url,
        m.order_number,
        m.duration,
        m.created_at,
        m.kelas,
        m.color,
        m.topics,
        COUNT(DISTINCT mt.id)::int AS total_materials,
        COUNT(DISTINCT CASE WHEN ps.status = 'selesai' THEN mt.id END)::int AS completed_materials
      FROM modules m
      LEFT JOIN materi mt
        ON mt.module_id = m.id
      LEFT JOIN progress_siswa ps
        ON ps.materi_id = mt.id
        AND ps.siswa_id = $2
      WHERE m.course_id = $1
      GROUP BY m.id
      ORDER BY m.order_number ASC
      `,
      [courseId, siswaId]
    );

    const modules = result.rows.map((row) => {
      let parsedTopics = [];

      try {
        if (Array.isArray(row.topics)) {
          parsedTopics = row.topics;
        } else if (typeof row.topics === "string") {
          parsedTopics = JSON.parse(row.topics);
        } else if (row.topics) {
          parsedTopics = row.topics;
        }
      } catch (e) {
        parsedTopics = [];
      }

      return {
        ...row,
        topics: Array.isArray(parsedTopics) ? parsedTopics : [],
      };
    });

    res.json(modules);
  } catch (err) {
    console.error("ERROR GET MODULES:", err);
    res.status(500).json({ error: err.message });
  }
});

// API TANDAI MODUL SELESAI //
app.post("/api/modules/:id/complete", async (req, res) => {
  const moduleId = req.params.id;
  const { siswa_id } = req.body;

  await pool.query(
    `INSERT INTO module_progress (siswa_id,module_id,is_completed,completed_at)
     VALUES ($1,$2,true,NOW())
     ON CONFLICT (siswa_id,module_id)
     DO UPDATE SET is_completed = true`,
    [siswa_id, moduleId]
  );

  res.json({ message: "Module selesai" });
});

// API PROGRESS BAR //
app.get("/api/courses/:id/progress/:userId", async (req, res) => {
  const courseId = req.params.id;
  const userId = req.params.userId;

  const total = await pool.query("SELECT COUNT(*) FROM modules WHERE course_id=$1", [courseId]);

  const complete = await pool.query(
    `SELECT COUNT(*) 
     FROM module_progress mp
     JOIN modules m ON mp.module_id = m.id
     WHERE mp.siswa_id=$1
     AND m.course_id=$2
     AND mp.is_completed=true`,
    [userId, courseId]
  );

  const totalModules = parseInt(total.rows[0].count);
  const completedModules = parseInt(complete.rows[0].count);

  const percent = totalModules === 0 ? 0 : (completedModules / totalModules) * 100;

  res.json({
    completedModules,
    totalModules,
    percent,
  });
});

// LOCK MODUL //
app.get("/api/modules/:id/access/:userId", async (req, res) => {
  const moduleId = req.params.id;
  const userId = req.params.userId;

  const module = await pool.query("SELECT * FROM modules WHERE id=$1", [moduleId]);

  if (module.rows.length === 0) {
    return res.status(404).json({ message: "Module tidak ditemukan" });
  }

  const current = module.rows[0];

  if (current.order_number === 1) {
    return res.json({ access: true });
  }

  const prev = await pool.query(
    `SELECT * FROM modules 
     WHERE course_id=$1 AND order_number=$2`,
    [current.course_id, current.order_number - 1]
  );

  if (prev.rows.length === 0) {
    return res.json({ access: true });
  }

  const progress = await pool.query(
    `SELECT * FROM module_progress
     WHERE siswa_id=$1 AND module_id=$2 AND is_completed=true`,
    [userId, prev.rows[0].id]
  );

  if (progress.rows.length === 0) {
    return res.json({ access: false });
  }

  res.json({ access: true });
});

/// MAPEL///
app.get("/mapel", authenticateToken, authorizeRole(["admin", "guru"]), async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mapel ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/mapel", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  const { nama } = req.body;

  try {
    const result = await pool.query("INSERT INTO mapel (nama) VALUES ($1) RETURNING *", [nama]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/mapel/:id", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;

  try {
    const result = await pool.query("UPDATE mapel SET nama = $1 WHERE id = $2 RETURNING *", [nama, id]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/mapel/:id", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM mapel WHERE id = $1", [id]);
    res.json({ message: "Mapel berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/// KELAS ///
app.get("/kelas", authenticateToken, authorizeRole(["admin", "guru"]), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        k.id,
        k.nama,
        g.nama AS "waliKelas"
      FROM kelas k
      LEFT JOIN guru g ON g.id = k.wali_kelas_id
      ORDER BY k.id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("ERROR GET KELAS:", err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE
app.post("/kelas", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  let { nama, waliKelas } = req.body;

  if (!nama) {
    return res.status(400).json({ error: "Nama kelas wajib diisi" });
  }

  nama = nama.toUpperCase();

  try {
    const insertResult = await pool.query(
      `
      INSERT INTO kelas (nama, wali_kelas_id)
      VALUES ($1, $2)
      RETURNING id, nama, wali_kelas_id
      `,
      [nama, waliKelas || null]
    );

    const kelasBaru = insertResult.rows[0];

    const result = await pool.query(
      `
      SELECT 
        k.id,
        k.nama,
        g.nama AS "waliKelas"
      FROM kelas k
      LEFT JOIN guru g ON g.id = k.wali_kelas_id
      WHERE k.id = $1
    `,
      [kelasBaru.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("ERROR CREATE KELAS:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/kelas/:id", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  let { nama, waliKelas } = req.body;

  nama = nama.toUpperCase();

  try {
    // 1️⃣ Update dulu
    await pool.query(
      `
      UPDATE kelas
      SET nama = $1,
          wali_kelas_id = $2
      WHERE id = $3
      `,
      [nama, waliKelas, id]
    );

    // 2️⃣ Ambil lagi pakai JOIN supaya konsisten
    const result = await pool.query(
      `
      SELECT 
        k.id,
        k.nama,
        g.nama AS "waliKelas"
      FROM kelas k
      LEFT JOIN guru g ON g.id = k.wali_kelas_id
      WHERE k.id = $1
      `,
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("ERROR UPDATE KELAS:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/kelas/:id", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM kelas WHERE id=$1", [id]);
    res.json({ message: "Kelas berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/// SISWA ///
app.get("/siswa", authenticateToken, authorizeRole(["admin", "guru"]), async (req, res) => {
  const result = await pool.query("SELECT id, nis, nama, kelas FROM users WHERE role = 'siswa' ORDER BY id ASC");

  res.json(result.rows);
});

app.put("/siswa/:id", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { nis, nama, kelas } = req.body;

  try {
    const result = await pool.query("UPDATE users SET nis=$1, nama=$2, kelas=$3 WHERE id=$4 AND role='siswa' RETURNING id, nis, nama, kelas", [nis, nama, kelas, id]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/siswa/:id", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM users WHERE id=$1 AND role='siswa'", [id]);

    res.json({ message: "Siswa berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET PROGRESS ================= */

app.get("/progress/:siswaId/:courseId", async (req, res) => {
  const { siswaId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
      COUNT(*) FILTER (WHERE ps.status='selesai') AS selesai,
      COUNT(m.id) AS total
      FROM materi m
      LEFT JOIN progress_siswa ps
      ON ps.materi_id = m.id
      AND ps.siswa_id = $1
      `,
      [siswaId]
    );

    const selesai = Number(result.rows[0].selesai);
    const total = Number(result.rows[0].total);

    const progress = total === 0 ? 0 : Math.round((selesai / total) * 100);

    res.json({
      selesai,
      total,
      progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= TANDAI MATERI SELESAI ================= */

app.post("/materi/selesai", async (req, res) => {
  const { siswaId, materiId } = req.body;

  try {
    await pool.query(
      `
      INSERT INTO progress_siswa (siswa_id, materi_id, status)
      VALUES ($1, $2, 'selesai')
      ON CONFLICT (siswa_id, materi_id)
      DO UPDATE SET status = 'selesai'
      `,
      [siswaId, materiId]
    );

    res.json({
      message: "Materi berhasil ditandai selesai",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/public/kelas", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nama 
      FROM kelas
      ORDER BY id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buat API Ambil Course //
app.get("/api/courses", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        COUNT(m.id) as total_modules
      FROM courses c
      LEFT JOIN modules m 
      ON m.course_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error mengambil course" });
  }
});

// MATERI //
app.post("/api/materials", authenticateToken, authorizeRole(["guru"]), upload.single("file"), async (req, res) => {
  try {
    const { title, description, module_id, type, order_number, duration, url } = req.body;

    const file_url = req.file ? req.file.filename : null;
    const file_size = req.file ? req.file.size : null;

    let pages = null;

    if (req.file && req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      pages = pdfData.numpages;
    }

    const created_by = req.user.id;

    await pool.query(
      `INSERT INTO materi
      (title, description, module_id, type, file_url, order_number, duration, url, file_size, pages, created_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [title, description, module_id, type, file_url, order_number, duration, url, file_size, pages, created_by]
    );

    res.json({ message: "Materi berhasil ditambahkan" });
  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/materials/:id", authenticateToken, authorizeRole(["guru"]), upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, duration, url } = req.body;

    let file_url = null;
    let file_size = null;
    let pages = null;

    if (req.file) {
      file_url = req.file.filename;
      file_size = req.file.size;

      if (req.file.mimetype === "application/pdf") {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        pages = pdfData.numpages;
      }
    }

    const result = await pool.query(
      `
      UPDATE materi
      SET title = $1,
          description = $2,
          type = $3,
          duration = $4,
          url = $5,
          file_url = COALESCE($6, file_url),
          file_size = COALESCE($7, file_size),
          pages = COALESCE($8, pages)
      WHERE id = $9
      RETURNING *
      `,
      [title, description, type, duration, url, file_url, file_size, pages, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Materi tidak ditemukan" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/modules/:id/materials", async (req, res) => {
  try {
    const moduleId = req.params.id;
    const siswaId = req.query.siswaId;

    const result = await pool.query(
      `
      SELECT 
        materi.*,
        users.nama AS instructor,
        CASE
          WHEN ps.status = 'selesai' THEN true
          ELSE false
        END AS completed
      FROM materi
      LEFT JOIN users
        ON users.id = materi.created_by
      LEFT JOIN progress_siswa ps
        ON ps.materi_id = materi.id
        AND ps.siswa_id = $2
      WHERE materi.module_id = $1
      ORDER BY materi.id ASC
      `,
      [moduleId, siswaId]
    );

    console.log("MATERIAL RESPONSE:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("ERROR QUERY:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/me", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        id,
        nama,
        email,
        role,
        nis,
        kelas
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= QUIZ ================= */

// GET semua quiz milik guru
app.get("/api/quizzes", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        q.id,
        q.title,
        q.kelas,
        q.description,
        q.total_questions AS "totalQuestions",
        q.duration,
        q.question_types AS "questionTypes",
        q.status,
        q.created_at AS "createdAt",
        0 AS submissions,
        0 AS "averageScore"
      FROM quizzes q
      WHERE q.created_by = $1
      ORDER BY q.created_at DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET QUIZZES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/quizzes", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const { title, kelas, description, totalQuestions, duration, questionTypes, status } = req.body;

    const result = await pool.query(
      `
      INSERT INTO quizzes
      (title, kelas, description, total_questions, duration, question_types, status, created_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING
        id,
        title,
        kelas,
        description,
        total_questions AS "totalQuestions",
        duration,
        question_types AS "questionTypes",
        status,
        created_at AS "createdAt",
        0 AS submissions,
        0 AS "averageScore"
      `,
      [title, kelas, description, totalQuestions, duration, JSON.stringify(questionTypes || []), status || "draft", req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("CREATE QUIZ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/quizzes/:id", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, kelas, description, totalQuestions, duration, questionTypes, status } = req.body;

    const result = await pool.query(
      `
      UPDATE quizzes
      SET title = $1,
          kelas = $2,
          description = $3,
          total_questions = $4,
          duration = $5,
          question_types = $6,
          status = $7
      WHERE id = $8
      AND created_by = $9
      RETURNING
        id,
        title,
        kelas,
        description,
        total_questions AS "totalQuestions",
        duration,
        question_types AS "questionTypes",
        status,
        created_at AS "createdAt",
        0 AS submissions,
        0 AS "averageScore"
      `,
      [title, kelas, description, totalQuestions, duration, JSON.stringify(questionTypes || []), status, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Quiz tidak ditemukan" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE QUIZ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/quizzes/:id", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM quizzes
      WHERE id = $1
      AND created_by = $2
      RETURNING id
      `,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Quiz tidak ditemukan" });
    }

    res.json({ message: "Quiz berhasil dihapus" });
  } catch (err) {
    console.error("DELETE QUIZ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/quizzes/:id/duplicate", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await pool.query("SELECT * FROM quizzes WHERE id = $1 AND created_by = $2", [id, req.user.id]);

    if (quiz.rows.length === 0) {
      return res.status(404).json({ message: "Quiz tidak ditemukan" });
    }

    const q = quiz.rows[0];

    const result = await pool.query(
      `
      INSERT INTO quizzes
      (title, kelas, description, total_questions, duration, question_types, status, created_by)
      VALUES ($1,$2,$3,$4,$5,$6,'draft',$7)
      RETURNING
        id,
        title,
        kelas,
        description,
        total_questions AS "totalQuestions",
        duration,
        question_types AS "questionTypes",
        status,
        created_at AS "createdAt",
        0 AS submissions,
        0 AS "averageScore"
      `,
      [q.title + " (Copy)", q.kelas, q.description, q.total_questions, q.duration, q.question_types, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("DUPLICATE QUIZ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// QUIZ QUESTIONS //
app.get("/api/quizzes/:quizId/questions", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const { quizId } = req.params;

    const quizCheck = await pool.query("SELECT * FROM quizzes WHERE id = $1 AND created_by = $2", [quizId, req.user.id]);

    if (quizCheck.rows.length === 0) {
      return res.status(404).json({ message: "Quiz tidak ditemukan" });
    }

    const questionResult = await pool.query(
      `
      SELECT
        id,
        quiz_id AS "quizId",
        question_order AS "questionOrder",
        type,
        question_text AS "questionText",
        explanation,
        points,
        payload
      FROM quiz_questions
      WHERE quiz_id = $1
      ORDER BY question_order ASC
      `,
      [quizId]
    );

    const questions = questionResult.rows;

    for (const question of questions) {
      if (question.type === "multiple-choice") {
        const optionResult = await pool.query(
          `
          SELECT
            id,
            option_order AS "optionOrder",
            option_text AS "optionText",
            is_correct AS "isCorrect"
          FROM quiz_options
          WHERE question_id = $1
          ORDER BY option_order ASC
          `,
          [question.id]
        );

        question.options = optionResult.rows;
      } else {
        question.options = [];
      }
    }

    res.json(questions);
  } catch (err) {
    console.error("GET QUESTIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/quizzes/:quizId/questions", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  const client = await pool.connect();

  try {
    const { quizId } = req.params;
    const { type, questionText, explanation, points, payload, options } = req.body;

    await client.query("BEGIN");

    const quizCheck = await client.query("SELECT * FROM quizzes WHERE id = $1 AND created_by = $2", [quizId, req.user.id]);

    if (quizCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Quiz tidak ditemukan" });
    }

    const orderResult = await client.query(
      `
      SELECT COALESCE(MAX(question_order), 0) + 1 AS next_order
      FROM quiz_questions
      WHERE quiz_id = $1
      `,
      [quizId]
    );

    const nextOrder = orderResult.rows[0].next_order;

    const questionResult = await client.query(
      `
      INSERT INTO quiz_questions
      (quiz_id, question_order, type, question_text, explanation, points, payload)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING
        id,
        quiz_id AS "quizId",
        question_order AS "questionOrder",
        type,
        question_text AS "questionText",
        explanation,
        points,
        payload
      `,
      [quizId, nextOrder, type, questionText, explanation || null, points || 10, JSON.stringify(payload || {})]
    );

    const question = questionResult.rows[0];

    if (type === "multiple-choice" && Array.isArray(options)) {
      for (let i = 0; i < options.length; i++) {
        const option = options[i];

        await client.query(
          `
          INSERT INTO quiz_options
          (question_id, option_order, option_text, is_correct)
          VALUES ($1,$2,$3,$4)
          `,
          [question.id, i + 1, option.optionText, option.isCorrect]
        );
      }
    }

    await client.query(
      `
      UPDATE quizzes
      SET total_questions = (
        SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = $1
      )
      WHERE id = $1
      `,
      [quizId]
    );

    await client.query("COMMIT");
    res.status(201).json(question);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("CREATE QUESTION ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.put("/api/questions/:id", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { type, questionText, explanation, points, payload, options } = req.body;

    await client.query("BEGIN");

    const checkResult = await client.query(
      `
      SELECT q.*, quiz.created_by
      FROM quiz_questions q
      JOIN quizzes quiz ON quiz.id = q.quiz_id
      WHERE q.id = $1 AND quiz.created_by = $2
      `,
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Soal tidak ditemukan" });
    }

    const question = checkResult.rows[0];

    const updateResult = await client.query(
      `
      UPDATE quiz_questions
      SET type = $1,
          question_text = $2,
          explanation = $3,
          points = $4,
          payload = $5
      WHERE id = $6
      RETURNING
        id,
        quiz_id AS "quizId",
        question_order AS "questionOrder",
        type,
        question_text AS "questionText",
        explanation,
        points,
        payload
      `,
      [type, questionText, explanation || null, points || 10, JSON.stringify(payload || {}), id]
    );

    await client.query("DELETE FROM quiz_options WHERE question_id = $1", [id]);

    if (type === "multiple-choice" && Array.isArray(options)) {
      for (let i = 0; i < options.length; i++) {
        const option = options[i];

        await client.query(
          `
          INSERT INTO quiz_options
          (question_id, option_order, option_text, is_correct)
          VALUES ($1,$2,$3,$4)
          `,
          [id, i + 1, option.optionText, option.isCorrect]
        );
      }
    }

    await client.query("COMMIT");
    res.json(updateResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("UPDATE QUESTION ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.delete("/api/questions/:id", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const checkResult = await client.query(
      `
      SELECT q.*, quiz.created_by
      FROM quiz_questions q
      JOIN quizzes quiz ON quiz.id = q.quiz_id
      WHERE q.id = $1 AND quiz.created_by = $2
      `,
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Soal tidak ditemukan" });
    }

    const quizId = checkResult.rows[0].quiz_id;

    await client.query("DELETE FROM quiz_questions WHERE id = $1", [id]);

    await client.query(
      `
      UPDATE quizzes
      SET total_questions = (
        SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = $1
      )
      WHERE id = $1
      `,
      [quizId]
    );

    await client.query("COMMIT");

    res.json({ message: "Soal berhasil dihapus" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("DELETE QUESTION ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

/* ================= QUIZ SISWA ================= */
app.get("/api/student/quizzes", authenticateToken, authorizeRole(["siswa"]), async (req, res) => {
  try {
    const userResult = await pool.query(
      `
      SELECT id, nama, kelas
      FROM users
      WHERE id = $1 AND role = 'siswa'
      `,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    const siswa = userResult.rows[0];

    const result = await pool.query(
      `
      SELECT
        q.id,
        q.title,
        q.kelas,
        q.description,
        q.total_questions AS "totalQuestions",
        q.duration,
        q.question_types AS "questionTypes",
        q.status,
        q.created_at AS "createdAt"
      FROM quizzes q
      WHERE q.status = 'published'
      AND q.kelas = $1
      ORDER BY q.created_at DESC
      `,
      [siswa.kelas]
    );

    const quizzes = result.rows.map((quiz) => {
      let parsedTypes = [];

      try {
        if (Array.isArray(quiz.questionTypes)) {
          parsedTypes = quiz.questionTypes;
        } else if (typeof quiz.questionTypes === "string") {
          parsedTypes = JSON.parse(quiz.questionTypes);
        }
      } catch (e) {
        parsedTypes = [];
      }

      return {
        ...quiz,
        questionTypes: parsedTypes,
        type: parsedTypes[0] || "multiple-choice",
        level: "Beginner",
        icon: "📝",
        score: null,
      };
    });

    res.json(quizzes);
  } catch (err) {
    console.error("GET STUDENT QUIZZES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/student/quizzes/:id", authenticateToken, authorizeRole(["siswa"]), async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await pool.query(
      `
      SELECT id, kelas
      FROM users
      WHERE id = $1 AND role = 'siswa'
      `,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    const siswa = userResult.rows[0];

    const result = await pool.query(
      `
      SELECT
        q.id,
        q.title,
        q.kelas,
        q.description,
        q.total_questions AS "totalQuestions",
        q.duration,
        q.question_types AS "questionTypes",
        q.status,
        q.created_at AS "createdAt"
      FROM quizzes q
      WHERE q.id = $1
      AND q.status = 'published'
      AND q.kelas = $2
      `,
      [id, siswa.kelas]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Quiz tidak ditemukan atau tidak bisa diakses" });
    }

    const quiz = result.rows[0];

    let parsedTypes = [];
    try {
      if (Array.isArray(quiz.questionTypes)) {
        parsedTypes = quiz.questionTypes;
      } else if (typeof quiz.questionTypes === "string") {
        parsedTypes = JSON.parse(quiz.questionTypes);
      }
    } catch (e) {
      parsedTypes = [];
    }

    res.json({
      ...quiz,
      questionTypes: parsedTypes,
      type: parsedTypes[0] || "multiple-choice",
      level: "Beginner",
      icon: "📝",
    });
  } catch (err) {
    console.error("GET STUDENT QUIZ DETAIL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/student/quizzes/:quizId/questions", authenticateToken, authorizeRole(["siswa"]), async (req, res) => {
  try {
    const { quizId } = req.params;

    const userResult = await pool.query(
      `
      SELECT id, kelas
      FROM users
      WHERE id = $1 AND role = 'siswa'
      `,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    const siswa = userResult.rows[0];

    const quizCheck = await pool.query(
      `
      SELECT *
      FROM quizzes
      WHERE id = $1
      AND status = 'published'
      AND kelas = $2
      `,
      [quizId, siswa.kelas]
    );

    if (quizCheck.rows.length === 0) {
      return res.status(404).json({ message: "Quiz tidak ditemukan atau tidak bisa diakses" });
    }

    const questionResult = await pool.query(
      `
      SELECT
        id,
        quiz_id AS "quizId",
        question_order AS "questionOrder",
        type,
        question_text AS "questionText",
        explanation,
        points,
        payload
      FROM quiz_questions
      WHERE quiz_id = $1
      ORDER BY question_order ASC
      `,
      [quizId]
    );

    const questions = questionResult.rows;

    for (const question of questions) {
      if (question.type === "multiple-choice") {
        const optionResult = await pool.query(
          `
          SELECT
          id,
          option_order AS "optionOrder",
          option_text AS "optionText",
          is_correct AS "isCorrect"
        FROM quiz_options
        WHERE question_id = $1
        ORDER BY option_order ASC
          `,
          [question.id]
        );

        question.options = optionResult.rows;
      } else {
        question.options = [];
      }
    }

    res.json(questions);
  } catch (err) {
    console.error("GET STUDENT QUIZ QUESTIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/test", (req, res) => {
  res.json({ message: "API hidup" });
});

export default app;
