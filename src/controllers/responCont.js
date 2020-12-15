import Respon from '../models/respon.js';
import Complaint from '../models/complaint.js';
import CS from '../models/cs.js';
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import Conf from '../config/config.js';
import Customer from '../models/customer.js';
import SPV from '../models/SPV.js';

var responRouter = express.Router();

responRouter.use(bodyParser.urlencoded({
    extended: false
}));
responRouter.use(bodyParser.json());

//POST Response id_role CS 
responRouter.post('/create/:idComplaint', async (req, res) => {

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
        const cs = await CS.findById(decoded.id);
        // console.log('id_customer ' + complaint.id_customer); 
        // console.log('id_complaint ' + complaint._id);         
        if (cs && cs.length !== 0) {
            try {
                const complaint = await Complaint.findById(req.params.idComplaint);
                const {
                    detail_respon,
                    id_tag
                } = req.body;
                complaint.id_tag = id_tag;
                complaint.id_cs = cs._id;
                const updateDataComplaint = await complaint.save()
                const respon = new Respon({
                    detail_respon: detail_respon,
                    id_komplain: complaint._id,
                    id_cs: cs._id,
                    id_customer: complaint.id_customer
                });
                await respon.save();
                res.status(201).send({
                    respon,
                    updateDataComplaint
                });
            } catch (err) {
                res.status(400).send(err);
            }
        } else {
            res.status(401).send(`Has no Authority`);
        }
    })
});

//Update tag by id respon id_role CS 
responRouter.put('/update-tag/:idRespon', async (req, res) => {

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
        const cs = await CS.findById(decoded.id);
        if (cs && cs.length !== 0) {
            try {
                const respon = await Respon.findById(req.params.idRespon);
                // console.log('req.params.idRespon: ' + req.params.idRespon)
                // console.log('respon.id_komplain: ' + respon.id_komplain);
                const complaint = await Complaint.findById(respon.id_komplain);
                const {
                    detail_respon,
                    id_tag
                } = req.body;
                if (complaint) {
                    complaint.id_tag = id_tag;
                    const updateDataComplaint = await complaint.save();
                    respon.detail_respon = detail_respon;
                    const updateDataRespon = await respon.save();
                    res.status(201).send({
                        updateDataComplaint,
                        updateDataRespon
                    });
                } else {
                    res.status(404).json({
                        message: 'Complaint not found'
                    })
                }
            } catch (err) {
                res.status(400).send(err);
            }
        } else {
            res.status(401).send(`Has no Authority`);
        }
    })
});

//Update rating id_role customer
responRouter.put('/update-rating/:idRespon', async (req, res) => {

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
        const customer = await Customer.findById(decoded.id);
        if (customer && customer.length !== 0) {
            try {
                const respon = await Respon.findById(req.params.idRespon);
                const complaint = await Complaint.findById(respon.id_komplain);
                const {
                    rating
                } = req.body;
                if (complaint) {
                    complaint.id_tag = 5;
                    const updateDataComplaint = await complaint.save();
                    respon.rating = rating;
                    const updateDataRespon = await respon.save();
                    res.status(201).send({
                        updateDataRespon,
                        updateDataComplaint
                    });
                } else {
                    res.status(404).json({
                        message: 'Complaint not found'
                    })
                }
            } catch (err) {
                res.status(400).send(err);
            }
        } else {
            res.status(401).send(`Has no Authority`);
        }
    })
});


//GET respon all CS id_role SPV
responRouter.get('/get-all-respon', async (req, res) => {
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
        const spv = await SPV.findById(decoded.id);
        if (spv && spv.length !== 0) {
            const respon = await Respon.find({});
            if (respon && respon.length !== 0) {
                res.json(respon)
            } else {
                res.status(404).json({
                    message: 'Response not found'
                });
            }
        } else {

            res.status(401).send(`Has no Authority`);
        }
    })


});

//GET Respon by id CS id_role CS
responRouter.get('/get-respon-by-cs', async (req, res) => {
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
        const cs = await CS.findById(decoded.id);
        if (cs && cs.length !== 0) {
            const respon = await Respon.find({
                "id_cs": cs._id
            });
            if (respon && respon.length !== 0) {
                res.json(respon)
            } else {
                res.status(404).json({
                    message: 'Response not found'
                });
            }
        } else {
            res.status(401).send(`Has no Authority`);
        }
    })


});


//akumulasi Rating id_role SPV
responRouter.get('/akumulasiRating', async (req, res) => {

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
        const user = await SPV.findById(decoded.id);
        if (user.id_role === 0) {
            const respon = await Respon.aggregate(
                [{
                    $group: {
                        _id: "$id_cs",
                        count: {
                            $sum: 1
                        },
                        total: {
                            $sum: {
                                $multiply: ["$rating"]
                            }
                        },
                        average: {
                            $avg: {
                                $multiply: ["$rating"]
                            }
                        },
                    }
                }]
            )


            if (respon && respon.length !== 0) {
                res.json(respon)
            } else {
                res.status(404).json({
                    message: 'respon not found'
                });
            }
        } else {

            res.status(401).send(`Has no Authority`);
        }
    })
})

export default responRouter;