import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fileUploadCloudinary } from "../utils/cloudinary.js";

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Checking if any required field is empty
    if ([username, email, password].some((field) => !field?.trim())) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    // Checking if user already exists with the provided username or email
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      return res.status(409).json(new ApiError(409, "User already exists"));
    }

    let response;
    if (req.file && req.file.mimetype === "image/jpeg" && req.file.path) {
      const localFilePath = req.file.path;
      console.log("coming here");
      response = await fileUploadCloudinary(localFilePath);
    }

    // Creating a new user
    const user = await User.create({
      username,
      email,
      password,
      avatar: response?.url,
    });

    // Send success response with the created user
    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      return res
        .status(500)
        .json(new ApiResponse(500, "Error Occured during registration"));
    }

    return res
      .status(201)
      .json(new ApiResponse(200, "User created successfully", createdUser));
  } catch (error) {
    // Handling any unexpected errors
    console.error("Error occurred during user registration:", error);
    return res.status(500).json(new ApiError(500, "Something went wrong"));
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if ([username, password].some((field) => field.trim() === "")) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json(new ApiError(404, "User does not exist"));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json(new ApiError(401, "Password is incorrect"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, "User Logged in successful"));
  } catch (error) {
    console.log(error, "Error in Login");
  }
};

export { register, login };
