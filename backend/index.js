import app from "./server.js";

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server jalan di http://localhost:${PORT}`);
});
