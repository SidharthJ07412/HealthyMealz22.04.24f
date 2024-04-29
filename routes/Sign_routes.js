import express from "express";
import { createUser, logInUser, sendOTP,verifyOTP } from "../controllers/Sign_controller.js";

const router = express.Router();

router.post("/signUp", createUser);
router.post("/login", logInUser);
router.post("/send-otp",sendOTP);
router.post("/verify-otp",verifyOTP);

export default router;
