import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookie from "cookie-parser";
import api from "./routes/routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookie());
app.use(morgan("combined"));
app.use(express.json());
app.use("/", api);

app.get("/", (req, res) => res.status(200).json({ root: "Absolutely" }));

export default app;
