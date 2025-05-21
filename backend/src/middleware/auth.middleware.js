import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async(req, res, next) => {
     try {
        const token = req.cookie.jwt;
        if(!token){
            return res.status(400).json({message: "UnAuthorized - No token Provided"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

            if(!decoded){
                return res.status(400).json({message: "UnAuthorized - Invalid token "})
            }
     } catch (error) {
        
     }
}