import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  refreshToken: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  avatar: {
    type: String,
    default:
      "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return null;
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  console.log(this, "this object");
  console.log("coming here", this._id);
  console.log("coming here email", this.email);

  console.log(process.env.ACCESS_TOKEN_SECRET, "ACCESS_TOKEN_SECRET");

  console.log(process.env.ACCESS_TOKEN_EXPIRY, "ACCESS_TOKEN_EXPIRY");

  console.log(process.env.REFRESH_TOKEN_SECRET, "REFRESH_TOKEN_SECRET");

  console.log(process.env.REFRESH_TOKEN_EXPIRY, "REFRESH_TOKEN_EXPIRY");

  const accessTokenSign = jwt.sign(
    {
      id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  console.log(accessTokenSign, "accessToken Sign");
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  console.log("Function call of refresh token");
  console.log(
    jwt.sign(
      {
        id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    ),
    "into generateToken"
  );
  console.log(REFRESH_TOKEN_SECRET, "REFRESH_TOKEN_SECRET");
  console.log(REFRESH_TOKEN_EXPIRY, "REFRESH_TOKEN_EXPIRY");
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
