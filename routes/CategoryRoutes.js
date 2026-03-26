import express from "express";
import {
  GetIndex,
  GetCreate,
  PostCreate,
  Delete,
  GetEdit,
  PostEdit,
  GetDelete,
} from "../controllers/CategoryController.js";

const router = express.Router();

router.get("/index", GetIndex);
router.get("/create", GetCreate);
router.post("/create", PostCreate);
router.post("/delete", Delete);
router.get("/edit/:categoryId", GetEdit);
router.post("/edit", PostEdit);
router.get("/delete/:categoryId", GetDelete);

export default router;