const { default: mongoose } = require("mongoose");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, height, neck, waist, weight, gender } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Calculate BMI, BFP, etc.
    const bmi = weight / ((height /100)**2);
    const BFP = gender=="female" ? (1.20 * bmi) + (0.23 * age) - 5.4 : (1.20 * bmi) + (0.23 * age) - 16.2;
    const cal = 0.45359237 * weight * 12;
    const protein = weight * 1.6;
    const carbpercal = cal / 2;
    const carbpergram = cal / 2 / 4;
    const BMR = gender=="female" ? ( 10 * weight ) + ( 6.25* height) - ( 5 * age) - 161 : ( 10 * weight ) + ( 6.25* height) - ( 5 * age) + 5;
    const sugar = cal * 0.0225;

    // Create a new user object with hashed password and calculated values
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
      height,
      neck,
      waist,
      weight,
      gender,
      bmi,
      BFP,
      cal,
      protein,
      carbpercal,
      carbpergram,
      BMR,
      sugar
    });

    // Check if the user is already registered.
    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Save the new user to the database
    await newUser.save();

    // Respond with a success message and details of the newly registered user
    res.status(201).json({
      message: "Registration successful",
      user: {
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
        height: newUser.height,
        neck: newUser.neck,
        waist: newUser.waist,
        weight: newUser.weight,
        gender: newUser.gender,
        activity:newUser.activity,
        bmi: bmi,
        BFP: BFP,
        cal: newUser.cal,
        protein: newUser.protein,
        carbpercal: newUser.carbpercal,
        carbpergram: newUser.carbpergram,
        BMR:BMR,
        sugar: newUser.sugar
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Compare the provided password with the hashed password from the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // If passwords match, generate JWT token
      const token = jwt.sign({ user }, 'my_secret_key');

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          height: user.height,
          neck: user.neck,
          waist: user.waist,
          weight: user.weight,
          gender: user.gender,
          activity:user.activity,
          bmi: user.bmi,
          BFP: user.BFP,
          cal: user.cal,
          protein: user.protein,
          carbpercal: user.carbpercal,
          carbpergram: user.carbpergram,
          BMR:user.BMR,
          sugar: user.sugar
        },
        token: token
      });
    } else {
      return res.status(401).json({
        message: "Email or password incorrect",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
