const { default: mongoose, Schema } = require("mongoose");

const UserSchema = new Schema(
    {
        uId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        image: { type: String },
        email: { type: String, required: true, unique: true },
        isAdmin: { type: Boolean, required: true, default: false },
        lastActive: { type: Date },
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
