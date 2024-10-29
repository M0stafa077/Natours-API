import { model, Schema, Query } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    name: {
        type: String,
        minlength: [3, "A name must be atleast 3 characters"],
        maxlength: [30, "A name must not exceed 20 characters"],
        required: [true, "Please provide the name"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please provide the user's email"],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    passwordUpdateTime: {
        type: Date,
        default: new Date(),
    },
    photo: String,
    role: {
        type: String,
        isLowercase: true,
        default: "user",
    },
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        this.passwordUpdateTime = new Date();
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
const UserModel = model("User", userSchema);
export default UserModel;
