import express from "express"
const router = express.Router();
import { addPatient, getPatients, getPatient, updatePatient, deletePatient, searchPatientsByName } from "../controllers/patientController.js";
import authMiddleware from "../middleware/authMiddleware.js"


router.route("/")
.post(authMiddleware, addPatient)
.get(authMiddleware, getPatients)

router.get("/search", searchPatientsByName);

router.route("/:id")
.get(authMiddleware, getPatient)
.put(authMiddleware, updatePatient)
.delete(authMiddleware, deletePatient)

export default router;