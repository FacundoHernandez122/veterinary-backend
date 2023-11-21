import express  from "express";
const router = express.Router();
import {register, profile, confirm, authenticate, forgotPassword, confirmToken, newPassword, updateProfile, updatePassword} from "../controllers/vetController.js"
import authMiddleware from "../middleware/authMiddleware.js";


router.post("/", register);
router.get("/confirm/:token", confirm);
router.post("/login", authenticate);
router.post("/forgot-password", forgotPassword);
router.route("/forgot-password/:token").get(confirmToken).post(newPassword);

router.get("/profile", authMiddleware, profile);
router.put("/profile/:id", authMiddleware, updateProfile)
router.put("/change-password", authMiddleware, updatePassword)



export default router;