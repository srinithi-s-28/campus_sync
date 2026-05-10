import express from "express";
import { GoogleLogin, GoogleRegister, login, logout, Register, updateTheme } from "../controllers/auth.contollers.js";
import { isAuth } from "../middlewares/isAuth.js";
import { currentUser, updateProfile } from "../controllers/curremtUserController.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/google-register", GoogleRegister);
userRouter.post("/google-login", GoogleLogin);
userRouter.post("/register",Register);
userRouter.post("/login",login);
userRouter.post("/logout",logout)

userRouter.get("/current",isAuth,currentUser)
userRouter.put("/profile", isAuth, upload.single("profileImage"), updateProfile)
userRouter.put("/theme",isAuth,updateTheme)

export default userRouter;
