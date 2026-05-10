import jwt from "jsonwebtoken"

export const getToken = async(userId) =>{
    try {
        const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"})
        return token;
        console.log(token);
        
    } catch (error) {
        console.log(error);
        
    }
}