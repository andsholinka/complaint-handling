import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema(
    {
        judul: {
            type: String,
            required: [true, "Judul jangan lupa"],
        },
        detail_komplain: {
            type: String,
            required: [true, "Detail jangan lupa"],
        },
        gambar: {
            type: String,
        },
        id_kategori: {
            type: Number,
        },
        id_cs: {
            type: String,
        },
        id_customer: {
            type: String,
        },
        id_tag: {
            type: Number,
            default: 0,
        }
    }, { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;