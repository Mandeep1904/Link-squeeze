// routes/auth.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Sign Up Route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Simple validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Sign In Route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    // Simple validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
  
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Check if passwords match
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, 'secret_key', { expiresIn: '1h' });
  
      // Send the token as a response
      res.status(200).json({ message: 'Logged in successfully', token });
  
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

export default router;
