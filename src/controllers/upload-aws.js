import express from 'express'
import AWS from 'aws-sdk'
import multer from 'multer'
import Conf from '../config/config.js'

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage
});

const s3Client = new AWS.S3({
    accessKeyId: Conf.AWS_ACCESS,
    secretAccessKey: Conf.AWS_SECRETE,
    region: Conf.AWS_REGION
})

const uploadParams = {
    Bucket: Conf.AWS_BUCKET,
    Key: '', // pass key
    Body: null, // pass file body
}

const uploadRouter = express.Router()

uploadRouter.post('/upload', upload.single('file'), (req, res) => {
    const params = uploadParams

    uploadParams.Key = req.file.originalname
    uploadParams.Body = req.file.buffer

    s3Client.upload(params, (err, data) => {
        if (err) {
            res.status(500).json({
                error: err
            })
        }
        res.status(201).json({
            message: 'File berhasil di-upload!',
            'Filename': req.file.originalname,
            'Location': data.Location
        })
    })
})

export default uploadRouter