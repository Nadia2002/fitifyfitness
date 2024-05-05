const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController"); // importing the user controller 
const {sendOTPForPasswordReset} = require('../../utils/passwordReset');
const User = require("../Models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
router.post("/sign-up", userController.registerUser);
router.post("/login", userController.loginUser);
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
      await user.save();
    }

    const otp = await sendOTPForPasswordReset(email); // Utility function to send OTP
    user.otp = otp;
    await user.save();

    res.status(200).send('OTP sent successfully');
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).send('Error sending OTP');
  }
});



router.post('/reset-password', async (req, res) => {
  const {  otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ otp });

    

    if (user.otp !== otp) {
      return res.status(400).send('Invalid OTP');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = '';
    await user.save();

    // Re-generate JWT token with updated user information
    const token = jwt.sign({ user }, 'my_secret_key');

    res.status(200).json({
      message: 'Password updated successfully',
      //token: token
    });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).send('Error resetting password');
  }
});


module.exports = router;