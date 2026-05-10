import Conversation from "../models/Conversation.model.js";
import Message from "../models/message.model.js";
import UserModel from "../models/User.Models.js";
import { getReciverSocketId, io } from "../socket.js";
import mongoose from "mongoose";
import uploadOnCloudinary from "../config/cloudinary.js";




export const sendMessage = async (req ,res)=>{
  try {
        const sender = req.userId;
   const { receiver } = req.params;
    const { message } = req.body;

 let image = "";
    if (req.file) {
    
        image = await uploadOnCloudinary(req.file.path);
    }

    let conversation = await Conversation.findOne({
      participants:{$all:[sender,receiver]}
    })

    let newMessage = await Message.create({
      sender,receiver,message,image
    })

    if(!conversation){
      conversation = await Conversation.create({
        participants:[sender,receiver],
        messages:[newMessage._id]
      })
    }else{
      conversation.messages.push(newMessage._id);
      conversation.save();
    }

    const receiverIdSocketId = getReciverSocketId(receiver);
    if(receiverIdSocketId){
      io.to(receiverIdSocketId).emit("newMessage",newMessage)
    }


    return res.status(201).json(newMessage);

  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to send message",
      error: error.message,
    });
  }
}


export const getMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;

    const conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] }
    }).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } }
    });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: []
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages
    });

  } catch (error) {
    console.log("Error in getMessage:", error);
    return res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.userId

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "participants",
        select: "name ProfileImage email phone",
      })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 },
        select: "message image sender receiver createdAt",
      })
      .sort({ updatedAt: -1 })

    const conversationUsers = conversations
      .map((conv) => {
        const otherUser = (conv.participants || []).find(
          (p) => p?._id?.toString() !== userId?.toString()
        )

        if (!otherUser) return null

        const lastMessage = conv.messages?.[0] || null

        return {
          _id: otherUser._id,
          name: otherUser.name,
          profileImage: otherUser.ProfileImage || "",
          email: otherUser.email,
          phone: otherUser.phone,
          lastMessage:
            lastMessage?.message || (lastMessage?.image ? "📷 Image" : ""),
          lastMessageAt: lastMessage?.createdAt || conv.updatedAt,
          conversationId: conv._id,
        }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))

    return res.status(200).json({
      success: true,
      conversationUsers,
    })
  } catch (error) {
    console.error("Get conversations error:", error)
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch conversations",
      error: error.message,
    })
  }
}

// Get all users (excluding current user)
export const getAllUsers = async (req, res) => {
  try {
    const userId = req.userId

    const users = await UserModel.find({ _id: { $ne: userId } })
      .select("name email ProfileImage phone")
      .sort({ name: 1 })

    const allUsers = users.map((user) => ({
      _id: user._id,
      name: user.name,
      profileImage: user.ProfileImage || "",
      email: user.email,
      phone: user.phone,
    }))

    return res.status(200).json({
      success: true,
      users: allUsers,
    })
  } catch (error) {
    console.error("Get all users error:", error)
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch users",
      error: error.message,
    })
  }
}







// export const sendMessage = async (req, res) => {
//   try {
//     const sender = req.userId;
//     const { receiverId } = req.params;
//     const { message } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(receiverId)) {
//       return res.status(400).json({ success: false, msg: "Invalid receiver ID" });
//     }

//     if (!message && !req.file) {
//       return res.status(400).json({ success: false, msg: "Message or image is required" });
//     }

//     let image = "";
//     if (req.file) {
//       try {
//         image = await uploadOnCloudinary(req.file.path);
//       } catch (uploadError) {
//         console.error("Upload error:", uploadError);
//         return res.status(400).json({ success: false, msg: "Failed to upload image" });
//       }
//     }

//     const senderId = new mongoose.Types.ObjectId(sender);
//     const receiverId_obj = new mongoose.Types.ObjectId(receiverId);

//     const participants = [senderId, receiverId_obj].sort((a, b) =>
//       a.toString().localeCompare(b.toString())
//     );

