import Complaint from '../models/complaint.js'
import Customer from '../models/customer.js'
import Conf from '../config/config.js'
import bodyParser from 'body-parser';
import express from 'express'
import multer from 'multer'
import path from 'path'
import jwt from 'jsonwebtoken';

var complaintRouter = express.Router();

complaintRouter.use(bodyParser.urlencoded({
    extended: false
}));
complaintRouter.use(bodyParser.json());


// file location and name
const storage = multer.diskStorage({
    destination: "public/images",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// filter file
function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb("Error: Images Only !!!");
    }
}

// upload
const upload = multer({
    storage: storage,
    // limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
})

// upload gambar
complaintRouter.post('/upload-gambar', upload.single('image'), (req, res) => {

    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    });

    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function (err, decoded) {
        if (err) return res.status(401).send({
            auth: false,
            message: 'Failed to authenticate token.'
        });
        const cust = await Customer.findById(decoded.id);
        // console.log(cust)
        if (cust.id_role === 2) {
            try {
                console.log(req.file);
                if (!req.file) {
                    res.status(500);
                    return next(Error);
                }
                // res.send(`/${req.file.path}`)
                res.send({
                    message: `success`
                })

            } catch (err) {
                console.log(err)
                res.status(500).json({
                    error: 'Complaint creation failed'
                });
            }
        } else {
            res.status(401).send(`${cust.username} Has no Authority`);
        }
    })
});


// create komplain
complaintRouter.post('/create', async (req, res) => {

    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    });

    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function (err, decoded) {
        if (err) return res.status(401).send({
            auth: false,
            message: 'Failed to authenticate token.'
        });
        const cust = await Customer.findById(decoded.id);
        console.log(cust)
        if (cust.id_role === 2) {
            try {
                const {
                    judul,
                    detail_komplain,
                    id_kategori,
                    id_cs,
                    id_tag
                } = req.body;
                const doc = new Complaint({
                    judul,
                    detail_komplain,
                    id_kategori,
                    id_cs,
                    id_customer: `${cust._id}`,
                    id_tag
                });
                const createDoc = await doc.save();
                res.status(201).json(createDoc);
            } catch (err) {
                console.log(err)
                res.status(500).json({
                    error: 'Complaint creation failed'
                });
            }
        } else {
            res.status(401).send(`${cust.username} Has no Authority`);
        }
    })
});

// get all complaints
complaintRouter.get('/complaints', async (req, res) => {

    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    });

    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function (err, decoded) {
        if (err) return res.status(401).send({
            auth: false,
            message: 'Failed to authenticate token.'
        });
        const cust = await Customer.findById(decoded.id);
        if (cust.id_role == 0) {
            const complaints = await Complaint.find({});
            if (complaints && complaints.length !== 0) {
                res.json(complaints)
            } else {
                res.status(404).json({
                    message: 'Complaint not found'
                });
            }
        } else {
            res.status(401).send(`${cust.username} Has no Authority`);
        }
    })
});

// check auth
complaintRouter.get('/check', function (req, res) {
    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    // console.log(token)
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    });

    //verifikasi jwt
    jwt.verify(token, Conf.secret, function (err, decoded) {
        if (err) return res.status(401).send({
            auth: false,
            message: 'Failed to authenticate token.'
        });

        res.status(200).send(decoded);
    });
});

// testing
// DELETE all data compaints
complaintRouter.delete('/complaints', async (req, res) => {
    const complaints = await Complaint.deleteMany();

    if (complaints) {
        res.json({
            message: 'all complaints removed'
        })
    } else {
        res.status(404).json({
            message: 'complaint not found'
        })
    }
})

export default complaintRouter;