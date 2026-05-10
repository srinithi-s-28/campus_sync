import { buildPrompt } from "../config/promptBuilder.js";
import Note from "../models/Notes.Models.js";
import UserModel from "../models/User.Models.js";
import { generateGeminiResponse } from "../services/gemini.services.js";

export const generateNotes = async (req, res) => {
  try {
    const {
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart
    } = req.body;

    // ✅ validation
    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    // ✅ user check
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ credits check
    if (user.credits < 10) {
      user.isCreditAvailable = false;
      await user.save();
      return res.status(403).json({
        message: "Not enough credits",
        credits: user.credits
      });
    }

    // ✅ build AI prompt
    const prompt = buildPrompt({
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart
    });

    // ✅ call Gemini
    const aiResponse = await generateGeminiResponse(prompt);

    // ✅ create note
    const notes = await Note.create({
      user: user._id,
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart,
      content: aiResponse
    });

    // ✅ attach note to user
    user.notes.push(notes._id);

    // ✅ deduct credits
    user.credits -= 10;
    if (user.credits <= 0) user.isCreditAvailable = false;

    await user.save();

    // ✅ success response
    return res.status(201).json({
      message: "Notes generated successfully",
      notes,
      remainingCredits: user.credits
    });

  } catch (error) {
    console.error("Generate Notes Error:", error);
    return res.status(500).json({
      message: "Failed to generate notes"
    });
  }
};
