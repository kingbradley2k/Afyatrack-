// frontend/js/supervisor.js
const API_BASE = window.location.origin + '/api';
function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  };
}

// Utility: load CHVs (users with role CHV)
async function loadChvs() {
  // we don't have a users endpoint in this scaffold; fetch users via /api/auth maybe not available.
  // For now query supabase via new endpoint would be ideal. We'll try a generic endpoint:
  try {
    const res = await fetch(`${API_BASE}/auth/list-chvs`, { headers: authHeaders() });
    if (!res.ok) return [];
    const { chvs } = await res.json();
    return chvs || [];
  } catch (err) {
    console.error('loadChvs error', err);
    return [];
  }
}

// Load households into selects
async function loadHouseholds(selectId = 'patient_household') {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">Loading...</option>';
  try {
    const res = await fetch(`${API_BASE}/supervisor/households`, { headers: authHeaders() });
    if (!res.ok) {
      sel.innerHTML = '<option value="">Failed to load</option>';
      return;
    }
    const { households } = await res.json();
    sel.innerHTML = '<option value="">-- Select household --</option>';
    households.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h.id;
      opt.textContent = `${h.household_code || h.id} — ${h.head_of_household || ''}`;
      sel.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
    sel.innerHTML = '<option value="">Error</option>';
  }
}

// Load patients into assign patient select
async function loadPatients(selectId = 'assign_patient') {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">Loading...</option>';
  try {
    const res = await fetch(`${API_BASE}/supervisor/patients`, { headers: authHeaders() });
    if (!res.ok) {
      sel.innerHTML = '<option value="">Failed to load</option>';
      return;
    }
    const { patients } = await res.json();
    sel.innerHTML = '<option value="">-- Select patient --</option>';
    patients.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.patient_name} — ${p.patient_code || ''}`;
      sel.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
    sel.innerHTML = '<option value="">Error</option>';
  }
}

// Create household
document.addEventListener('submit', async (e) => {
  if (e.target && e.target.id === 'householdRegisterForm') {
    e.preventDefault();
    const payload = {
      household_code: document.getElementById('household_code').value.trim(),
      head_of_household: document.getElementById('head_of_household').value.trim(),
      address: document.getElementById('address').value.trim(),
      notes: document.getElementById('household_notes').value.trim()
    };
    const res = await fetch(`${API_BASE}/supervisor/households`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    const out = document.getElementById('result');
    if (res.ok) {
      const { household } = await res.json();
      out.innerText = `Created ${household.household_code || household.id}`;
      // refresh selects
      loadHouseholds('patient_household');
      loadHouseholds('assign_household');
    } else {
      const err = await res.json();
      out.innerText = `Error: ${err.error || 'Failed'}`;
    }
  }
});

// Create patient
document.addEventListener('submit', async (e) => {
  if (e.target && e.target.id === 'patientRegisterForm') {
    e.preventDefault();
    const payload = {
      patient_code: document.getElementById('patient_code').value.trim(),
      patient_name: document.getElementById('patient_name').value.trim(),
      age: parseInt(document.getElementById('patient_age').value || 0),
      gender: document.getElementById('patient_gender').value,
      household_id: document.getElementById('patient_household').value,
      notes: document.getElementById('patient_notes').value.trim()
    };
    const res = await fetch(`${API_BASE}/supervisor/patients`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    const out = document.getElementById('resultPatient');
    if (res.ok) {
      const { patient } = await res.json();
      out.innerText = `Created ${patient.patient_name}`;
      loadPatients('assign_patient');
    } else {
      const err = await res.json();
      out.innerText = `Error: ${err.error || 'Failed'}`;
    }
  }
});

// Assign form
document.addEventListener('submit', async (e) => {
  if (e.target && e.target.id === 'assignForm') {
    e.preventDefault();
    const chvId = document.getElementById('assign_chv').value;
    const householdId = document.getElementById('assign_household').value || null;
    const patientId = document.getElementById('assign_patient').value || null;
    const out = document.getElementById('assignResult');

    if (!chvId) {
      out.innerText = 'Select a CHV';
      return;
    }

    try {
      let res;
      if (householdId) {
        res = await fetch(`${API_BASE}/supervisor/assign/household`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ chv_id: chvId, household_id: householdId })
        });
      }
      if (patientId) {
        res = await fetch(`${API_BASE}/supervisor/assign/patient`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ chv_id: chvId, patient_id: patientId })
        });
      }
      if (res && res.ok) {
        out.innerText = 'Assignment saved';
      } else {
        const err = res ? await res.json() : { error: 'No assignment performed' };
        out.innerText = `Error: ${err.error || 'Failed'}`;
      }
    } catch (err) {
      console.error(err);
      out.innerText = 'Network/error';
    }
  }
});

// View assignments page loader
async function loadAssignmentsPage() {
  const hhDiv = document.getElementById('hhAssignments');
  const ptDiv = document.getElementById('ptAssignments');
  if (!hhDiv || !ptDiv) return;

  const res = await fetch(`${API_BASE}/supervisor/assignments`, { headers: authHeaders() });
  if (!res.ok) {
    hhDiv.innerText = ptDiv.innerText = 'Failed to load';
    return;
  }
  const body = await res.json();

  // household assignments
  hhDiv.innerHTML = '';
  (body.household_assignments || []).forEach(a => {
    const h = a.households || a.household;
    const row = document.createElement('div');
    row.textContent = `CHV: ${a.chv_id} — Household: ${h ? (h.household_code || h.id) + ' / ' + (h.head_of_household || '') : a.household_id}`;
    hhDiv.appendChild(row);
  });

  ptDiv.innerHTML = '';
  (body.patient_assignments || []).forEach(a => {
    const p = a.patients || a.patient;
    const row = document.createElement('div');
    row.textContent = `CHV: ${a.chv_id} — Patient: ${p ? (p.patient_name || p.id) : a.patient_id}`;
    ptDiv.appendChild(row);
  });
}

// Helper: populate CHV select - uses a lightweight endpoint that lists CHVs (you'll need to add it server side)
async function populateChvSelect() {
  const sel = document.getElementById('assign_chv');
  const chvSel = document.getElementById('assign_chv');
  if (!sel) return;
  sel.innerHTML = '<option value="">Loading CHVs...</option>';
  try {
    const res = await fetch(`${API_BASE}/auth/list-chvs`, { headers: authHeaders() });
    if (!res.ok) { sel.innerHTML = '<option value="">No CHVs</option>'; return; }
    const { chvs } = await res.json();
    sel.innerHTML = '<option value="">-- Select CHV --</option>';
    chvs.forEach(c => {
      const o = document.createElement('option');
      o.value = c.id;
      o.textContent = c.full_name + ' (' + (c.email || c.phone || c.id) + ')';
      sel.appendChild(o);
    });
  } catch (err) {
    console.error('populateChvSelect', err);
    sel.innerHTML = '<option value="">Error</option>';
  }
}

// On pages load, auto-fill selects
document.addEventListener('DOMContentLoaded', () => {
  loadHouseholds('patient_household'); // for register patient
  loadHouseholds('assign_household');  // for assign page
  loadPatients('assign_patient');      // for assign page
  populateChvSelect();                 // requires /auth/list-chvs endpoint
  loadAssignmentsPage();               // if on assignments page
});
