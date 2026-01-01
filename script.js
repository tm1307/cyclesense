let cycleData = JSON.parse(localStorage.getItem("cycleData")) || [];

const form = document.getElementById("cycleForm");
const insightText = document.getElementById("insightText");
const guidanceList = document.getElementById("guidanceList");
const ctx = document.getElementById("cycleChart").getContext("2d");

let chart;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const entry = {
    cycleLength: Number(cycleLength.value),
    periodDays: Number(periodDays.value),
    painLevel: Number(painLevel.value),
    energyLevel: Number(energyLevel.value),
  };

  cycleData.push(entry);
  localStorage.setItem("cycleData", JSON.stringify(cycleData));

  form.reset();
  generateInsights();
  generateGuidance(entry);
  drawChart();
});

function generateInsights() {
  if (cycleData.length < 2) return;

  const avg =
    cycleData.reduce((s, e) => s + e.cycleLength, 0) / cycleData.length;

  const last = cycleData.at(-1);
  const prev = cycleData.at(-2);

  let msg = `Average cycle length: ${avg.toFixed(1)} days. `;

  if (last.painLevel > prev.painLevel) {
    msg += "Pain levels have increased recently.";
  } else if (last.painLevel < prev.painLevel) {
    msg += "Pain levels appear to be easing.";
  } else {
    msg += "Pain levels appear stable.";
  }

  insightText.textContent = msg;
}

function generateGuidance(entry) {
  guidanceList.innerHTML = "";

  if (entry.painLevel >= 4) {
    add("Warm compresses or heating pads may help ease cramps.");
    add("Gentle stretching or slow walks can be supportive.");
    add("Hydration and warm, nourishing foods may help comfort.");
    add("If pain regularly disrupts daily life, professional guidance can be helpful.");
  }

  if (entry.painLevel >= 3 || entry.energyLevel <= 2) {
    add("Short work blocks and reduced multitasking may help conserve energy.");
    add("Calming breathing or grounding practices can support regulation.");
  }

  if (entry.energyLevel <= 2) {
    add("Prioritizing lighter tasks and postponing demanding work may be beneficial.");
  }

  add("Some people choose to limit excessive caffeine or high-stimulation social media during discomfort.");
}

function add(text) {
  const li = document.createElement("li");
  li.textContent = text;
  guidanceList.appendChild(li);
}

function drawChart() {
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: cycleData.map((_, i) => `Entry ${i + 1}`),
      datasets: [{
        label: "Cycle Length (days)",
        data: cycleData.map(e => e.cycleLength),
        borderColor: "#4a6cf7",
        tension: 0.3,
        fill: false
      }]
    }
  });
}

generateInsights();
drawChart();
