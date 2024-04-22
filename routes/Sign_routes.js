import express from "express";
import { createUser, logInUser } from "../controllers/Sign_controller.js";

const router = express.Router();

router.post("/signUp", createUser);
router.post("/login", logInUser);

export default router;
