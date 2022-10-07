const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("../Database/Connection");

const authenticateuser = require("../Middleware/AuthenticateUser");

// --------Database Registration User Schema --------------
const user = require("../Models/RegistrationSchema");


//  ------------------------------- registration user route ------------------------------------ //
router.post("/registration", async (req, res) => {
  const { name, email, phone, password, confirm_password } = req.body;
  if (!name || !email || !phone || !password || !confirm_password) {
    return res.status(421).json({ error: "All Field are required" });
  }

  try {
    const userExist = await user.findOne({ email: email }); //checking if user exists already

    if (userExist) {
      res.status(422).json({ error: "User already exist" });
    } else if (password !== confirm_password) {
      res.status(423).json({ error: "Passwords does not match correctly" });
    } else {
      const registered_user = new user({
        name,
        email,
        phone,
        password,
        cpassword: confirm_password,
      }); //make user object

      await registered_user.save(); // storing user in database
      res.status(201).json({ message: "user registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

//  ------------------------------- Login user route ------------------------------------ //

router.post("/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Plz Filled the data" });
    }
    const userLogin = await user.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credential" });
      } else {
        token = await userLogin.generateAuthtoken();
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 5184000),
          httpOnly: true,
        });
        res.json({ message: "user login successfully" });
      }
    } else {
      res.status(404).json({ error: "Invalid Credential" });
    }
  } catch (err) {
    console.log(err);
  }
});

// <-------------------------- get all users for admin --------------------->

router.get("/admin/getdatauser", authenticateuser, async (req, res) => {
  try {
    const result = await user.find();
    res.status(201).json({ data: result });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
