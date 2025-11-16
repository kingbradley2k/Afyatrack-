// ================= HOUSEHOLD FORM =================
const householdForm = document.getElementById("householdForm");

if (householdForm) {
  householdForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      household_id: document.getElementById("householdId").value.trim(),
      head_of_household: document.getElementById("householdHead").value.trim(),
      address: document.getElementById("address").value.trim(),
      date_of_visit: document.getElementById("visitDate").value,
      visit_type: document.getElementById("visitType").value,
      notes: document.getElementById("notes").value.trim(),
    };

    if (!data.household_id || !data.head_of_household || !data.address) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/chv/household", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Household visit recorded successfully!");
        householdForm.reset();
      } else {
        const error = await response.json();
        alert("❌ Failed: " + error.error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Network/server error.");
    }
  });
}

// ================= VITALS FORM =================
const vitalsForm = document.getElementById("vitalsForm");

if (vitalsForm) {
  vitalsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const symptomCheckboxes = document.querySelectorAll("#symptoms input[type='checkbox']:checked");
    const symptoms = Array.from(symptomCheckboxes).map(box => box.value);

    const data = {
      // use the selected patient's name
      patient_name: document.getElementById("patientSelect").value,
      age: document.getElementById("age")?.value || null,
      gender: document.getElementById("gender")?.value || null,
      temperature: document.getElementById("temperature").value,
      pulse_rate: document.getElementById("pulse").value,
      symptoms,
      comments: document.getElementById("comments").value.trim(),
    };

    if (!data.patient_name) {
      alert("Please select a patient.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/chv/vitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Patient vitals submitted successfully!");
        vitalsForm.reset();
      } else {
        const error = await response.json();
        alert("❌ Failed: " + error.error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Network/server error.");
    }
  });
}
