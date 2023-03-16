import mongoose from 'mongoose'
import dotenv from 'dotenv/config'

const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`Connected to the database: ${connection.connections[0].name}`)
}

export default connectDB