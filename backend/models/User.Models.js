import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true ,
        unique:true
    },
    password:{
        type:String,
        default: null
       
    },
    ProfileImage:{
        type:String,
        default:""
    },
    credits:{
        type:Number,
        default:150,
        min:0
    },
    phone:{
        type:String,
        required: true 

    },
    isCreditAvailable :{
        type:Boolean,
        default:true
    },
   theme: {         
      type: String,
      enum: ["light", "dark"],
      default: "dark",
    },

    notes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Notes",
        default:[]
    }


},{timestamps:true})

const UserModel = mongoose.model("User",userSchema);
export default UserModel