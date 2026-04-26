import express from "express";
import router from "./Router/route.js";

const app = express();
const PORT = process.env.PORT || 8000;
app.set("trust proxy", 1); //cho express Server biết ứng đụng đang nằm sau 1 lớp proxy-> bỏ qua IP proxy này
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/", router);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
