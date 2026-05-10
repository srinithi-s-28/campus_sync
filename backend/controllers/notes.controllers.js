import Note from "../models/Notes.Models.js";


/* =========================
   GET USER NOTES
========================= */
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId })
      .select(
        "topic classLevel examType revisionMode includeDiagram includeChart createdAt"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
    });
  }
};


/* =========================
   GET SINGLE NOTE
========================= */
export const getSingleNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({
      _id: id,
      user: req.userId,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      _id: note._id,
      content: note.content,
      topic: note.topic,
      createdAt: note.createdAt,
    });
  } catch (error) {
    console.error("Get single note error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch note",
    });
  }
};
