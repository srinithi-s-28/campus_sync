import express from "express"
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
	analyzeResume,
	finishInterview,
	generateQuestion,
	getInterviewReport,
	getMyInterviews,
	submitAnswer,
} from "../controllers/interview.Controllers.js";


const interviewRouter = express.Router();
interviewRouter.post("/resume",isAuth,upload.single("resume"),analyzeResume)
interviewRouter.post("/generate-questions",isAuth,generateQuestion)
interviewRouter.post("/submit-answer",isAuth,submitAnswer)
interviewRouter.post("/finish",isAuth,finishInterview)
interviewRouter.get("/my-interviews",isAuth,getMyInterviews)
interviewRouter.get("/report/:interviewId",isAuth,getInterviewReport)


export default interviewRouter