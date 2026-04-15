const params = new URLSearchParams(window.location.search);


const patient_id = params.get('patient_id');
// FETCH FULL PATIENT DETAILS
fetch(`http://localhost:3000/patient/${patient_id}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById('patientName').textContent = data.name;
    document.getElementById('patientRoom').textContent = "Room: " + data.room_number;
    document.getElementById('patientAge').textContent = "Age: " + data.age;
    document.getElementById('patientGender').textContent = "Gender: " + data.gender;
  });
  
const user_id = localStorage.getItem('user_id');

// ADD HEALTH RECORD
document.getElementById('healthForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const data = {
    patient_id: patient_id,
    user_id: user_id,
    date: document.getElementById('date').value,
    blood_pressure: document.getElementById('bpInput').value,
    sugar_level: document.getElementById('sugar').value,
    heart_rate: document.getElementById('hrInput').value,
    temperature: document.getElementById('tempInput').value,
    oxygen_level: document.getElementById('oxygenInput').value
  };

  fetch('http://localhost:3000/health', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(() => {
    alert("Record added");
    loadLatestVitals();
  });
});

// LOAD LATEST VITALS
function loadLatestVitals() {
  fetch(`http://localhost:3000/health/${patient_id}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const latest = data[0];

        document.getElementById('bpDisplay').textContent = latest.blood_pressure;
        document.getElementById('sugarDisplay').textContent = latest.sugar_level;
        document.getElementById('hrDisplay').textContent = latest.heart_rate;
        document.getElementById('tempDisplay').textContent = latest.temperature;
        document.getElementById('oxygenDisplay').textContent = latest.oxygen_level;

      }
    });
}

loadLatestVitals();

document.getElementById('historyBtn').addEventListener('click', () => {
  console.log("History clicked");

  const section = document.getElementById('historySection');
  section.classList.toggle('hidden');

  fetch(`http://localhost:3000/history/${patient_id}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('historySection');
      container.innerHTML = "<h2>Medical History</h2>";

      data.forEach(item => {
        const p = document.createElement('p');
        p.textContent = `${item.disease} - ${item.notes}`;
        container.appendChild(p);
      });
    });
});


document.getElementById('medicationBtn').addEventListener('click', () => {
  console.log("Medication clicked");

  const section = document.getElementById('medicationSection');
  section.classList.toggle('hidden');

  fetch(`http://localhost:3000/medication/${patient_id}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('medicationSection');
      container.innerHTML = "<h2>Medication</h2>";

      data.forEach(item => {
        const p = document.createElement('p');
        p.textContent = `${item.medicine_name} (${item.dosage}) - ${item.timing}`;
        container.appendChild(p);
      });
    });
});

const daysSelect = document.getElementById('daysSelect');
const metricSelect = document.getElementById('metricSelect');

let chart;

function loadGraph() {
  const days = daysSelect.value;
  const metric = metricSelect.value;

  fetch(`http://localhost:3000/health-history/${patient_id}?days=${days}`)
    .then(res => res.json())
    .then(data => {

      console.log("GRAPH DATA:", data);

      const filteredData = data.filter(d => d[metric] !== null && d[metric] !== 0);

      const labels = filteredData.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString();
      });

      const values = filteredData.map(d => d[metric]);


      if (chart) chart.destroy();

      const ctx = document.getElementById('healthChart').getContext('2d');

      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: metric.toUpperCase(),
            data: values,
            borderColor: "#16c5cb",
            backgroundColor: "#16c5cb",
            borderWidth: 2,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: "black"
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: "black"
              }
            },
            y: {
              ticks: {
                color: "black"
              }
            }
          }
        }
      });

    })
    .catch(err => console.error(err));
}


daysSelect.addEventListener('change', loadGraph);
metricSelect.addEventListener('change', loadGraph);

loadGraph();
