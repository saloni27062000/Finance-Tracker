const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRouter = require("./src/modules/auth/auth.routes");
const userRouter = require("./src/modules/users/users.routes");
const bankRouter = require("./src/modules/bank/bank.routes");
const friendsAndFamilyRouter = require("./src/modules/friendsandfamily/friendsandfamily.routes");
const categoryRouter = require("./src/modules/category/category.routes");
const investmentRouter = require("./src/modules/investment/investment.routes");
const transactionRouter = require("./src/modules/transaction/transaction.routes");
const {
  rateLimiterMiddleware,
} = require("./src/middleware/rateLimiter.middleware");
const { notfoundMiddleware } = require("./src/middleware/notfound.middleware");
const {
  errorHandlerMiddleware,
} = require("./src/middleware/errorHandler.middleware");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiterMiddleware);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/bank", bankRouter);
app.use("/api/friendsandfamily", friendsAndFamilyRouter);
app.use("/api/category", categoryRouter);
app.use("/api/investment", investmentRouter);
app.use("/api/transaction", transactionRouter);

app.get("/health", (req, res, next) => {
  try {
    res.status(200).json({ message: "server is healthy" });
  } catch (error) {
    next(error);
  }
});

app.use(notfoundMiddleware);

app.use(errorHandlerMiddleware);

module.exports = app;
