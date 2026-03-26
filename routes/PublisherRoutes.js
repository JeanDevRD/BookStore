import express from "express";
import {
  GetIndex,
  GetCreate,
  PostCreate,
  Delete,
  GetDelete,
  GetEdit,
  PostEdit,
} from "../controllers/PublisherController.js";

const router = express.Router();

router.get("/index", GetIndex);
router.get("/create", GetCreate);
router.post("/create", PostCreate);
router.post("/delete", Delete);
router.get("/delete/:publisherId", GetDelete);
router.get("/edit/:publisherId", GetEdit);
router.post("/edit", PostEdit);

export default router;