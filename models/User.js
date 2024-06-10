const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true },
        user_group_id: { type: Number, required: true },
        it_business_master_id: { type: Number, required: true },
        name: { type: String },
        user_name: { type: String },
        password: { type: String },
        password_old1: { type: String },
        password_old2: { type: String },
        ref_number: { type: String },
        status: { type: Number },
        c_at: { type: Date, default: Date.now },
        c_by: { type: Number },
        m_at: { type: Date },
        m_by: { type: Number },
    },
    { timestamps: false } // Disabling timestamps
);

const User = mongoose.model('it_user_master', userSchema)
module.exports = User
