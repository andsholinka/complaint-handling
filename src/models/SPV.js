import mongoose from 'mongoose';

const SPVSchema = mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: [true, "Please tell your name"],
        },
        password: {
            type: String,
            required: [true, "Please input password"],
            trim: true, // auto hapus spasi kiri dan kanan
            validate(value) {
                if (value.toLowerCase().includes("password")) {
                    // biar gak asal input password jadi password
                    throw Error("Your password is invalid!");
                }
            },            
        },
        id_role:{
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

const SPV = mongoose.model('spv', SPVSchema);

export default SPV;