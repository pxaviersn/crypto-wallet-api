import { Router } from "express";
import OperationModel from "../models/Operation.Model.js";
import UserModel from '../models/User.Model.js';
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'
import 'dotenv/config'
import jwt from 'jsonwebtoken';

const OperationsRouter = Router()

OperationsRouter.get('/operations/user', isAuthenticatedMiddleware, async (req, res) => {
    try {
        const operations = await OperationModel.find({ user: req.user.id })
        return res.status(200).json(operations)   
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
})

OperationsRouter.post('/operations/user', isAuthenticatedMiddleware, async (req, res) => {
    const payload = { ...req.body, user: req.user.id }

    try {
        const newOperation = await OperationModel.create(payload)

        await UserModel.findOneAndUpdate({_id: req.user.id}, {$push: {Operations: newOperation._id }})

        return res.status(201).json(newOperation)      
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
})

OperationsRouter.put('/operations/user/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    const payload = req.body
    try {
        const updatedOperation = await OperationModel.findOneAndUpdate(
            {_id: id, user: req.user.id}, 
            payload, 
            { new: true }
        )
        return res.status(200).json(updatedOperation)      
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
})

OperationsRouter.delete('/operations/user/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        await OperationModel.findOneAndDelete({_id: id, user: req.user.id})
        return res.status(204).json()  
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
})

export default OperationsRouter

