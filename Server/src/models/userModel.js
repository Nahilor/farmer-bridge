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
        products: {
            type: [
                {
                    name: String,
                    price: Number,
                    quantity: Number,
                    picture: String
                }
            ],
            // only farmers can have this field
            required: function() {
                return this.role === "FARMER" || this.role === "RETAILER"
            }
        },
        address: {
            type: String,
            required: function() {
                return this.role === "FARMER" || this.role === "RETAILER"
            }
        },
        status: {
            default: "PENDING_VERIFICATION",
            type: String,
            enum: ["PENDING_VERIFICATION", "ACTIVE", "SUSPENDED"],
            required: function() {
                return this.role == "RETAILER" || this.role == "FARMER"
            }
        }
    }, 
    { timestamps: true } 
);

module.exports = mongoose.model("User", userSchema);
