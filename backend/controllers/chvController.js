// controllers/chvController.js
const supabase = require('../config/supabase');

module.exports = {

  recordHousehold: async (req, res) => {
    try {
      const chv_id = req.user.userId;

      const {
        household_id,
        head_of_household,
        address,
        date_of_visit,
        visit_type,
        notes
      } = req.body;

      const { data, error } = await supabase
        .from('household_visits')
        .insert([
          {
            chv_id,
            household_id,
            head_of_household,
            address,
            date_of_visit,
            visit_type,
            notes
          }
        ])
        .select('*')
        .single();

      if (error) return res.status(400).json({ error: error.message });

      res.json({ visit: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  recordVitals: async (req, res) => {
    try {
      const chv_id = req.user.userId;

      const {
        patient_name,
        age,
        gender,
        temperature,
        pulse_rate,
        symptoms,
        comments
      } = req.body;

      const { data, error } = await supabase
        .from('patient_vitals')
        .insert([
          {
            chv_id,
            patient_name,
            age,
            gender,
            temperature,
            pulse_rate,
            symptoms,
            comments
          }
        ])
        .select('*')
        .single();

      if (error) return res.status(400).json({ error: error.message });

      res.json({ vitals: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  listHouseholds: async (req, res) => {
    try {
      const chv_id = req.user.userId;

      const { data, error } = await supabase
        .from('household_visits')
        .select('*')
        .eq('chv_id', chv_id)
        .order('created_at', { ascending: false });

      if (error) return res.status(400).json({ error: error.message });

      res.json({ visits: data });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  listVitals: async (req, res) => {
    try {
      const chv_id = req.user.userId;

      const { data, error } = await supabase
        .from('patient_vitals')
        .select('*')
        .eq('chv_id', chv_id)
        .order('created_at', { ascending: false });

      if (error) return res.status(400).json({ error: error.message });

      res.json({ vitals: data });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }

};
