const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        userName: {
            type: String,
            required: true,
            unique: true,
            lowerCase: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            unique: true,
        },
        avatar: {
            type: String,   // cloudinary url
            required: true
        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        refreshToken: {
            type: String
        },
    },
    {timestamps: true}
);

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
   try {
     this.password = await bcrypt.hash(this.password, 10);
     next();
   } catch (error) {
        return res.status(501).json("Password not hashed");
   }
});

userSchema.methods.isPasswordCorrect = async function  (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("User", userSchema);