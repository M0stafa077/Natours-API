import { model, Schema, Query } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import * as crypto from "crypto";

interface UserEntityDto extends Document {
    name: string;
    email: string;
    password: string;
    passwordUpdateTime: Date;
    photo: string;
    role: "user" | "admin" | "guide" | "lead-guide";
    resetToken?: string;
    resetTokenExp?: Date;
    generateResetToken: () => string;
}

const userSchema = new Schema<UserEntityDto>({
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
        enum: ["user", "admin", "guide", "lead-guide"],
        isLowercase: true,
        default: "user",
    },
    resetToken: {
        type: String,
        default: null,
    },
    resetTokenExp: Date,
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        this.passwordUpdateTime = new Date();
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
userSchema.methods.generateResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetTokenExp = Date.now() + 10 * 60 * 1000;

    return resetToken;
};
const UserModel = model("User", userSchema);
export default UserModel;
