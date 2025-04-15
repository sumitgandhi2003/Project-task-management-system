import User from "../model/user.model.js";
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, employeeId, role } = req.body;
    if (!name || !email || !password || !employeeId || !role) {
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
      role,
    });
    await newUser.save();
    const token = newUser.generateToken();
    const { _password, __v, ...withoutPassword } = newUser.toObject();
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
        userDetail: { ...withoutPassword },
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
    const filterData = isExistingUser.toObject();
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
        userDetail: { ...filterData },
      });
  } catch (error) {
    next(error);
  }
};

export const getActiveUser = async (req, res, next) => {
  try {
    const user = req?.user?.toObject();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }
    return res.status(200).json({
      success: true,
      data: { ...user },
      message: "Current user fetched successfully!",
    });
  } catch (error) {
    next(error);
  }
};
