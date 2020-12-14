import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: [true, "Please tell your name"],
    },
    nama_lengkap: {
        type: String,
        required: [true, "Please input full name"],
    },
    no_ktp: {
        type: Number,
        required: [true, "Please input no_ktp"],
        minlength: 16,
        maxlength: 16,
        trim: true, // auto hapus spasi kiri dan kanan
    },
    no_rekening: {
        type: String,
        required: [true, "Please input no_rekening"],
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    VerificationToken: {
        type: String,
        required: true,
    },
    id_role: {
        type: Number,
        default: 2,
    }
}, {
    timestamps: true,
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;