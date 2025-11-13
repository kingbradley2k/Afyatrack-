// ========== HANDLE HOUSEHOLD VISIT FORM ==========
const householdForm = document.getElementById("householdForm");

if (householdForm) {
  householdForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ✅ Updated field names to match your controller
    const data = {
      household_id: document.getElementById("householdId").value.trim(),        // ✅ Changed
      head_of_household: document.getElementById("householdHead").value.trim(), // ✅ Changed
      address: document.getElementById("address").value.trim(),
      date_of_visit: document.getElementById("visitDate").value,                // ✅ Changed
      visit_type: document.getElementById("visitType").value,                   // ✅ Changed
      notes: document.getElementById("notes").value.trim(),
    };

    // Basic validation
    if (!data.household_id || !data.head_of_household || !data.address) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/chv/household", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Household visit recorded successfully!");
        householdForm.reset();
      } else {
        const error = await response.json();
        alert("❌ Failed to record visit: " + error.message);
      }
    } catch (err) {
      console.error("Error submitting household visit:", err);
      alert("❌ Network or server error.");
    }
  });
}

// ========== HANDLE PATIENT VITALS FORM ==========
const vitalsForm = document.getElementById("vitalsForm");

if (vitalsForm) {
  vitalsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const symptomCheckboxes = document.querySelectorAll("#symptoms input[type='checkbox']:checked");
    const symptoms = Array.from(symptomCheckboxes).map(box => box.value);

    // ✅ Updated field names to match your controller
    const data = {
      patient_name: document.getElementById("patientName").value.trim(),  // ✅ Changed
      age: document.getElementById("age").value,
      gender: document.getElementById("gender").value,
      temperature: document.getElementById("temperature").value,
      pulse_rate: document.getElementById("pulse").value,                 // ✅ Changed
      symptoms,
      comments: document.getElementById("comments").value.trim(),
    };

    // Basic validation
    if (!data.patient_name || !data.age || !data.gender) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/chv/vitals", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Patient vitals submitted successfully!");
        vitalsForm.reset();
      } else {
        const error = await response.json();
        alert("❌ Failed to submit vitals: " + error.message);
      }
    } catch (err) {
      console.error("Error submitting patient vitals:", err);
      alert("❌ Network or server error.");
    }
  });
}