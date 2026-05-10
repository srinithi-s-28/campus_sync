import mongoose from "mongoose";
const connectDb=async()=>{
    try {
        const res = await mongoose.connect(process.env.MONGOSE_URL);
        if(res){
            console.log("DB connectred successfully");
            
        }
    } catch (error) {
        console.log(error);
        
    }
}

export default connectDb;