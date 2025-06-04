const User = require('../MODELS/login.model');

// Login: Check if email and password match a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login request:', req.body);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the password matches (plain-text comparison)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Success
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { loginUser };
