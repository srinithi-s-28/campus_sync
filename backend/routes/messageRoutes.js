import express from "express";
import { upload } from "../middlewares/multer.js";
import {  sendMessage, getMessage, getConversations, getAllUsers } from "../controllers/messageController.js";
import { isAuth } from "../middlewares/isAuth.js";


const messageRouter = express.Router();

messageRouter.post(
  "/send/:receiver",
  isAuth,
  upload.single("image"),
  sendMessage
);

messageRouter.get(
  "/get/:receiver",
  isAuth,
  getMessage
);

messageRouter.get(
  "/conversations",
  isAuth,
  getConversations
);

messageRouter.get(
  "/allusers",
  isAuth,
  getAllUsers
);

export default messageRouter;