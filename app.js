const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const db = require("./models");

const app = express();
app.use([express.json(), cors()]);

const signIn = require("./routes/signIn");
const signUp = require("./routes/signUp");
const inputExpense = require("./routes/inputExpense");

app.get("/", (req, res) => {
  res.send("Finance Tracking");
});

app.use("/signIn", signIn);
app.use("/signUp", signUp);
app.use("/inputExpense", inputExpense);

const expense_db = `${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`;

db.mongoose
  .connect(expense_db, {})
  .then(() => {
    console.log("Successfully connect to MongoDB");
  })
  .catch((error) => {
    console.error(("Connection error", error));
    process.exit();
  });

app.listen(process.env.BACKEND_APP_PORT, () => {
  console.log(
    `Server running at: http://${process.env.BACKEND_APP_HOST}:${process.env.BACKEND_APP_PORT}`
  );
});
