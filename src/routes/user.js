const express = require("express");
const userSchema = require("../models/user");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

// create user
router.post("/users", (req, res) => {
  const user = userSchema(req.body);
  console.log(user,req.body);
  user
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// get all users
router.get("/users", (req, res) => {
  userSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// get a user
router.get("/users/:id", (req, res) => {
  const { id } = req.params;
  userSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// delete a user
router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  userSchema
    .remove({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// update a user
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, age, email } = req.body;
  userSchema
    .updateOne({ _id: id }, { $set: { name, age, email } })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userSchema({ name, email, password: hashedPassword });
    const emailExists = await userSchema.findOne({ email });
    if(emailExists) {
      res.status(409).json({ message: 'Email already registered...' });
      console.log("Email already registered");
      return;
    }
    const nameExists = await userSchema.findOne({ name });
    if(nameExists) {
      res.status(410).json({ message: 'Username not available...' });
      console.log("Username not available");
      return;
    }
    user
    .save()
    .then((data) => res.status(200).json({message: 'User created successfully',name:'king'}))
    .catch((error) => res.json({ message: error }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const useremail = await userSchema.findOne({ email });
    const username = await userSchema.findOne({ name });
    var user;
    if (!useremail) {
      user=username;
    }else{
      user=useremail;
    }
    if(user==null){
      res.status(401).json({ message: 'User not registered...' });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(402).json({ message: 'Invalid Password' });
      return;
    }
    // Generate a JWT token upon successful login
    const token = jwt.sign({ username: user.name }, '5a424969a559eefa45c0e374a9b7ad3c2193effe4062e0defe9b2e65364ec2cf');
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