//     let conversation = await Conversation.findOne({
//       participants: { $size: 2, $all: participants },
//     });


//     const newMessage = await Message.create({
//       sender: senderId,
//       receiver: receiverId_obj,
//       message,
//       image,
//     });

//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants,
//         messages: [newMessage._id],
//       });
//     } else {
//       conversation.messages.push(newMessage._id);
//       await conversation.save();
//     }
//     const recSocketId = getReciverSocketId(receiverId);
//     if(recSocketId){
//       io.to(recSocketId).emit("newMessage",newMessage)
//     }

//     return res.status(201).json({
//       success: true,
//       msg: "Message sent successfully",
//       data: newMessage,
//     });
//   } catch (error) {
//     console.error("Send message error:", error);
//     return res.status(500).json({
//       success: false,
//       msg: "Failed to send message",
//       error: error.message,
//     });
//   }
// };

// export const getMessage = async (req, res) => {
//   try {
//     const sender = req.userId;
//     const { receiverId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(receiverId)) {
//       return res.status(400).json({ success: false, msg: "Invalid receiver ID" });
//     }

//     const senderId = new mongoose.Types.ObjectId(sender);
//     const receiverId_obj = new mongoose.Types.ObjectId(receiverId);

//     const participants = [senderId, receiverId_obj].sort((a, b) =>
//       a.toString().localeCompare(b.toString())
//     );

//     const conversation = await Conversation.findOne({
//       participants: { $size: 2, $all: participants },
//     }).populate({
//       path: "messages",
//       options: { sort: { createdAt: 1 } },
//       populate: [
//         { path: "sender", select: "name image" },
//         { path: "receiver", select: "name image" },
//       ],
//     });

//     return res.status(200).json({
//       success: true,
//       msg: "Messages retrieved successfully",
//       data: conversation ? conversation.messages : [],
//     });
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     return res.status(500).json({
//       success: false,
//       msg: "Failed to retrieve messages",
//       error: error.message,
//     });
//   }
// };


// export const getAllUsers = async (req, res) => {
//   try {
//     const currentUserId = req.user?.id; // from auth middleware

//     const users = await UserModel.find({
//       _id: { $ne: currentUserId }, // exclude self
//     }).select("-password -__v");

//     return res.status(200).json({
//       success: true,
//       count: users.length,
//       users,
//     });
//   } catch (error) {
//     console.error("Get all users error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };
// export const getSelectedUserInformation = async (req, res) => {
//   try {
//     const { id } = req.params;   // get id from params

//     const user = await UserModel.findById(id).select(
//       "-password -__v"
//     ); // remove sensitive fields

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     console.error("Get selected user error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// export const getConversations = async (req, res) => {
//   try {
//     const userId = req.userId;

//     const conversations = await Conversation.find({
//       participants: userId,
//     })
//       .populate({
//         path: "participants",
//         select: "name ProfileImage email phone",
//         match: { _id: { $ne: userId } }, // Get other participant only
//       })
//       .populate({
//         path: "messages",
//         options: { sort: { createdAt: -1 }, limit: 1 },
//         select: "message sender",
//       })
//       .sort({ updatedAt: -1 });

//     const formattedConversations = conversations.map((conv) => {
//       const otherParticipant = conv.participants.find((p) => p._id.toString() !== userId);
//       return {
//         _id: conv._id,
//         participants: conv.participants,
//         lastMessage: conv.messages[0] || null,
//         last: conv.messages[0]?.message || "",
//         unread: 0,
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       data: formattedConversations,
//     });
//   } catch (error) {
//     console.error("Get conversations error:", error);
//     return res.status(500).json({
//       success: false,
//       msg: "Failed to fetch conversations",
//       error: error.message,
//     });
//   }
// };

















// let image = "";
//     if (req.file) {
//       try {
//         image = await uploadOnCloudinary(req.file.path);
//       } catch (uploadError) {
//         console.error("Upload error:", uploadError);
//         return res.status(400).json({ success: false, msg: "Failed to upload image" });
//       }
//     }