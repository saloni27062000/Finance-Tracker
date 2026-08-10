const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server is running");
  console.log("at http://localhost:" + PORT);
});
