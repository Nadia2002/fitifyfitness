const mongoose = require("mongoose");
const validator = require('validator');
const Schema = mongoose.Schema;
//const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
   name: {
   type: String,
   required: true
  },
  email: {
   type: String,
   required: true,
   unique: true,
   lowercase: true,
   trim: true,
   validate: [validator.isEmail, 'Please provide a valid email address']
  },
  password: {
   type: String,
   required: true,
   minlength: [8, 'Password must be at least 8 characters long'],
   maxlength: [128, 'Password must be less than 128 characters long']
  },
  age:{
    type:Number,
    required:true
  },
  height:{
    type:Number,
    required:true
  },
  neck:{
    type:Number,
    required:true
  },
  waist:{
    type:Number,
    required:true
  },
  weight:{
    type:Number,
    required:true
  },
  gender:{
    type:String,
    required:true
  },
  activity: {
   type: Date,
   default:Date
  },
  bmi:{
    type:Number,
  },
  bfp:{
    type:Number,
  },
  cal:{
    type:Number,
  },
  protein:{
    type:Number,
  },
  carbpercal:{
    type:Number,
  },
  carbpergram:{
    type:Number,
  },
  bmr:{
    type:Number,
  },
  sugar:{
    type:Number,
  },
  otp: {
    type: String,
    default: ''
},
otpExpiry: {
    type: Date,
    default: Date.now
}
});

// pre middleware calc bmi, bfp, cal, protein, carbpercal, carbpergram when user updates their weight or height or age
UserSchema.pre('save', function(next){
  if (this.isModified('weight') || this.isModified('height')){
    let bmi = this.weight / ((this.height/100 )**2) ;
    let BFP = this.gender=="female" ? (1.20 * bmi) + (0.23 * this.age) - 5.4 : (1.20 * bmi) + (0.23 * this.age) - 16.2
    let cal = 0.45359237 * this.weight * 12
    let protein = this.weight * 1.6
    let carbpercal = cal / 2 
    let carbpergram=cal / 2 / 4
    let BMR = this.gender=='female' ? ( 10 * this.weight ) + ( 6.25* this.height) - ( 5 * this.age)-161 :( 10 * this.weight ) + ( 6.25* this.height) - ( 5 * this.age)+5
    let sugar = cal * 0.0225
    this.bmi = bmi;
    this.bfp = BFP;
    this.cal = cal;
    this.protein = protein;
    this.carbpercal = carbpercal;
    this.carbpergram = carbpergram;
    this.bmr=BMR;
    this.sugar=sugar
  }
  next();
})
const User = mongoose.model('User', UserSchema);

module.exports = User;
