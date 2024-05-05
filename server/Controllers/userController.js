
const { default: mongoose } = require("mongoose");
const User = require("../Models/User");
var UserSchema=mongoose.UserSchema
const jwt=require("jsonwebtoken")
const bcrypt = require('bcrypt');
const validator = require('validator');

const bodyParser = require('body-parser');
// Register User
const registerUser = async (req, res) => {
  
  
  try {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      age:req.body.age,
      height:req.body.height,
      neck:req.body.neck,
      waist:req.body.waist,
      weight:req.body.weight,
      gender:req.body.gender,
      
    };
    console.log(user);

    // Check if the user is already registered.
    const existingUser = await User.findOne({ email: user.email });
      const weight = user.weight; // Assuming weight is sent in the request body
      const height = user.height;
      let bmi = weight / ((height /100)**2);
      let BFP = user.gender=="female" ? (1.20 * bmi) + (0.23 * user.age) - 5.4 : (1.20 * bmi) + (0.23 * user.age) - 16.2
      let cal = 0.45359237 * weight * 12
      let protein = weight * 1.6
      let carbpercal = cal / 2 
      let carbpergram=cal / 2 / 4 
      let BMR =user.gender=="female" ? ( 10 * weight ) + ( 6.25* height) - ( 5 * user.age)-161 :( 10 * weight ) + ( 6.25* height) - ( 5 * user.age)+5
      let sugar = cal * 0.0225
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Create User
    user.bmi=bmi
    user.bfp=BFP
    user.cal=cal
    user.protein=protein
    user.carbpercal=carbpercal
    user.carbpergram=carbpergram
    user.bmr=BMR
    user.sugar=sugar
    await User.create(user)
      .then((user) => {        
        res.status(201).json({
          message: "Registration successful",
          user:{
            name:user.name,
            email: user.email,
            age:user.age,
            height:user.height,
            neck:user.neck,
            waist:user.waist,
            weight:user.weight,
            gender:user.gender,
            activity:user.activity,
            bmi:bmi,
            BFP:BFP,
            cal:cal,
            protein:protein,
            carbpercal:carbpercal,
            carbpergram:carbpergram,
            BMR:BMR,
            sugar:sugar
          },
        });
      })
      .catch((error) => {
        res.status(400).json({
          message: "Invalid Email or Password",
        });
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
          activity: user.activity,
          bmi: user.bmi,
          BFP: user.bfp,
          cal: user.cal,
          protein: user.protein,
          carbpercal: user.carbpercal,
          carbpergram: user.carbpergram,
          BMR: user.bmr,
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