// Importing all required external modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');  
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Recipe = require('./models/recipe');
const authenticate = require('./middleware/authenticate')

const app = express();
const PORT = 5174;
app.use(express.json());
app.use(cors());

// Connecting to DB Atlas
mongoose.connect(process.env.MONGO_URL).then(
    () => console.log("DB connected successfully...")
).catch(
    (err) => console.log(err)
);

// API landing page http://localhost:3000/
app.get('/', async (req, res) => {
    try {
        res.send("<h2 style='color:blue;text-align:center'>Welcome to the MERN stack | Week 2 | Backend</h2>");
    } catch (err) {
        console.log(err);
    }
});

// API Registeration Page http://localhost:3000/register
app.post('/register', async(req,res) =>{
    const {username,email,password}=req.body
    try{
        const hashPassword=await bcrypt.hash(password,10)
        const newUser = new User({username,email,password:hashPassword})
    await newUser.save()
    console.log("New User is created....") //this message will be shown in console
    res.json({message : "User Registred"}) //this message will be shown in API tester
    } 
    catch(err){
        console.log(err)
    }
})

//API login http://localhost:3000/login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '10h' } 
        );

        res.json({
            message: "Login Successful",
            username: user.username,
            token:token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//Api recipe upload
app.post('/addrecipe', authenticate ,async (req, res) => {
    const { recipeName, ingredients, instructions, cuisineType, preparationTime, cookingTime, servings, image, tags } = req.body

    try {
        const newRecipe = new Recipe({
            author: { name: req.user.username, id: req.user._id },
            recipeName,
            ingredients,
            instructions,
            cuisineType,
            preparationTime,
            cookingTime,
            servings,
            image,
            tags
        });

        await newRecipe.save();
        res.json({ message: "Recipe uploaded successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error uploading recipe :(" });
    }
});

app.post('/user/update', authenticate , (req, res) => {

    const userData = req.user; 
   

    if (!userData._id || !updatedData) {
        return res.status(400).json({ message: "User ID and updated data are required" });
    }

    // Find and update user
    User.findByIdAndUpdate(userData._id, updatedData, { new: true }, (err, updatedUser) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "An error occurred while updating the user" });
        }

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    });
});



// Server connection and testing
app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server is running on port : " + PORT);
});
