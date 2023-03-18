import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.model.js'
import 'dotenv/config'
import jwt from 'jsonwebtoken'

const authRouter = Router()

authRouter.post('/auth/sign-up', async (req, res) => {
    const { email, password } = req.body

    try {

        const userExists = await User.findOne({email})
        if(userExists) {
            throw new Error('User exists')
        }

        const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS)
        const passwordHash = bcrypt.hashSync(password, salt)

        const newUser = await User.create({ email, passwordHash })
        if(newUser) {
            return res.status(201).json({message: 'User Created'})
        }
    } catch (error) {
        console.log(error)

        if(error.message === 'User exists') {
            return res.status(409).json({message: 'Revise os dados enviados'})
        }
        return res.status(500).json({message: 'Internal Server Error'})
    }
})

authRouter.post('/auth/login', async (req, res) => {
    const { email, password } = req.body

    try {
        if(!email) {
            throw new Error('Empty e-mail')
        }
    
        if(!password) {
            throw new Error('Empty password')
        }

        const user = await User.findOne({email})

        if(!user) {
            throw new Error('User does not exists')
        }

        console.log(user)


        if(!bcrypt.compareSync(password, user.passwordHash)) {
            return res.status(401).json({message: "Password does not match"})
        }

        const secret = process.env.JWT_SECRET
        const expiresIn = process.env.JWT_EXPIRES

       
        const token = jwt.sign({id: user._id, email: user.email}, secret, {expiresIn})
            return res.status(200).json({logged: true, jwt: token})

    } catch (error) {
        console.log(error)
        return res.status(401).json({message: 'Login and or Password incorrect'})
    }
})

export default authRouter
