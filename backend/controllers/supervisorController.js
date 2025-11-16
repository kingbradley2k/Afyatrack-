// backend/controllers/supervisorController.js
const supabase = require('../config/supabase');

// simple role check: update according to your auth token contents (we put role in token during login)
function requireSupervisorOrAdmin(req) {
  const role = req.user && req.user.role;
  return role === 'Supervisor' || role === 'Admin';
}

module.exports = {
  // Create household
  createHousehold: async (req, res) => {
    try {
      if (!requireSupervisorOrAdmin(req)) return res.status(403).json({ error: 'Forbidden' });

      const { household_code, head_of_household, address, notes } = req.body;
      const created_by = req.user.userId;

      const { data, error } = await supabase
        .from('households')
        .insert([{ household_code, head_of_household, address, notes, created_by }])
        .select('*')
        .single();

      if (error) return res.status(400).json({ error: error.message });
      res.json({ household: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // List all households
  listHouseholds: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('households')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return res.status(400).json({ error: error.message });
      res.json({ households: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Create patient
  createPatient: async (req, res) => {
    try {
      if (!requireSupervisorOrAdmin(req)) return res.status(403).json({ error: 'Forbidden' });

      const { patient_code, patient_name, age, gender, household_id, notes } = req.body;
      const created_by = req.user.userId;

      const { data, error } = await supabase
        .from('patients')
        .insert([{ patient_code, patient_name, age, gender, household_id, notes, created_by }])
        .select('*')
        .single();

      if (error) return res.status(400).json({ error: error.message });
      res.json({ patient: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // List all patients (optionally filter by household via query ?household_id=)
  listPatients: async (req, res) => {
    try {
      const { household_id } = req.query;
      let query = supabase.from('patients').select('*').order('created_at', { ascending: false });
      if (household_id) query = query.eq('household_id', household_id);
      const { data, error } = await query;
      if (error) return res.status(400).json({ error: error.message });
      res.json({ patients: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Assign household to CHV
  assignHouseholdToChv: async (req, res) => {
    try {
      if (!requireSupervisorOrAdmin(req)) return res.status(403).json({ error: 'Forbidden' });

      const { chv_id, household_id } = req.body;
      if (!chv_id || !household_id) return res.status(400).json({ error: 'Missing chv_id or household_id' });

      const { data, error } = await supabase
        .from('chv_household_assignments')
        .upsert([{ chv_id, household_id }], { onConflict: ['chv_id', 'household_id'] })
        .select('*');

      if (error) return res.status(400).json({ error: error.message });
      res.json({ assignment: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Assign patient to CHV
  assignPatientToChv: async (req, res) => {
    try {
      if (!requireSupervisorOrAdmin(req)) return res.status(403).json({ error: 'Forbidden' });

      const { chv_id, patient_id } = req.body;
      if (!chv_id || !patient_id) return res.status(400).json({ error: 'Missing chv_id or patient_id' });

      const { data, error } = await supabase
        .from('chv_patient_assignments')
        .upsert([{ chv_id, patient_id }], { onConflict: ['chv_id', 'patient_id'] })
        .select('*');

      if (error) return res.status(400).json({ error: error.message });
      res.json({ assignment: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // List all assignments (household + patient) — joined info
  listAssignments: async (req, res) => {
    try {
      // households assignments
      const { data: hhData, error: hhError } = await supabase
        .from('chv_household_assignments')
        .select('chv_id, household_id, assigned_at, households(*)');

      if (hhError) return res.status(400).json({ error: hhError.message });

      // patient assignments
      const { data: pData, error: pError } = await supabase
        .from('chv_patient_assignments')
        .select('chv_id, patient_id, assigned_at, patients(*)');

      if (pError) return res.status(400).json({ error: pError.message });

      res.json({ household_assignments: hhData, patient_assignments: pData });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // list households assigned to specific chv
  listHouseholdsForChv: async (req, res) => {
    try {
      const chvId = req.params.chvId;
      const { data, error } = await supabase
        .from('chv_household_assignments')
        .select('household_id, households(*)')
        .eq('chv_id', chvId);

      if (error) return res.status(400).json({ error: error.message });
      const list = data.map(r => r.households);
      res.json({ households: list });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // list patients assigned to specific chv
  listPatientsForChv: async (req, res) => {
    try {
      const chvId = req.params.chvId;
      const { data, error } = await supabase
        .from('chv_patient_assignments')
        .select('patient_id, patients(*)')
        .eq('chv_id', chvId);

      if (error) return res.status(400).json({ error: error.message });
      const list = data.map(r => r.patients);
      res.json({ patients: list });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};
