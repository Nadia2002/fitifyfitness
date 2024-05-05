const express = require("express"); 
const userRouter = require("./server/Routes/user-auth")
const { connectToDb } = require("./db"); 
var jwt=require("jsonwebtoken")
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
// Connection to database
connectToDb(); 

//Body parser middleware
app.use(express.json());
app.use(bodyParser.json());
//deployment access
const cors=require("cors");
const User = require("./server/Models/User");
app.use(cors())

  

// Routes
app.use("/", userRouter);

app.get("/getall",  (req, res) => {
    User.find()
    .then(
        (users)=>{
            res.send(users)
        }
    )
    .catch(
        (err)=>{
            res.send(err)
        }
    )
});
app.get('/getbyid/:id',(req,res)=>{
    myid=req.params.id;
    User.findOne({_id:myid})
    .then(
        (user)=>{
            res.send(user)
        }
    )
    .catch(
        (err)=>{
            res.send(err)
        }
    )
})
app.delete('/delete/:id',(req,res)=>{
    id=req.params.id
    User.findOneAndDelete({_id:id})
    .then(
        (deleteduser)=>{
            res.send(deleteduser)
        }
    )
    .catch(
        (err)=>{
            res.send(err)
        }
    )
})
app.put('/update/:id',async (req,res)=>{
    id=req.params.id
    const newdata=req.body
    // const oldUser = User.findById(id)
    // if (req.weight || req.height){
    //   const weight = req.weight; // Assuming weight is sent in the request body
    //   const height = req.height;
    //   let bmi = weight / (height * height);
    //   let BFP = 1.20 * bmi + 0.23 * req.age - 16.2
    //   let cal = 0.45359237 * weight * 12
    //   let protein = weight * 1.6
    //   let carbpercal = cal / 2 
    //   let carbpergram=cal / 2 / 4
    // }
    // User.findByIdAndUpdate({_id:id},newdata, {new:true})
    // .then(
    //     (updated)=>{
    //         res.send(updated)
    //     }
    // )
    // .catch(
    //     (err)=>{
    //         res.send(err)
    //     }
    // )
    const user = await User.findById(id)
    req.body.name ? user.name = req.body.name : user.name = user.name
    req.body.email ? user.email = req.body.email : user.email = user.email
    req.body.age ? user.age = req.body.age : user.age = user.age
    req.body.height ? user.height = req.body.height : user.height = user.height
    req.body.neck ? user.neck = req.body.neck : user.neck = user.neck
    req.body.waist ? user.waist = req.body.waist : user.waist = user.waist
    req.body.weight ? user.weight = req.body.weight : user.weight = user.weight
    req.body.gender ? user.gender = req.body.gender : user.gender = user.gender
    
    await user.save()
    res.send({
        id:user._id,
        name:user.name,
        email: user.email,
        age:user.age,
        height:user.height,
        neck:user.neck,
        waist:user.waist,
        weight:user.weight,
        gender:user.gender,
        activity:user.activity,
        bmi:user.bmi,
        BFP:user.bfp,
        cal:user.cal,
        protein:user.protein,
        carbpercal:user.carbpercal,
        carbpergram:user.carbpergram,
        BMR:user.bmr,
        sugar:user.sugar
    },)
})

//function calculateBMI(weight_kg, height_m) {
//    let bmi = weight_kg / (height_m * height_m);
//    return bmi;
//}

// Route to handle BMI calculation
//app.post('/calculate-bmi', (req, res) => {
//   const weight = req.body.weight; // Assuming weight is sent in the request body
//    const height = req.body.height; // Assuming height is sent in the request body
//
  //  if (!weight || !height) {
    //    return res.status(400).json('Weight and height are required.');
    //}

    //const bmi = calculateBMI(weight, height);
    //res.json({ bmi: bmi });
//});
app.listen(port, () => {
 console.log("Server is running on port 3000");
});