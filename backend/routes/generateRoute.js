import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { generateNotes } from "../controllers/genrateController.js";
import { getNotes, getSingleNote } from "../controllers/notes.controllers.js";


const notesRouter = express.Router();

notesRouter.post("/generate-notes",isAuth,generateNotes);
notesRouter.get("/getnotes",isAuth,getNotes);
notesRouter.get("/:id",isAuth,getSingleNote);




export default notesRouter;
