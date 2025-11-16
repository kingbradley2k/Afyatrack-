// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

module.exports = {
  // REGISTER USER
  register: async (req, res) => {
    try {
      const { full_name, email, phone, password, role } = req.body;
      if (!password || (!email && !phone)) {
        return res.status(400).json({ error: 'Email or phone and password required' });
      }

      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

      const { data, error } = await supabase
        .from('users')
        .insert([{ full_name, email, phone, password_hash, role }])
        .select('id, full_name, email, phone, role')
        .single();

      if (error) return res.status(400).json({ error: error.message });

      const token = jwt.sign(
        { userId: data.id, role: data.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ user: data, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // LOGIN USER
  login: async (req, res) => {
    try {
      const { identifier, password } = req.body;
      if (!identifier || !password) {
        return res.status(400).json({ error: 'Identifier and password required' });
      }

      const { data: users, error } = await supabase
        .from('users')
        .select('id, full_name, email, phone, password_hash, role')
        .or(`email.eq.${identifier},phone.eq.${identifier}`)
        .limit(1);

      if (error) return res.status(400).json({ error: error.message });
      if (!users || users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

      const user = users[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      delete user.password_hash;

      res.json({ user, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // LIST CHVs
  listChvs: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, phone, role')
        .eq('role', 'CHV')
        .order('full_name', { ascending: true });

      if (error) return res.status(400).json({ error: error.message });

      res.json({ chvs: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};
