import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const CSSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            unique: true,
            required: [true, "Please tell username"],
        },
        password: {
            type: String,
            required: [true, "Please input your password"],
            trim: true, // auto hapus spasi kiri dan kanan
            validate(value) {
                if (value.toLowerCase().includes("password")) {
                    // biar gak asal input password jadi password
                    throw Error("Your password is invalid!");
                }
            },            
        },
        nama_asli: {
            type: String,
            required: [true, "Please input your name"],
        },
        cs_name:{
            type: String,
            required: [true, "Please input your cs name"],
        },
        foto_asli:{
            type: String,
        },
        foto_avatar:{
            type: String,
        },
        id_role:{
            type: Number,
            default: 1,
        },
        id_status:{
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

const CS = mongoose.model('cs', CSSchema);

export default CS;