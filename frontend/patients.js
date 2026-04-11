document.addEventListener("DOMContentLoaded", () => {

  console.log("JS loaded");

  const form = document.getElementById('patientForm');

  if (!form) {
    console.error("Form not found");
    return;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    console.log("Form submitted");

    const user_id = localStorage.getItem('user_id');

    const data = {
      name: document.getElementById('name').value,
      age: document.getElementById('age').value,
      gender: document.getElementById('gender').value,
      room_number: document.getElementById('room').value,
      emergency_contact: document.getElementById('contact').value,
      user_id: user_id
    };

    console.log("DATA:", data);

    fetch('http://localhost:3000/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(result => {
      console.log("Response:", result);
      alert('Patient added');
      loadPatients();
    })
    .catch(err => console.error("Fetch error:", err));
  });

 function loadPatients() {
  const user_id = localStorage.getItem('user_id');

  fetch(`http://localhost:3000/patients?user_id=${user_id}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('patientList');
      const dropdown = document.getElementById('selectedPatient');

      list.innerHTML = '';
      dropdown.innerHTML = '';

      data.forEach(p => {
        // Patient list
        const li = document.createElement('li');
        li.innerHTML = `
          <a href="patient-dashboard.html?patient_id=${p.patient_id}&name=${p.name}&room=${p.room_number}">
            ${p.name} (Room: ${p.room_number})
          </a>
        `;
        list.appendChild(li);

        // Dropdown
        const option = document.createElement('option');
        option.value = p.patient_id;
        option.textContent = `${p.name} (Room: ${p.room_number})`;
        dropdown.appendChild(option);
      });
    });
}

  loadPatients();
});

// ============================
// HISTORY FORM
// ============================
document.getElementById('historyForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const patient_id = document.getElementById('selectedPatient').value;

  const data = {
    patient_id: patient_id,
    disease: document.getElementById('disease').value,
    notes: document.getElementById('notes').value
  };

  fetch('http://localhost:3000/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(() => {
    alert("History added");
    document.getElementById('historyForm').reset();
  });
});


// ============================
// MEDICATION FORM
// ============================
document.getElementById('medicationForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const patient_id = document.getElementById('selectedPatient').value;

  const data = {
    patient_id: patient_id,
    medicine_name: document.getElementById('medicine').value,
    dosage: document.getElementById('dosage').value,
    timing: document.getElementById('timing').value
  };

  fetch('http://localhost:3000/medication', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(() => {
    alert("Medication added");
    document.getElementById('medicationForm').reset();
  });
});

