const dotenv = require("dotenv");
dotenv.config("./"); // 🔥 FIRST

const app = require("./app");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`API and Webpage live at http://localhost:${PORT}`);
});