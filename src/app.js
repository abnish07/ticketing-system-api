const express = require("express");

const db = require("./config/database");
const app = express();
const PORT = 7001;

app.use(express.json());

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http:localhost: ${PORT}`);
});
