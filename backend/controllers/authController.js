
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { Op } = require('sequelize');
const { User, UserRegistrationForm, sequelize } = require('../models');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const registerSchema = Joi.object({
        first_name: Joi.string().max(50).required(),
        last_name: Joi.string().max(50).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().max(20),
        password: Joi.string().min(6).required(),
        confirm_password: Joi.string().valid(Joi.ref('password')).required()
      });

      const { error } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { first_name, last_name, email, phone, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await User.create({
        first_name,
        last_name,
        email,
        phone,
        password: hashedPassword,
        active: true,
        created_on: new Date()
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      });

      const { error } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({
        where: { email, active: true },
        include: [{ model: UserRegistrationForm, as: 'profile' }]
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role || 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          role: user.role || 'user',
          profile: user.profile
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get current user
  getMe: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.userId, {
        include: [{ model: UserRegistrationForm, as: 'profile' }]
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          role: user.role || 'user',
          profile: user.profile
        }
      });
    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Logout user
  logout: async (req, res) => {
    try {
      // In a real application, you might want to blacklist the token
      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
,

  // Unique mobile checker
  uniqueMobile: async (req, res) => {
    try {
      const mobile = (req.query.mobile || '').trim();
      if (!mobile) return res.status(400).json({ message: 'mobile is required' });
      const exists = await User.findOne({ where: { phone: mobile } });
      res.json({ exists: !!exists });
    } catch (error) {
      console.error('uniqueMobile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  uniqueEmail: async (req, res) => {
    try {
      const email = (req.query.email || '').trim();
      if (!email) return res.status(400).json({ message: 'email is required' });
      const exists = await User.findOne({ where: { email } });
      res.json({ exists: !!exists });
    } catch (error) {
      console.error('uniqueEmail error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Registration metadata (countries, education, professions)
  registerMetadata: async (req, res) => {
    try {
      const { Country, Education, Profession } = require('../models');
      const countries = await Country.findAll({ order: [['name', 'ASC']] });
      const education = await Education.findAll({ order: [['education', 'ASC']] });
      const professions = await Profession.findAll({ order: [['profession', 'ASC']] });
      res.json({ countries, education, professions });
    } catch (error) {
      console.error('registerMetadata error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Step 1 registration: create user (mobile + password + full name)
  registerStep1: async (req, res) => {
    try {
      const schema = Joi.object({
        first_name: Joi.string().max(100).required(),
        country_code: Joi.string().max(6).required(),
        mobile_number: Joi.string().max(20).required(),
        password: Joi.string().min(6).required()
      });
      const { error } = schema.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });

      const { first_name, country_code, mobile_number, password } = req.body;
      // unique check
      const exists = await User.findOne({ where: { phone: mobile_number } });
      if (exists) return res.status(409).json({ message: 'Mobile number already exists' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        first_name,
        username: mobile_number,
        phone: mobile_number,
        password: hashedPassword,
        active: false,
        created_on: Math.floor(Date.now() / 1000)
      });

      res.status(201).json({ user_id: user.id, username: mobile_number });
    } catch (error) {
      console.error('registerStep1 error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Step 2 registration: complete profile and activate
  registerStep2: async (req, res) => {
    try {
      const schema = Joi.object({
        register_user_id: Joi.number().integer().required(),
        register_username: Joi.string().required(),
        register_password: Joi.string().required(),
        display_name: Joi.string().min(2).max(12).required(),
        email: Joi.string().email().required(),
        gender: Joi.string().valid('M','F','o').required(),
        marital: Joi.string().valid('Single','Married','Other').required(),
        from_date: Joi.string().required(),
        from_month: Joi.string().required(),
        from_year: Joi.string().required(),
        country: Joi.number().integer().required(),
        state: Joi.number().integer().required(),
        district: Joi.number().integer().required(),
        nationality: Joi.string().required(),
        education: Joi.string().required(),
        education_others: Joi.string().allow(''),
        profession: Joi.string().required(),
        work_others: Joi.string().allow('')
      });
      const { error } = schema.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });

      const {
        register_user_id,
        display_name,
        email,
        gender,
        marital,
        from_date, from_month, from_year,
        country, state, district,
        nationality,
        education, education_others,
        profession, work_others
      } = req.body;

      // ensure email unique for others
      const emailOwner = await User.findOne({ where: { email } });
      if (emailOwner && emailOwner.id !== Number(register_user_id)) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      const user = await User.findByPk(register_user_id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      await user.update({
        display_name,
        email,
        active: true
      });

      const dob = `${from_year}-${from_month}-${from_date}`;

      // Create or update registration form
      let profile = await UserRegistrationForm.findOne({ where: { user_id: user.id } });
      if (!profile) {
        profile = await UserRegistrationForm.create({
          user_id: user.id,
          full_name: user.first_name || user.display_name || 'User',
          mobile_number: user.phone,
          gender: gender === 'M' ? 'male' : (gender === 'F' ? 'female' : 'other'),
          date_of_birth: new Date(dob),
          country_id: country,
          state_id: state,
          district_id: district,
          occupation: profession === 'work_others' ? work_others : profession,
          address: null,
          pincode: null
        });
      } else {
        await profile.update({
          full_name: user.first_name || user.display_name || 'User',
          mobile_number: user.phone,
          gender: gender === 'M' ? 'male' : (gender === 'F' ? 'female' : 'other'),
          date_of_birth: new Date(dob),
          country_id: country,
          state_id: state,
          district_id: district,
          occupation: profession === 'work_others' ? work_others : profession
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role || 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Registration completed',
        token,
        user: {
          id: user.id,
          first_name: user.first_name,
          display_name: user.display_name,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('registerStep2 error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = authController;
