import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  topic: {
    type: String,
    required: true,
    
  },
  revisionMode:{
    type:Boolean,
    default:false,
  },
  includeDiagram:Boolean,
  includeChart:Boolean,

  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },




}, { timestamps: true });

const Note = mongoose.model("Note", noteSchema);
export default Note;
