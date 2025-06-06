import express from 'express';
import { getProfile, updateProfile } from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import upload from '../middleware/multer.js';
import { updateProfilePhoto } from '../controllers/userController.js';

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/upload-photo", auth, upload.single("photo"), updateProfilePhoto);

export default router;