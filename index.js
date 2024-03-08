const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.1zcv0ls.mongodb.net/registerationFormDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Registration Schema
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);
console.log("MongoDB Model:", Registration);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Registration data received:", { name, email, password });

    console.log("Checking for existing user...");
    const existingUser = await Registration.findOne({ email: email });

    if (existingUser !== null) {
      console.log("User already registered!");
      return res.redirect("/error");
    }

    // If the user doesn't exist, proceed with registration
    console.log("Registering user...");
    const registrationData = new Registration({
      name: name,
      email: email,
      password: password,
    });

    // Save the new registration data
    await registrationData.save();
    console.log("User registered successfully!");
    res.redirect("/success");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/success.html");
});

app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/error.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
