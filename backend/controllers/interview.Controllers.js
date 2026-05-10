import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.services.js";
import UserModel from "../models/User.Models.js";
import Interview from "../models/interview.models.js";

const parseAiJson = (raw) => {
  if (!raw || typeof raw !== "string") {
    throw new Error("AI response is empty");
  }

  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("AI returned invalid JSON");
    }

    return JSON.parse(cleaned.slice(start, end + 1));
  }
};

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }

    const isPdf =
      req.file.mimetype === "application/pdf" ||
      req.file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Only PDF resume is supported" });
    }

    const filePath = req.file.path;

    const fileBuffer = await fs.promises.readFile(filePath);
    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let resumeText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();

      const pageText = content.items.map((item) => item.str).join(" ");

      resumeText += pageText + "\n";
    }

    resumeText = resumeText.replace(/\s+/g, " ").trim();

    const messages = [
      {
        role: "system",
        content: `
Extract structured data from the resume.

Return strictly JSON:

{
 "role":"string",
 "experience":"string",
 "projects":["project1","project2"],
 "skills":["skill1","skill2"]
}
`,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    const aiResponse = await askAi(messages);

    const parsed = parseAiJson(aiResponse);

    fs.unlinkSync(filePath);

    res.json({
      role: parsed.role || "",
      experience: parsed.experience || "",
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      text: resumeText,
      resumeText,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Resume Analysis Error:", error);

    res.status(500).json({
      message: "Resume analysis failed",
      error: error.message,
    });
  }
};

export const generateQuestion = async (req, res) => {
  try {
    const { role, experience, mode, resumeText, projects, skills } = req.body;
    const normalizedRole = role?.trim();
    const normalizedExperience = experience?.trim();
    const normalizedMode = mode?.trim();

    if (!normalizedRole || !normalizedExperience || !normalizedMode) {
      return res.status(400).json({
        message: "Role , Experience and Mode are required.",
      });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enough credits. Minimum 50 required.",
      });
    }

    const projectText = Array.isArray(projects) && projects.length ? projects.join(", ") : "None";
    const skillsText = Array.isArray(skills) && skills.length ? skills.join(", ") : "None";
    const safeResume = resumeText?.trim() || "None";


   const userPrompt = `
   
   Role : ${normalizedRole}
   Experience : ${normalizedExperience}
   InterviewMode:${normalizedMode}
   Projects:${projectText}
   Skills:${skillsText}
   Resume:${safeResume}
   `;
   if(!userPrompt){
    return res.status(400).json({
      message:"Prompt content is empty."
    })
   }
   
const messages = [

      {
        role: "system",
        content: `
You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 → easy  
Question 2 → easy  
Question 3 → medium  
Question 4 → medium  
Question 5 → hard  

Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details.
`
      }
      ,
      {
        role: "user",
        content: userPrompt
      }
    ];

    const aiResponse = await askAi(messages);
    if(!aiResponse || !aiResponse.trim()){
      return res.status(500).json({message :"AI returned empty response"});
    }

    const questionArray = aiResponse
      .split("\n")
      .map((q) => q.replace(/^\d+[.)-]?\s*/, "").trim())
      .filter((q) => q.length > 0)
      .slice(0,5);

    if (questionArray.length === 0) {
      return res.status(500).json({
        message:"AI failed to generate questions."
      });
    }

    const interview = await Interview.create({
      userId,
      role: normalizedRole,
      experience: normalizedExperience,
      mode: normalizedMode,
      resumeText: safeResume === "None" ? "" : safeResume,
      questions: questionArray.map((question, index) => ({
        question,
        difficulty: index < 2 ? "easy" : index < 4 ? "medium" : "hard",
        timeLimit: [60,60,90,90,120][index],
      })),
    });

    user.credits -= 50;
    await user.save();

    return res.status(201).json({
      message: "Questions generated successfully.",
      interview,
      remainingCredits: user.credits,
    });

  } catch (error) {
    console.error("Generate Question Error:", error);
    return res.status(500).json({
      message: "Failed to generate interview questions",
      error: error.message,
    });
  }
  
};


export const submitAnswer = async (req,res)=>{
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    if (!interviewId || questionIndex === undefined || !answer?.trim()) {
      return res.status(400).json({
        message: "Interview ID, question index and answer are required.",
      });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found.",
      });
    }

    const parsedQuestionIndex = Number(questionIndex);

    if (Number.isNaN(parsedQuestionIndex) || parsedQuestionIndex < 0 || parsedQuestionIndex >= interview.questions.length) {
      return res.status(400).json({
        message: "Invalid question index.",
      });
    }

    const question = interview.questions[parsedQuestionIndex];

    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence – Does the answer sound clear, confident, and well-presented?
2. Communication – Is the language simple, clear, and easy to understand?
3. Correctness – Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}
`,
      },
      {
        role: "user",
        content: `
Question: ${question.question}
Answer: ${answer.trim()}
`,
      },
    ];

    const aiResponse = await askAi(messages);
    const parsed = parseAiJson(aiResponse);

    const clampScore = (value) => {
      const numericValue = Number(value);
      if (Number.isNaN(numericValue)) return 0;
      return Math.max(0, Math.min(10, Math.round(numericValue)));
    };

    question.answer = answer.trim();
    question.feedback = parsed.feedback || "Good attempt. Keep refining your answer with more clarity and structure.";
    question.score = clampScore(parsed.finalScore);
    question.confidence = clampScore(parsed.confidence);
    question.communication = clampScore(parsed.communication);
    question.correctness = clampScore(parsed.correctness);

    const answeredQuestions = interview.questions.filter((item) => item.answer?.trim());
    const totalScore = interview.questions.reduce((sum, item) => sum + (item.score || 0), 0);

    interview.finalScore = interview.questions.length
      ? Math.round(totalScore / interview.questions.length)
      : 0;
    interview.status = answeredQuestions.length === interview.questions.length ? "completed" : "Incompleted";

    await interview.save();

    return res.status(200).json({
      message: "Answer submitted successfully.",
      question: interview.questions[parsedQuestionIndex],
      finalScore: interview.finalScore,
      status: interview.status,
    });
  } catch (error) {
    console.error("Submit Answer Error:", error);
    return res.status(500).json({
      message: "Failed to submit answer",
      error: error.message,
    });
  }
}



export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({ message: "Interview ID is required." });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions
      ? totalScore / totalQuestions
      : 0;

    const avgConfidence = totalQuestions
      ? totalConfidence / totalQuestions
      : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
      })),
    });

  } catch (error) {
    console.error("Finish Interview Error:", error);
    return res.status(500).json({
      message: "Failed to finish interview",
      error: error.message,
    });
  }
}


export const getMyInterviews=async(req,res)=>{
  try {
    const interviews = await Interview.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("role experience mode finalScore status createdAt")

    return res.status(200).json({
      interviews,
    })
  } catch (error) {
    console.error("Get My Interviews Error:", error)
    return res.status(500).json({
      message: "Failed to fetch interviews",
      error: error.message,
    })
  }
}

export const getInterviewReport = async (req, res) => {
  try {
    const { interviewId } = req.params

    if (!interviewId) {
      return res.status(400).json({ message: "Interview ID is required." })
    }

    const interview = await Interview.findById(interviewId)

    if (!interview) {
      return res.status(404).json({ message: "Interview not found." })
    }

    return res.status(200).json(interview)
  } catch (error) {
    console.error("Get Interview Report Error:", error)
    return res.status(500).json({
      message: "Failed to fetch interview report",
      error: error.message,
    })
  }
}