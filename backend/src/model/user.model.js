import e from "express";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: { type: String, required: [true, "name is required!"] },
    email: { type: String, required: [true, "email is required!"] },
    password: { type: String, required: [true, "password is required!"] },
    // phoneNo: { type: String, required: [true, "phone Number is required!"] },
    employeeId: { type: String, required: [true, "employeeId is required!"] },
    role: {
      type: String,
      enum: ["admin", "team"],
      default: "team",
      required: [true, "role is required!"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    user.password = hashPassword;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      userId: this._id.toString(),
      email: this.email,
      name: this.name,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1w" }
  );
  return token;
};
userSchema.methods.passwordCompare = async function (plainPassword) {
  const user = this;
  return await bcrypt.compare(plainPassword, user.password);
};
const User = mongoose.model("User", userSchema);
export default User;
