import express from "express";
import router from "./Router/url.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
