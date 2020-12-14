import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import customerRouter from './src/controllers/customerCont.js';
import complaintRouter from './src/controllers/complaintCont.js';
import uploadRouter from './src/controllers/upload-aws.js';
import responRouter from './src/controllers/responCont.js';
import spvRouter from './src/controllers/spvCont.js';
import csRouter from './src/controllers/csCont.js';

const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()

app.get('/', (req, res, next) => {
    res.send({
        success: true,
        message: "Application Complaint Handling"
    })
})

//default error
app.use((err, req, res, next) => {
    res.send(err.message)
})

app.use('/customer', customerRouter);
app.use('/complaint', complaintRouter);
app.use('/respon', responRouter);
app.use('/aws', uploadRouter);
app.use('/spv', spvRouter);
app.use('/cs', csRouter);

app.listen(process.env.PORT, () => {
    console.log(`App listens to port ${process.env.PORT}`);
});

// Connect to DB
var uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connect to DB success')
}).catch(err => {
    console.log('Connect to failed ' + err)
})