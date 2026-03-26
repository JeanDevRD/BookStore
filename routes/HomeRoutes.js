import express from "express";
import { GetHome , GetDetail} from "../controllers/HomeController.js"

const router = express.Router();

router.get("/", GetHome)
router.get("/detail/:bookId", GetDetail)

export default router;
