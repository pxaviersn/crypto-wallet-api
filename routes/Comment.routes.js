import { Router } from "express";
import CommentModel from "../models/Comment.model.js";
import UserModel from '../models/User.model.js';
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'

const CommentRouter = Router()

CommentRouter.post('/comments', isAuthenticatedMiddleware, async (req, res) => {
    const payload = { ...req.body, user: req.user.id }

    try {
        const newComment = await CommentModel.create(payload)

        await UserModel.findOneAndUpdate({_id: req.user.id}, {$push: {comments: newComment._id }})

        return res.status(201).json({ content: newComment.content });      
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
})

export default CommentRouter
