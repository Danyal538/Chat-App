import cloudinary from "../lib/cloudinary.js";
import message from "../models/message.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUSer = await User.find({ _id: { $ne: loggedInUser } }).select("-password");
        res.status(200).json(filteredUSer);
    } catch (error) {
        console.error("Error in getUsersForSideBar controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, recieverId: userToChatId },
                { senderId: userToChatId, recieverId: myId },
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in message Controller: ", error.message);
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const sendMessages = async(req, res) => {
    try {
        const {text, image} = req.body;
        const {id: recieverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            // upload base 64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url; 
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();

        //todo real time functionality goes here => socket io

        res.satus(201).json(newMessage);
    } catch (error) {
        console.log("Error in messageController: ", error.message);
        res.status(500).json({error: "Internal server error"})
    }
}