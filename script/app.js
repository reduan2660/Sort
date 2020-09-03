const ctx = document.getElementById("myChart").getContext("2d");
const scrambleBtn = document.getElementById("scramble");
const startBtn = document.getElementById("start");

const datasetBtn = document.getElementById("datasetSelection");

// User Input
let selectedAlgo = "bubble"; // Default
let selectedDataset = "regular"; // Default
let selectedType = "bar"; // Default
// Data
let ara = regularAra; // Default
let size = ara.length;
let Labels = ara;
let speedMS = 10;

// Set Each Bar Color
let colors = new Array(size);
colors.fill("rgba(253, 65, 60, 0.8)", 0);

// Flag => If true, Stop what is doing, Start the new operation
let flag = true;

// Setting up Audio
let mute = false;
let freqMultiplyer = 1;
let audioContext = new AudioContext();
let osc = null;

// Chart
let chart;
function createChart() {
  chart = new Chart(ctx, {
    type: selectedType,

    data: {
      labels: Labels,

      datasets: [
        {
          label: "Sorting",
          backgroundColor: colors,
          data: ara,
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: true,
            },
            ticks: {
              display: false,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
      },
    },
  });
}

// Audio Generator/ Controller
function startOsc(bool) {
  if (bool === undefined) bool = true;

  if (bool === true) {
    osc = audioContext.createOscillator();
    osc.frequency.value = 100;

    osc.start(audioContext.currentTime);
    osc.connect(audioContext.destination);
  } else {
    osc.stop(audioContext.currentTime);
    osc.disconnect(audioContext.destination);
    osc = null;
  }
}

// Delay
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Update Dataset
function updateDataset() {
  // update chart simply doesn't work if type is changed, so gotta destroy existing one
  chart.destroy();

  // Choosing dataset according to user Input
  selectedDataset = document.getElementById("datasetSelection").value;
  if (selectedDataset === "regular") {
    ara = regularAra;
    speedMS = 10;
    freqMultiplyer = 1;
  }
  if (selectedDataset === "large") {
    ara = largeAra;
    speedMS = 1;
    freqMultiplyer = 1;
  }
  if (selectedDataset === "small") {
    ara = smallAra;
    speedMS = 100;
    freqMultiplyer = 25;
  }

  // adjusting Chart Parameters
  size = ara.length;
  Labels = ara;
  colors = new Array(size);
  colors.fill("rgba(253, 65, 60, 0.8)", 0);

  // Choosing type before creating(overwriting a new Chart)
  selectedType = document.getElementById("typeSelection").value;

  // update chart simply doesn't work if type is changed
  createChart();
}

// Start Soring -- Done
function startSorting() {
  startOsc();
  flag = true; // Stops Whatever operation is going on
  colors.fill("rgba(253, 65, 60, 0.8)", 0); // Reset Coloring

  // Get User Input
  selectedAlgo = document.getElementById("algorithmSelection").value;

  // Update Chart
  updateDataset(selectedDataset);
  // Check User settings for mute here
  // Hide Button if not Muted
  if (!mute) {
    // take a look at logic here later
    startBtn.children[0].hidden = true;
    startBtn.children[1].hidden = true;
  }
  // Call Sorting Function according to user Input
  if (selectedAlgo === "bubble") bubbleSort();
  if (selectedAlgo === "insertion") insertionSort();
}

// Scramble Array
function scrambleAra() {
  // Show Start Button

  startBtn.children[0].hidden = false;
  startBtn.children[1].hidden = false;

  // Stops Sound
  console.log(flag);
  if (!flag) startOsc(false);
  flag = true; // Stops Whatever operation is going on
  colors.fill("rgba(253, 65, 60, 0.8)", 0); // Reset Coloring of Bar

  // Update the Chart Based on User Input
  updateDataset(selectedDataset);

  var currentIndex = ara.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = ara[currentIndex];
    ara[currentIndex] = ara[randomIndex];
    ara[randomIndex] = temporaryValue;
  }

  chart.update();
}

// Bubble Sort  -- Done

async function bubbleSort() {
  flag = false;
  let changing;
  for (let i = 0; i < size; i--) {
    changing = 0;
    for (let j = 0; j < size; j++) {
      if (ara[j] > ara[j + 1]) {
        changing++;

        let temp = ara[j];
        ara[j] = ara[j + 1];
        ara[j + 1] = temp;

        // Set Working Bars' Color
        colors[j] = "rgba(254, 188, 44, 1)";
        colors[j + 1] = "rgba(254, 188, 44, 1)";
      }

      // Set Sound Freq
      osc.frequency.value = ara[j] * freqMultiplyer;

      if (flag) break;
      chart.update(speedMS);
      await sleep(speedMS);

      // Reset Working Bars' Color
      colors.fill("rgba(253, 65, 60, 0.8)", 0);
    }
    if (changing === 0) break;
  }
  //  Stop Sound
  startOsc(false);
  flag = true; // Let the world know, that work is Done3
}

// Insertion Sort -- Done but Coloring may genjam

async function insertionSort() {
  flag = false;
  for (let i = 1; i < size; i++) {
    if (ara[i - 1] < ara[i]) continue;

    for (let j = i; j > 0; j--) {
      if (ara[j - 1] < ara[j]) continue;

      let temp = ara[j];
      ara[j] = ara[j - 1];
      ara[j - 1] = temp;

      // Set Working Bars' Color
      colors[j] = "rgba(254, 188, 44, 1)";
      colors[j - 1] = "rgba(254, 188, 44, 1)";

      // Set Sound Freq
      osc.frequency.value = ara[j] * freqMultiplyer;

      if (flag) break;
      // Animation
      chart.update(speedMS);
      await sleep(speedMS);

      // Reset Working Bars' Color
      colors[j] = "rgba(253, 65, 60, 0.8)";
      colors[j - 1] = "rgba(253, 65, 60, 0.8)";
      // colors.fill("rgba(253, 65, 60, 0.8)", 0);
    }
  }
  // console.log(colors);
  if (!flag) chart.update(0);

  // Stop Sound
  startOsc(false);
  flag = true; // Let the world know, that work is Done
}

// Event Handlers
scrambleBtn.addEventListener("click", scrambleAra);
startBtn.addEventListener("click", startSorting);
// datasetBtn.addEventListener("click", datasetChange);

// onLoad
createChart();
