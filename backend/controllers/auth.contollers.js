import { getToken } from "../config/token.js";
import bcrypt from "bcrypt"
import UserModel from "../models/User.Models.js";

export const GoogleRegister = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    let user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    user = await UserModel.create({
      name,
      email,
      phone,
    });

    const token = await getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Account created successfully",
      user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Google register error" });
  }
};

export const GoogleLogin = async (req, res) => {
  try {
    const { email } = req.body;


    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await UserModel.findOne({ email });
 
    

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = await getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Google login error" });
  }
};


export const Register =async (req,res)=>{

     try {
    const { name, email, phone,password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    let user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password,10);

    user = await UserModel.create({
      name,
      email,
      phone,
      password : hashPassword
    });

    const token = await getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Account created successfully",
      user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "register error" });
  }
    
}



export const login =async (req,res)=>{

     try {
    const {  email,password } = req.body;

    if (!email  || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      console.log(`Login attempt with non-existent email: ${email}`);
      return res.status(404).json({ message: "User account not found. Please register first" });   
    }

    if (!user.password) {
      return res.status(400).json({ message: "Please use Google login for this account" });
    }

    const matchPassword = await bcrypt.compare(password,user.password);

    if(!matchPassword){
        return res.status(401).json({ message: "Incorrect password" });
    }

    const token = await getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "login successfully",
      user
    });

  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({ message: "login error" });
  }
    
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({success:true},{ message: "Logged out successfully" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Logout error" });
  }
};





export const updateTheme = async (req, res) => {
  try {
    const userId = req.userId;        // from auth middleware
    const { theme } = req.body;

    // validate
    if (!["light", "dark"].includes(theme)) {
      return res.status(400).json({
        success: false,
        message: "Invalid theme value",
      });
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { theme },
      { new: true }
    ).select("theme");

    return res.json({
      success: true,
      message: "Theme updated",
      theme: user.theme,
    });

  } catch (error) {
    console.error("Theme update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};