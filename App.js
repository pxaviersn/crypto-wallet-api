import dotenv from 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.connection.js'
import OperationsRouter from './routes/Operation.routes.js'
import authRouter from './routes/Auth.routes.js'
import CommentRouter from './routes/Comment.routes.js'

const app = express()
connectDB()



app.use(cors({ origin: process.env.REACT_URL }));
app.options("*", cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    app.use(cors());
    next();
});


app.use(express.json())
app.use(authRouter)
app.use(OperationsRouter)
app.use(CommentRouter)



app.listen(process.env.PORT, () => console.log('Server listening on port ' + process.env.PORT))