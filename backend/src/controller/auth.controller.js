import User from "../model/user.model.js";
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, employeeId } = req.body;
    if (!name || !email || !password || !employeeId) {
      throw {
        statusCode: 400,
        message: "All fields are required!",
      };
    }

    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      throw { statusCode: 400, message: "User already exists!" };
    }

    const newUser = new User({
      email,
      name,
      password,
      employeeId,
    });
    await newUser.save();
    const token = newUser.generateToken();
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(201)
      .json({
        sucess: true,
        message: "User registered successfully!",
      });

    // return res.status(201).json({
    //   sucess: true,
    //   message: "User registered successfully!",
    // });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw {
        statusCode: 400,
        message: "All fields are required!",
      };
    }
    const isExistingUser = await User.findOne({ email });
    if (!isExistingUser) {
      throw { statusCode: 400, message: "Your acccount doesn't exist!" };
    }

    const isMatch = await isExistingUser.passwordCompare(password);
    if (!isMatch) {
      throw { statusCode: 400, message: "Invalid credentials!" };
    }
    const token = isExistingUser.generateToken();
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully!",
      });
  } catch (error) {
    next(error);
  }
};
