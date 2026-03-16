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

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedExt = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".zip"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExt.includes(ext)) {
      return cb(new Error("Tipe file tidak didukung"));
    }

    cb(null, true);
  },
});

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
        COALESCE(stats.submissions, 0) AS submissions,
        COALESCE(stats."averageScore", 0) AS "averageScore"
      FROM quizzes q
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*)::int AS submissions,
          COALESCE(ROUND(AVG(qs.total_score)), 0)::int AS "averageScore"
        FROM quiz_submissions qs
        WHERE qs.quiz_id = q.id
      ) stats ON true
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
        q.created_at AS "createdAt",
        qs.id AS "submissionId",
        qs.status AS "submissionStatus",
        qs.submitted_at AS "submittedAt",
        qs.total_score AS "totalScore"
      FROM quizzes q
      LEFT JOIN quiz_submissions qs
        ON qs.quiz_id = q.id
        AND qs.student_id = $2
      WHERE q.status = 'published'
      AND q.kelas = $1
      ORDER BY q.created_at DESC
      `,
      [siswa.kelas, req.user.id]
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
        score: quiz.totalScore ?? null,
        submissionStatus: quiz.submissionStatus || "not_started",
        submittedAt: quiz.submittedAt || null,
        totalScore: quiz.totalScore ?? null,
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
        q.created_at AS "createdAt",
        qs.id AS "submissionId",
        qs.status AS "submissionStatus",
        qs.submitted_at AS "submittedAt",
        qs.total_score AS "totalScore"
      FROM quizzes q
      LEFT JOIN quiz_submissions qs
        ON qs.quiz_id = q.id
        AND qs.student_id = $2
      WHERE q.id = $1
      AND q.status = 'published'
      AND q.kelas = $3
      `,
      [id, req.user.id, siswa.kelas]
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
      submissionStatus: quiz.submissionStatus || "not_started",
      submittedAt: quiz.submittedAt || null,
      totalScore: quiz.totalScore ?? null,
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

    // TAMBAHKAN INI
    const existingSubmission = await pool.query(
      `
      SELECT id, status
      FROM quiz_submissions
      WHERE quiz_id = $1 AND student_id = $2
      `,
      [quizId, req.user.id]
    );

    if (existingSubmission.rows.length > 0) {
      return res.status(403).json({
        message: "Quiz sudah pernah dikerjakan dan tidak bisa diulang",
      });
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

// Endpoint siswa submit jawaban essay
app.post("/api/student/quizzes/:quizId/submit", authenticateToken, authorizeRole(["siswa"]), async (req, res) => {
  const client = await pool.connect();

  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Jawaban tidak boleh kosong" });
    }

    await client.query("BEGIN");

    const siswaResult = await client.query(
      `
      SELECT id, kelas
      FROM users
      WHERE id = $1 AND role = 'siswa'
      `,
      [req.user.id]
    );

    if (siswaResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    const siswa = siswaResult.rows[0];

    const quizResult = await client.query(
      `
      SELECT id, kelas, status
      FROM quizzes
      WHERE id = $1
      `,
      [quizId]
    );

    if (quizResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Quiz tidak ditemukan" });
    }

    const quiz = quizResult.rows[0];

    if (quiz.status !== "published") {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Quiz belum dipublikasikan" });
    }

    if (quiz.kelas !== siswa.kelas) {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "Quiz ini bukan untuk kelas siswa" });
    }

    const questionResult = await client.query(
      `
      SELECT id, type
      FROM quiz_questions
      WHERE quiz_id = $1
      ORDER BY question_order ASC
      `,
      [quizId]
    );

    const validQuestionIds = questionResult.rows.map((q) => q.id);

    // CEK apakah siswa sudah pernah submit
    const existingSubmission = await client.query(
      `
      SELECT id, status
      FROM quiz_submissions
      WHERE quiz_id = $1 AND student_id = $2
      `,
      [quizId, req.user.id]
    );

    if (existingSubmission.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Kamu sudah pernah mengumpulkan quiz ini" });
    }

    const submissionResult = await client.query(
      `
      INSERT INTO quiz_submissions (quiz_id, student_id, status)
      VALUES ($1, $2, 'submitted')
      RETURNING id, quiz_id AS "quizId", student_id AS "studentId", submitted_at AS "submittedAt", status
      `,
      [quizId, req.user.id]
    );

    const submission = submissionResult.rows[0];

    for (const item of answers) {
      const { questionId, answerText } = item;

      if (!validQuestionIds.includes(questionId)) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: `Question ID ${questionId} tidak valid untuk quiz ini` });
      }

      await client.query(
        `
        INSERT INTO quiz_submission_answers (submission_id, question_id, answer_text)
        VALUES ($1, $2, $3)
        `,
        [submission.id, questionId, answerText || ""]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Quiz berhasil dikumpulkan",
      submission,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("SUBMIT QUIZ ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Endpoint guru ambil daftar submission essay per quiz
//Periksa Jawaban Essay.
app.get("/api/quizzes/:quizId/essay-submissions", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const { quizId } = req.params;

    const quizCheck = await pool.query(
      `
        SELECT id
        FROM quizzes
        WHERE id = $1 AND created_by = $2
        `,
      [quizId, req.user.id]
    );

    if (quizCheck.rows.length === 0) {
      return res.status(404).json({ message: "Quiz tidak ditemukan" });
    }

    const result = await pool.query(
      `
        SELECT
          qs.id,
          u.nama AS "studentName",
          u.kelas AS "studentClass",
          qs.submitted_at AS "submittedAt",
          qs.total_score AS "totalScore"
        FROM quiz_submissions qs
        JOIN users u ON u.id = qs.student_id
        WHERE qs.quiz_id = $1
        ORDER BY qs.submitted_at DESC
        `,
      [quizId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET ESSAY SUBMISSIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint guru ambil detail 1 submission
app.get("/api/essay-submissions/:submissionId", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submissionCheck = await pool.query(
      `
      SELECT
        qs.id,
        qs.quiz_id,
        qs.student_id,
        qs.submitted_at,
        qs.total_score,
        q.title AS "quizTitle",
        q.created_by,
        u.nama AS "studentName",
        u.kelas AS "studentClass"
      FROM quiz_submissions qs
      JOIN quizzes q ON q.id = qs.quiz_id
      JOIN users u ON u.id = qs.student_id
      WHERE qs.id = $1 AND q.created_by = $2
      `,
      [submissionId, req.user.id]
    );

    if (submissionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Submission tidak ditemukan" });
    }

    const submission = submissionCheck.rows[0];

    const answersResult = await pool.query(
      `
      SELECT
        qsa.id,
        qsa.question_id AS "questionId",
        qq.question_order AS "questionOrder",
        qq.question_text AS "question",
        qsa.answer_text AS "answer",
        qsa.score,
        qsa.feedback
      FROM quiz_submission_answers qsa
      JOIN quiz_questions qq ON qq.id = qsa.question_id
      WHERE qsa.submission_id = $1
      ORDER BY qq.question_order ASC
      `,
      [submissionId]
    );

    res.json({
      id: submission.id,
      quizId: submission.quiz_id,
      quizTitle: submission.quizTitle,
      studentName: submission.studentName,
      studentClass: submission.studentClass,
      submittedAt: submission.submitted_at,
      totalScore: submission.total_score,
      answers: answersResult.rows,
    });
  } catch (err) {
    console.error("GET ESSAY SUBMISSION DETAIL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint guru simpan penilaian essay

app.put("/api/essay-submissions/:submissionId/grade", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  const client = await pool.connect();

  try {
    const { submissionId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Data penilaian tidak boleh kosong" });
    }

    await client.query("BEGIN");

    const submissionCheck = await client.query(
      `
      SELECT
        qs.id,
        qs.quiz_id,
        q.created_by
      FROM quiz_submissions qs
      JOIN quizzes q ON q.id = qs.quiz_id
      WHERE qs.id = $1 AND q.created_by = $2
      `,
      [submissionId, req.user.id]
    );

    if (submissionCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Submission tidak ditemukan" });
    }

    for (const item of answers) {
      const { questionId, score, feedback } = item;

      await client.query(
        `
        UPDATE quiz_submission_answers
        SET score = $1,
            feedback = $2
        WHERE submission_id = $3
          AND question_id = $4
        `,
        [score ?? null, feedback ?? null, submissionId, questionId]
      );
    }

    const totalResult = await client.query(
      `
      SELECT ROUND(AVG(score), 2) AS total_score
      FROM quiz_submission_answers
      WHERE submission_id = $1
      AND score IS NOT NULL
      `,
      [submissionId]
    );

    const totalScore = totalResult.rows[0].total_score;

    await client.query(
      `
      UPDATE quiz_submissions
      SET total_score = $1,
          status = 'graded',
          graded_at = NOW(),
          graded_by = $2
      WHERE id = $3
      `,
      [totalScore, req.user.id, submissionId]
    );

    await client.query("COMMIT");

    res.json({
      message: "Penilaian berhasil disimpan",
      totalScore,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("GRADE ESSAY ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

/* ================= PROJECT ================= */

app.get("/api/projects", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        p.id,
        p.title,
        p.class_id AS "classId",
        k.nama AS class,
        p.type,
        TO_CHAR(p.deadline, 'DD Mon YYYY') AS deadline,
        p.description,
        p.members_per_group AS "membersPerGroup",
        p.status,
        p.created_at AS "createdAt"
      FROM projects p
      JOIN kelas k ON k.id = p.class_id
      WHERE p.created_by = $1
      ORDER BY p.created_at DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET PROJECTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/projects", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  const client = await pool.connect();

  try {
    const { title, classId, type, deadline, description, membersPerGroup } = req.body;

    if (!title || !classId || !type || !deadline) {
      return res.status(400).json({ message: "Data proyek belum lengkap" });
    }

    await client.query("BEGIN");

    const result = await client.query(
      `
      INSERT INTO projects
      (title, class_id, type, deadline, description, members_per_group, status, created_by)
      VALUES ($1,$2,$3,$4,$5,$6,'active',$7)
      RETURNING
        id,
        title,
        class_id AS "classId",
        type,
        deadline,
        description,
        members_per_group AS "membersPerGroup",
        status,
        created_at AS "createdAt"
      `,
      [title, classId, type, deadline, description || null, type === "group" ? membersPerGroup || 3 : null, req.user.id]
    );

    const project = result.rows[0];

    const defaultSyntaxes = [
      {
        syntaxNo: 1,
        title: "Sintaks 1: Identifikasi Masalah",
        description: "Mengidentifikasi masalah yang akan diselesaikan",
        stages: [
          { stageNo: 1, title: "Tahap 1: Orientasi", subtitle: "Memahami konteks permasalahan", instruction: "Jelaskan konteks masalah.", allowFileUpload: false },
          { stageNo: 2, title: "Tahap 2: Rencana", subtitle: "Merumuskan rencana secara jelas", instruction: "Jelaskan rencana penyelesaian masalah.", allowFileUpload: true },
          { stageNo: 3, title: "Tahap 3: Memvalidasi", subtitle: "Validasi dan kelengkapan", instruction: "Tuliskan indikator keberhasilan.", allowFileUpload: false },
          { stageNo: 4, title: "Tahap 4: Analisis", subtitle: "Analisis permasalahan", instruction: "Analisis kebutuhan dan proses.", allowFileUpload: false },
        ],
      },
      {
        syntaxNo: 2,
        title: "Sintaks 2: Perencanaan Proyek",
        description: "Membuat perencanaan proyek secara detail",
        stages: [
          { stageNo: 1, title: "Tahap 1: Tujuan dan Deskripsi Proyek", subtitle: "Menentukan tujuan proyek", instruction: "Tuliskan tujuan dan deskripsi proyek.", allowFileUpload: false },
          { stageNo: 2, title: "Tahap 2: Menentukan Fitur Proyek", subtitle: "Menentukan fitur utama", instruction: "Tuliskan fitur utama proyek.", allowFileUpload: false },
          { stageNo: 3, title: "Tahap 3: Menentukan Tools & Bahasa", subtitle: "Memilih tools dan bahasa", instruction: "Tuliskan tools dan bahasa yang digunakan.", allowFileUpload: false },
        ],
      },
      {
        syntaxNo: 3,
        title: "Sintaks 3: Penyusunan Jadwal",
        description: "Menyusun timeline dan jadwal pengerjaan",
        stages: [
          { stageNo: 1, title: "Tahap 1: Menentukan Durasi Proyek", subtitle: "Menentukan durasi proyek", instruction: "Tuliskan estimasi durasi proyek.", allowFileUpload: false },
          { stageNo: 2, title: "Tahap 2: Pembagian Tugas Anggota", subtitle: "Membagi tugas anggota", instruction: "Jelaskan pembagian tugas anggota.", allowFileUpload: false },
          { stageNo: 3, title: "Tahap 3: Menyusun Timeline", subtitle: "Membuat timeline detail", instruction: "Tuliskan timeline pengerjaan proyek.", allowFileUpload: false },
        ],
      },
      {
        syntaxNo: 4,
        title: "Sintaks 4: Pelaksanaan Proyek",
        description: "Mengimplementasikan proyek sesuai rencana",
        stages: [
          { stageNo: 1, title: "Tahap 1: Log Aktivitas 1", subtitle: "Catatan aktivitas pengerjaan", instruction: "Tuliskan aktivitas pelaksanaan proyek.", allowFileUpload: false },
          { stageNo: 2, title: "Tahap 2: Log Aktivitas 2", subtitle: "Catatan aktivitas lanjutan", instruction: "Tuliskan aktivitas lanjutan.", allowFileUpload: false },
          { stageNo: 3, title: "Tahap 3: Log Aktivitas 3", subtitle: "Catatan perkembangan proyek", instruction: "Tuliskan perkembangan proyek.", allowFileUpload: false },
          { stageNo: 4, title: "Tahap 4: Log Aktivitas 4", subtitle: "Finalisasi pelaksanaan", instruction: "Tuliskan finalisasi pelaksanaan proyek.", allowFileUpload: false },
        ],
      },
      {
        syntaxNo: 5,
        title: "Sintaks 5: Evaluasi & Refleksi",
        description: "Melakukan evaluasi dan refleksi proyek",
        stages: [
          { stageNo: 1, title: "Tahap 1: Evaluasi Hasil", subtitle: "Evaluasi hasil proyek", instruction: "Tuliskan evaluasi hasil proyek.", allowFileUpload: false },
          { stageNo: 2, title: "Tahap 2: Revisi Proyek", subtitle: "Melakukan revisi bila perlu", instruction: "Tuliskan revisi yang dilakukan.", allowFileUpload: false },
          { stageNo: 3, title: "Tahap 3: Refleksi Pembelajaran", subtitle: "Refleksi proses belajar", instruction: "Tuliskan refleksi pembelajaran.", allowFileUpload: false },
        ],
      },
    ];

    for (const syntax of defaultSyntaxes) {
      const syntaxResult = await client.query(
        `
        INSERT INTO project_syntaxes (project_id, syntax_no, title, description, is_locked)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [project.id, syntax.syntaxNo, syntax.title, syntax.description, syntax.syntaxNo === 1 ? false : true]
      );

      const syntaxId = syntaxResult.rows[0].id;

      for (const stage of syntax.stages) {
        await client.query(
          `
          INSERT INTO project_stages (syntax_id, stage_no, title, subtitle, instruction, allow_file_upload)
          VALUES ($1, $2, $3, $4, $5, $6)
          `,
          [syntaxId, stage.stageNo, stage.title, stage.subtitle, stage.instruction, stage.allowFileUpload]
        );
      }
    }

    const kelasResult = await client.query(`SELECT nama FROM kelas WHERE id = $1`, [project.classId]);

    await client.query("COMMIT");

    res.status(201).json({
      ...project,
      class: kelasResult.rows[0]?.nama || "-",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("CREATE PROJECT ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.get("/api/student/projects", authenticateToken, authorizeRole(["siswa"]), async (req, res) => {
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
        p.id,
        p.title,
        p.class_id AS "classId",
        k.nama AS class,
        p.type,
        TO_CHAR(p.deadline, 'DD Mon YYYY') AS deadline,
        p.description,
        p.members_per_group AS "membersPerGroup",
        p.status,
        p.created_at AS "createdAt"
      FROM projects p
      JOIN kelas k ON k.id = p.class_id
      WHERE k.nama = $1
      ORDER BY p.created_at DESC
      `,
      [siswa.kelas]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET STUDENT PROJECTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

//Ambil group + member untuk 1 project
app.get("/api/student/projects/:projectId/group", authenticateToken, authorizeRole(["siswa"]), async (req, res) => {
  try {
    const { projectId } = req.params;

    const groupResult = await pool.query(
      `
      SELECT
        pg.id,
        pg.project_id AS "projectId",
        pg.group_name AS "groupName",
        pg.created_by AS "createdBy",
        pg.created_at AS "createdAt"
      FROM project_groups pg
      JOIN project_group_members pgm ON pgm.group_id = pg.id
      WHERE pg.project_id = $1
        AND pgm.student_id = $2
      LIMIT 1
      `,
      [projectId, req.user.id]
    );

    if (groupResult.rows.length === 0) {
      return res.json({
        group: null,
        members: [],
      });
    }

    const group = groupResult.rows[0];

    const membersResult = await pool.query(
      `
      SELECT
        pgm.id,
        u.id AS "studentId",
        u.nama AS name,
        u.nis AS absen,
        pgm.role AS status,
        pgm.member_role AS role
      FROM project_group_members pgm
      JOIN users u ON u.id = pgm.student_id
      WHERE pgm.group_id = $1
      ORDER BY pgm.id ASC
      `,
      [group.id]
    );

    const members = membersResult.rows.map((member, index) => ({
      no: index + 1,
      ...member,
    }));

    res.json({
      group,
      members,
    });
  } catch (err) {
    console.error("GET PROJECT GROUP ERROR FULL:", err);
    res.status(500).json({
      message: "GET PROJECT GROUP ERROR",
      error: err.message,
    });
  }
});

//Tambah anggota kelompok
app.post("/api/student/projects/:projectId/group/members", authenticateToken, authorizeRole(["siswa"]), async (req, res) => {
  const client = await pool.connect();

  try {
    const { projectId } = req.params;
    const { studentId, status, role } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "Student wajib dipilih" });
    }

    await client.query("BEGIN");

    const siswaResult = await client.query(
      `
      SELECT id, nama, kelas
      FROM users
      WHERE id = $1 AND role = 'siswa'
      `,
      [req.user.id]
    );

    if (siswaResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Siswa login tidak ditemukan" });
    }

    const siswaLogin = siswaResult.rows[0];

    const projectResult = await client.query(
      `
      SELECT
        p.id,
        p.type,
        p.members_per_group AS "membersPerGroup",
        k.nama AS class
      FROM projects p
      JOIN kelas k ON k.id = p.class_id
      WHERE p.id = $1
      `,
      [projectId]
    );

    if (projectResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Project tidak ditemukan" });
    }

    const project = projectResult.rows[0];

    if (project.type !== "group") {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Project ini bukan project kelompok" });
    }

    if (project.class !== siswaLogin.kelas) {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "Project ini bukan untuk kelas kamu" });
    }

    const selectedStudentResult = await client.query(
      `
      SELECT id, nama, nis, kelas
      FROM users
      WHERE id = $1 AND role = 'siswa'
      `,
      [studentId]
    );

    if (selectedStudentResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Siswa yang dipilih tidak ditemukan" });
    }

    const selectedStudent = selectedStudentResult.rows[0];

    if (selectedStudent.kelas !== siswaLogin.kelas) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Siswa yang dipilih bukan dari kelas yang sama" });
    }

    let groupResult = await client.query(
      `
      SELECT id
      FROM project_groups
      WHERE project_id = $1 AND created_by = $2
      LIMIT 1
      `,
      [projectId, req.user.id]
    );

    let groupId;
    let isNewGroup = false;

    if (groupResult.rows.length === 0) {
      const createGroupResult = await client.query(
        `
        INSERT INTO project_groups (project_id, created_by, group_name)
        VALUES ($1, $2, $3)
        RETURNING id
        `,
        [projectId, req.user.id, "Kelompok Saya"]
      );

      groupId = createGroupResult.rows[0].id;
      isNewGroup = true;
    } else {
      groupId = groupResult.rows[0].id;
    }

    if (isNewGroup) {
      await client.query(
        `
        INSERT INTO project_group_members (group_id, student_id, role, member_role)
        VALUES ($1, $2, 'Ketua', 'Project Leader')
        `,
        [groupId, req.user.id]
      );
    }

    const countResult = await client.query(
      `
      SELECT COUNT(*)::int AS total
      FROM project_group_members
      WHERE group_id = $1
      `,
      [groupId]
    );

    const totalMembers = countResult.rows[0].total;

    if (project.membersPerGroup && totalMembers >= project.membersPerGroup) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: `Maksimal anggota kelompok ${project.membersPerGroup} orang`,
      });
    }

    const ketuaResult = await client.query(
      `
      SELECT COUNT(*)::int AS total
      FROM project_group_members
      WHERE group_id = $1 AND role = 'Ketua'
      `,
      [groupId]
    );

    const totalKetua = ketuaResult.rows[0].total;

    if (status === "Ketua" && totalKetua > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Ketua kelompok sudah ada" });
    }

    const duplicateResult = await client.query(
      `
      SELECT id
      FROM project_group_members
      WHERE group_id = $1 AND student_id = $2
      `,
      [groupId, studentId]
    );

    if (duplicateResult.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Siswa sudah ada di kelompok" });
    }

    const insertResult = await client.query(
      `
      INSERT INTO project_group_members (group_id, student_id, role, member_role)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [groupId, studentId, status || "Anggota", role || null]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Anggota berhasil ditambahkan",
      memberId: insertResult.rows[0].id,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("ADD MEMBER ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.delete("/api/student/group-members/:memberId", authenticateToken, authorizeRole(["siswa"]), async (req, res) => {
  try {
    const { memberId } = req.params;

    const result = await pool.query(
      `
      DELETE FROM project_group_members
      WHERE id = $1
      RETURNING id
      `,
      [memberId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Anggota tidak ditemukan" });
    }

    res.json({ message: "Anggota berhasil dihapus" });
  } catch (err) {
    console.error("DELETE MEMBER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

//endpoint ambil siswa sekelas untuk project
app.get("/api/student/projects/:projectId/classmates", authenticateToken, authorizeRole(["siswa"]), async (req, res) => {
  try {
    const { projectId } = req.params;

    const siswaResult = await pool.query(
      `
      SELECT id, nama, kelas
      FROM users
      WHERE id = $1 AND role = 'siswa'
      `,
      [req.user.id]
    );

    if (siswaResult.rows.length === 0) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    const siswa = siswaResult.rows[0];

    const projectResult = await pool.query(
      `
      SELECT
        p.id,
        p.class_id AS "classId",
        p.type,
        p.members_per_group AS "membersPerGroup",
        k.nama AS class
      FROM projects p
      JOIN kelas k ON k.id = p.class_id
      WHERE p.id = $1
      `,
      [projectId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: "Project tidak ditemukan" });
    }

    const project = projectResult.rows[0];

    if (project.class !== siswa.kelas) {
      return res.status(403).json({ message: "Project ini bukan untuk kelas kamu" });
    }

    const classmatesResult = await pool.query(
      `
      SELECT
        id,
        nama,
        nis
      FROM users
      WHERE role = 'siswa'
        AND kelas = $1
      ORDER BY nama ASC
      `,
      [siswa.kelas]
    );

    res.json(classmatesResult.rows);
  } catch (err) {
    console.error("GET CLASSMATES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

//fitur edit peran aktif
app.put("/api/student/group-members/:memberId", authenticateToken, authorizeRole(["siswa"]), async (req, res) => {
  try {
    const { memberId } = req.params;
    const { status, role } = req.body;

    const result = await pool.query(
      `
      UPDATE project_group_members
      SET role = $1,
          member_role = $2
      WHERE id = $3
      RETURNING id
      `,
      [status, role, memberId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Anggota tidak ditemukan" });
    }

    res.json({ message: "Anggota berhasil diupdate" });
  } catch (err) {
    console.error("UPDATE MEMBER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= PROJECT DETAIL ================= */
app.get("/api/student/projects/:projectId/detail", authenticateToken, authorizeRole(["siswa"]), async (req, res) => {
  try {
    const { projectId } = req.params;

    const siswaResult = await pool.query(
      `
      SELECT id, nama, kelas
      FROM users
      WHERE id = $1 AND role = 'siswa'
      `,
      [req.user.id]
    );

    if (siswaResult.rows.length === 0) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    const siswa = siswaResult.rows[0];

    const projectResult = await pool.query(
      `
      SELECT
        p.id,
        p.title,
        p.description,
        p.status,
        k.nama AS class
      FROM projects p
      JOIN kelas k ON k.id = p.class_id
      WHERE p.id = $1
      `,
      [projectId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: "Project tidak ditemukan" });
    }

    const project = projectResult.rows[0];

    if (project.class !== siswa.kelas) {
      return res.status(403).json({ message: "Project ini bukan untuk kelas kamu" });
    }

    const groupResult = await pool.query(
      `
      SELECT
        pg.id,
        pg.group_name AS "groupName"
      FROM project_groups pg
      JOIN project_group_members pgm ON pgm.group_id = pg.id
      WHERE pg.project_id = $1
        AND pgm.student_id = $2
      LIMIT 1
      `,
      [projectId, req.user.id]
    );

    if (groupResult.rows.length === 0) {
      return res.json({
        project,
        group: null,
        teamMembers: [],
        overallProgress: { completed: 0, total: 0, percentage: 0 },
        syntaxes: [],
      });
    }

    const group = groupResult.rows[0];

    const membersResult = await pool.query(
      `
      SELECT
        u.id,
        u.nama AS name,
        pgm.member_role AS role
      FROM project_group_members pgm
      JOIN users u ON u.id = pgm.student_id
      WHERE pgm.group_id = $1
      ORDER BY u.nama ASC
      `,
      [group.id]
    );

    const syntaxesResult = await pool.query(
      `
      SELECT
        ps.id,
        ps.syntax_no AS "syntaxNo",
        ps.title,
        ps.description,
        ps.is_locked AS "isLocked"
      FROM project_syntaxes ps
      WHERE ps.project_id = $1
      ORDER BY ps.syntax_no ASC
      `,
      [projectId]
    );

    const stagesResult = await pool.query(
      `
      SELECT
        pst.id,
        pst.syntax_id AS "syntaxId",
        pst.stage_no AS "stageNo",
        pst.title,
        pst.subtitle,
        pst.instruction,
        pst.allow_file_upload AS "allowFileUpload",
        sub.id AS "submissionId",
        sub.answer,
        sub.status,
        fb.feedback_text AS "feedbackText"
      FROM project_stages pst
      LEFT JOIN project_stage_submissions sub
        ON sub.stage_id = pst.id
       AND sub.group_id = $1
      LEFT JOIN project_stage_feedback fb
        ON fb.submission_id = sub.id
      WHERE pst.syntax_id IN (
        SELECT id FROM project_syntaxes WHERE project_id = $2
      )
      ORDER BY pst.syntax_id ASC, pst.stage_no ASC
      `,
      [group.id, projectId]
    );

    const filesResult = await pool.query(
      `
      SELECT
        psf.id,
        psf.submission_id AS "submissionId",
        psf.file_name AS "fileName",
        psf.file_url AS "fileUrl",
        psf.file_size AS "fileSize"
      FROM project_stage_files psf
      WHERE psf.submission_id IN (
        SELECT id
        FROM project_stage_submissions
        WHERE group_id = $1
      )
      `,
      [group.id]
    );

    const rawSyntaxes = syntaxesResult.rows.map((syntax) => {
      const syntaxStages = stagesResult.rows
        .filter((stage) => stage.syntaxId === syntax.id)
        .map((stage) => ({
          id: stage.id,
          stageNo: stage.stageNo,
          title: stage.title,
          subtitle: stage.subtitle,
          instruction: stage.instruction,
          allowFileUpload: stage.allowFileUpload,
          submissionId: stage.submissionId,
          answer: stage.answer || "",
          status: stage.status || "belum_mengerjakan",
          feedbackText: stage.feedbackText || null,
          files: filesResult.rows.filter((file) => file.submissionId === stage.submissionId),
        }));

      const progressCount = syntaxStages.filter((stage) => stage.status === "belum_selesai" || stage.status === "selesai").length;

      const allFilled = syntaxStages.length > 0 && syntaxStages.every((stage) => stage.status === "belum_selesai" || stage.status === "selesai");

      const allValidated = syntaxStages.length > 0 && syntaxStages.every((stage) => stage.status === "selesai");

      return {
        id: syntax.id,
        syntaxNo: syntax.syntaxNo,
        title: syntax.title,
        subtitle: syntax.title,
        description: syntax.description,
        isLocked: syntax.isLocked,
        progress: {
          completed: progressCount,
          total: syntaxStages.length,
        },
        allFilled,
        allValidated,
        stages: syntaxStages,
      };
    });

    const syntaxes = rawSyntaxes.map((syntax, index) => {
      const prevSyntax = rawSyntaxes[index - 1];
      const unlocked = index === 0 ? true : prevSyntax?.allFilled === true;

      let status = "belum_selesai";

      if (!unlocked) {
        status = "terkunci";
      } else if (syntax.allFilled) {
        status = "selesai";
      } else {
        status = "belum_selesai";
      }

      return {
        id: syntax.id,
        syntaxNo: syntax.syntaxNo,
        title: syntax.title,
        subtitle: syntax.subtitle,
        description: syntax.description,
        unlocked,
        status,
        progress: syntax.progress,
        stages: syntax.stages,
      };
    });

    const totalStages = syntaxes.flatMap((s) => s.stages).length;

    const completedStages = syntaxes.flatMap((s) => s.stages).filter((stage) => stage.status === "belum_selesai" || stage.status === "selesai").length;

    res.json({
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        groupName: group.groupName,
      },
      teamMembers: membersResult.rows.map((m) => ({
        ...m,
        initials: m.name
          .split(" ")
          .map((x) => x[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      })),
      overallProgress: {
        completed: completedStages,
        total: totalStages,
        percentage: totalStages === 0 ? 0 : Math.round((completedStages / totalStages) * 100),
      },
      syntaxes,
    });
  } catch (err) {
    console.error("GET PROJECT DETAIL ERROR FULL:", err);
    console.error("MESSAGE:", err.message);
    console.error("STACK:", err.stack);
    res.status(500).json({ error: err.message });
  }
});

//save jawaban siswa
app.put("/api/student/stages/:stageId/submission", authenticateToken, authorizeRole(["siswa"]), async (req, res) => {
  const client = await pool.connect();

  try {
    const { stageId } = req.params;
    const { projectId, answer, status } = req.body;

    await client.query("BEGIN");

    const groupResult = await client.query(
      `
      SELECT pg.id
      FROM project_groups pg
      JOIN project_group_members pgm ON pgm.group_id = pg.id
      WHERE pg.project_id = $1
        AND pgm.student_id = $2
      LIMIT 1
      `,
      [projectId, req.user.id]
    );

    if (groupResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Kelompok project tidak ditemukan" });
    }

    const groupId = groupResult.rows[0].id;

    const stageInfoResult = await client.query(
      `
      SELECT
        pst.id AS "stageId",
        pst.syntax_id AS "syntaxId",
        ps.project_id AS "projectId",
        ps.syntax_no AS "syntaxNo"
      FROM project_stages pst
      JOIN project_syntaxes ps ON ps.id = pst.syntax_id
      WHERE pst.id = $1
        AND ps.project_id = $2
      LIMIT 1
      `,
      [stageId, projectId]
    );

    if (stageInfoResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Tahap tidak ditemukan" });
    }

    const currentStage = stageInfoResult.rows[0];
    const currentSyntaxNo = Number(currentStage.syntaxNo);

    // syntax 1 selalu boleh
    if (currentSyntaxNo > 1) {
      const prevSyntaxResult = await client.query(
        `
        SELECT id
        FROM project_syntaxes
        WHERE project_id = $1
          AND syntax_no = $2
        LIMIT 1
        `,
        [projectId, currentSyntaxNo - 1]
      );

      if (prevSyntaxResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Sintaks sebelumnya tidak ditemukan" });
      }

      const prevSyntaxId = prevSyntaxResult.rows[0].id;

      const prevStagesResult = await client.query(
        `
        SELECT
          pst.id,
          COALESCE(pss.status, 'belum_mengerjakan') AS status
        FROM project_stages pst
        LEFT JOIN project_stage_submissions pss
          ON pss.stage_id = pst.id
         AND pss.group_id = $1
        WHERE pst.syntax_id = $2
        ORDER BY pst.stage_no ASC
        `,
        [groupId, prevSyntaxId]
      );

      const prevSyntaxFilled = prevStagesResult.rows.length > 0 && prevStagesResult.rows.every((row) => row.status === "belum_selesai" || row.status === "selesai");

      if (!prevSyntaxFilled) {
        await client.query("ROLLBACK");
        return res.status(403).json({
          message: "Sintaks ini masih terkunci. Selesaikan sintaks sebelumnya dulu.",
        });
      }
    }

    const finalStatus = answer && answer.trim() ? "belum_selesai" : "belum_mengerjakan";

    const result = await client.query(
      `
      INSERT INTO project_stage_submissions (stage_id, group_id, answer, status, submitted_at, updated_at)
      VALUES ($1,$2,$3,$4,NOW(),NOW())
      ON CONFLICT (stage_id, group_id)
      DO UPDATE SET
        answer = EXCLUDED.answer,
        status = EXCLUDED.status,
        updated_at = NOW()
      RETURNING *
      `,
      [stageId, groupId, answer || "", status || finalStatus]
    );

    await client.query("COMMIT");
    res.json(result.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("SAVE SUBMISSION ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

//upload file tahap
app.post("/api/student/stages/:stageId/files", authenticateToken, authorizeRole(["siswa"]), upload.single("file"), async (req, res) => {
  const client = await pool.connect();

  try {
    const { stageId } = req.params;
    const { projectId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File wajib diupload" });
    }

    await client.query("BEGIN");

    const groupResult = await client.query(
      `
      SELECT pg.id
      FROM project_groups pg
      JOIN project_group_members pgm ON pgm.group_id = pg.id
      WHERE pg.project_id = $1
        AND pgm.student_id = $2
      LIMIT 1
      `,
      [projectId, req.user.id]
    );

    if (groupResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Kelompok tidak ditemukan" });
    }

    const groupId = groupResult.rows[0].id;

    const stageCheck = await client.query(
      `
      SELECT
        pst.id,
        pst.syntax_id AS "syntaxId",
        ps.project_id AS "projectId",
        ps.syntax_no AS "syntaxNo",
        ps.is_locked AS "isLocked"
      FROM project_stages pst
      JOIN project_syntaxes ps ON ps.id = pst.syntax_id
      WHERE pst.id = $1
      `,
      [stageId]
    );

    if (stageCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Stage tidak ditemukan" });
    }

    const currentStage = stageCheck.rows[0];

    if (Number(currentStage.projectId) !== Number(projectId)) {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "Stage tidak sesuai project" });
    }

    if (currentStage.isLocked) {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "Sintaks ini masih terkunci" });
    }

    let submissionResult = await client.query(
      `
      SELECT id
      FROM project_stage_submissions
      WHERE stage_id = $1 AND group_id = $2
      `,
      [stageId, groupId]
    );

    let submissionId;

    if (submissionResult.rows.length === 0) {
      const insertSubmission = await client.query(
        `
        INSERT INTO project_stage_submissions (stage_id, group_id, answer, status, submitted_at, updated_at)
        VALUES ($1,$2,'','belum_selesai',NOW(),NOW())
        RETURNING id
        `,
        [stageId, groupId]
      );
      submissionId = insertSubmission.rows[0].id;
    } else {
      submissionId = submissionResult.rows[0].id;

      await client.query(
        `
        UPDATE project_stage_submissions
        SET status = 'belum_selesai',
            updated_at = NOW()
        WHERE id = $1
        `,
        [submissionId]
      );
    }

    const fileResult = await client.query(
      `
      INSERT INTO project_stage_files (submission_id, file_name, file_url, file_size, uploaded_by)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [submissionId, req.file.originalname, req.file.filename, req.file.size, req.user.id]
    );

    // cek apakah syntax ini sudah penuh terisi
    const syntaxProgress = await client.query(
      `
      SELECT
        COUNT(pst.id)::int AS total_stages,
        COUNT(CASE WHEN pss.status IN ('belum_selesai', 'selesai') THEN 1 END)::int AS filled_stages
      FROM project_stages pst
      LEFT JOIN project_stage_submissions pss
        ON pss.stage_id = pst.id
       AND pss.group_id = $1
      WHERE pst.syntax_id = $2
      `,
      [groupId, currentStage.syntaxId]
    );

    const totalStages = syntaxProgress.rows[0].total_stages;
    const filledStages = syntaxProgress.rows[0].filled_stages;

    if (totalStages > 0 && filledStages === totalStages) {
      await client.query(
        `
        UPDATE project_syntaxes
        SET is_locked = false
        WHERE project_id = $1
          AND syntax_no = $2
        `,
        [projectId, currentStage.syntaxNo + 1]
      );
    }

    await client.query("COMMIT");
    res.status(201).json(fileResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("UPLOAD STAGE FILE ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

//feedback guru
app.put("/api/guru/submissions/:submissionId/feedback", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { feedbackText } = req.body;

    const result = await pool.query(
      `
      INSERT INTO project_stage_feedback (submission_id, teacher_id, feedback_text, created_at, updated_at)
      VALUES ($1,$2,$3,NOW(),NOW())
      ON CONFLICT (submission_id)
      DO UPDATE SET
        feedback_text = EXCLUDED.feedback_text,
        teacher_id = EXCLUDED.teacher_id,
        updated_at = NOW()
      RETURNING *
      `,
      [submissionId, req.user.id, feedbackText]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("SAVE FEEDBACK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/student/stage-files/:fileId", authenticateToken, authorizeRole(["siswa"]), async (req, res) => {
  const client = await pool.connect();

  try {
    const { fileId } = req.params;

    await client.query("BEGIN");

    const fileCheck = await client.query(
      `
      SELECT
        psf.id,
        psf.file_url AS "fileUrl",
        pss.group_id AS "groupId"
      FROM project_stage_files psf
      JOIN project_stage_submissions pss ON pss.id = psf.submission_id
      JOIN project_group_members pgm ON pgm.group_id = pss.group_id
      WHERE psf.id = $1
        AND pgm.student_id = $2
      LIMIT 1
      `,
      [fileId, req.user.id]
    );

    if (fileCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "File tidak ditemukan atau tidak bisa dihapus" });
    }

    const file = fileCheck.rows[0];

    await client.query(
      `
      DELETE FROM project_stage_files
      WHERE id = $1
      `,
      [fileId]
    );

    const filePath = path.join(process.cwd(), "uploads", file.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await client.query("COMMIT");

    res.json({ message: "File berhasil dihapus" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("DELETE STAGE FILE ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

/* ================= MONITORING GURU ================= */
app.get("/api/guru/projects/:projectId/monitoring", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const { projectId } = req.params;

    // pastikan project milik guru login
    const projectResult = await pool.query(
      `
      SELECT
        p.id,
        p.title,
        p.description,
        p.status,
        p.class_id AS "classId",
        k.nama AS class
      FROM projects p
      JOIN kelas k ON k.id = p.class_id
      WHERE p.id = $1
        AND p.created_by = $2
      `,
      [projectId, req.user.id]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: "Project tidak ditemukan atau bukan milik guru ini" });
    }

    const project = projectResult.rows[0];

    const groupsResult = await pool.query(
      `
      SELECT
        pg.id,
        pg.group_name AS "groupName",
        pg.created_by AS "createdBy",
        pg.created_at AS "createdAt"
      FROM project_groups pg
      WHERE pg.project_id = $1
      ORDER BY pg.id ASC
      `,
      [projectId]
    );

    const submissionsResult = await pool.query(
      `
      SELECT
        pss.id,
        pss.stage_id AS "stageId",
        pss.group_id AS "groupId",
        pss.answer,
        pss.status,
        pss.submitted_at AS "submittedAt",
        pss.updated_at AS "updatedAt",
        psf.feedback_text AS "feedbackText",
        psf.teacher_id AS "teacherId"
      FROM project_stage_submissions pss
      LEFT JOIN project_stage_feedback psf
        ON psf.submission_id = pss.id
      WHERE pss.group_id IN (
        SELECT id FROM project_groups WHERE project_id = $1
      )
      `,
      [projectId]
    );

    const membersResult = await pool.query(
      `
      SELECT
        pgm.group_id AS "groupId",
        u.id,
        u.nama AS name,
        u.nis,
        pgm.role AS status,
        pgm.member_role AS role
      FROM project_group_members pgm
      JOIN users u ON u.id = pgm.student_id
      WHERE pgm.group_id IN (
        SELECT id FROM project_groups WHERE project_id = $1
      )
      ORDER BY pgm.group_id ASC, u.nama ASC
      `,
      [projectId]
    );

    const groups = groupsResult.rows.map((group) => {
      const groupMembers = membersResult.rows
        .filter((member) => member.groupId === group.id)
        .map((member) => ({
          id: member.id,
          name: member.name,
          nis: member.nis,
          status: member.status,
          role: member.role,
          initials: member.name
            .split(" ")
            .map((x) => x[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        }));

      const syntaxes = syntaxesResult.rows.map((syntax) => {
        const syntaxStages = stagesResult.rows
          .filter((stage) => stage.syntaxId === syntax.id)
          .map((stage) => {
            const submission = submissionsResult.rows.find((sub) => sub.groupId === group.id && sub.stageId === stage.id);

            const files = submission ? filesResult.rows.filter((file) => file.submissionId === submission.id) : [];

            return {
              id: stage.id,
              stageNo: stage.stageNo,
              title: stage.title,
              subtitle: stage.subtitle,
              instruction: stage.instruction,
              allowFileUpload: stage.allowFileUpload,
              submissionId: submission?.id || null,
              answer: submission?.answer || "",
              status: submission?.status || "belum_mengerjakan",
              submittedAt: submission?.submittedAt || null,
              updatedAt: submission?.updatedAt || null,
              feedbackText: submission?.feedbackText || null,
              teacherId: submission?.teacherId || null,
              files,
            };
          });

        const completed = syntaxStages.filter((stage) => stage.status === "selesai").length;

        return {
          id: syntax.id,
          syntaxNo: syntax.syntaxNo,
          title: syntax.title,
          subtitle: syntax.title,
          description: syntax.description,
          unlocked: !syntax.isLocked,
          status: completed === syntaxStages.length && syntaxStages.length > 0 ? "selesai" : syntax.isLocked ? "terkunci" : "belum_selesai",
          progress: {
            completed,
            total: syntaxStages.length,
          },
          stages: syntaxStages,
        };
      });

      const allStages = syntaxes.flatMap((syntax) => syntax.stages);
      const completedStages = allStages.filter((stage) => stage.status === "selesai").length;

      return {
        id: group.id,
        groupName: group.groupName,
        createdBy: group.createdBy,
        createdAt: group.createdAt,
        members: groupMembers,
        overallProgress: {
          completed: completedStages,
          total: allStages.length,
          percentage: allStages.length === 0 ? 0 : Math.round((completedStages / allStages.length) * 100),
        },
        syntaxes,
      };
    });

    res.json({
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        classId: project.classId,
        class: project.class,
      },
      groups,
    });
  } catch (err) {
    console.error("GET PROJECT MONITORING ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/guru/submissions/:submissionId/status", authenticateToken, authorizeRole(["guru"]), async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status } = req.body;

    if (!["belum_mengerjakan", "belum_selesai", "selesai"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const checkResult = await pool.query(
      `
      SELECT
        pss.id,
        pst.id AS "stageId",
        ps.project_id AS "projectId",
        p.created_by AS "teacherId"
      FROM project_stage_submissions pss
      JOIN project_stages pst ON pst.id = pss.stage_id
      JOIN project_syntaxes ps ON ps.id = pst.syntax_id
      JOIN projects p ON p.id = ps.project_id
      WHERE pss.id = $1
        AND p.created_by = $2
      `,
      [submissionId, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Submission tidak ditemukan atau bukan milik guru ini" });
    }

    const result = await pool.query(
      `
      UPDATE project_stage_submissions
      SET status = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [status, submissionId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE SUBMISSION STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/test", (req, res) => {
  res.json({ message: "API hidup" });
});

export default app;
