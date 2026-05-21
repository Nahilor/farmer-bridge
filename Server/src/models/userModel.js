const mongoose = require("mongoose");


// we will add more on this schema for now i think this is enough for just login purposes
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: Number,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["RETAILER", 'ADMIN', 'FARMER'],
            required: true
        },
        address: {
            type: String,
            required: function() {
                return this.role === "RETAILER" || this.role === "FARMER";
            }
        },
        status: {
            type: String,
            enum: ["PENDING_VERIFICATION", "ACTIVE", "SUSPENDED"]
        }
    }, 
    { timestamps: true } 
);

module.exports = mongoose.model("User", userSchema);
