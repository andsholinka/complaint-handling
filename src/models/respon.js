import mongoose from 'mongoose';

const ResponSchema = mongoose.Schema(
    {
        detail_respon:{
            type: String,
            required: [true, "Please input detail respon"],
        },
        id_komplain: {
            type: String,            
        },
        id_cs: {
            type: String,        
        },
        id_customer: {
            type: String,      
        },
        rating:{
            type: Number,          
        },
    },
    {
        timestamps: false,
    }
);

const Respon = mongoose.model('Respon', ResponSchema);

export default Respon;