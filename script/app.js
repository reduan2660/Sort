const ctx = document.getElementById("myChart").getContext("2d");
const scrambleBtn = document.getElementById("scramble");
const startBtn = document.getElementById("start");
const muteBtn = document.getElementById("muteBtn");

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
// Mute Button Handler
function muteBtnHandler() {
  // If Already In Operation then Just Lower the Volume
  if (osc) {
    if (mute) {
      // Gain goes up
    } else {
      // Gain goes down
    }
  } else {
    if (mute) {
      mute = false;
    } else {
      mute = true;
    }
  }

  console.log("Mute ", mute);
}
// Audio Generator/ Controller
function startOsc(bool) {
  if (!mute) {
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
}

// Delay
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Update Dataset -- Error Unknown but solved -.-
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
  if (selectedDataset === "smallData") {
    ara = smallAra;
    speedMS = 100;
    freqMultiplyer = 25;
  }

  // if (smallAra.length > 20) location.reload(); // Handling Error -_-
  // Avoiding Error by removing undefined from array (Cause still unknown)
  ara = ara.filter(function (element) {
    return element !== undefined;
  });

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
  if (flag) {
    startOsc();
    flag = true; // Stops Whatever operation is going on
    colors.fill("rgba(253, 65, 60, 0.8)", 0); // Reset Coloring

    // Get User Input
    selectedAlgo = document.getElementById("algorithmSelection").value;

    // Update Chart
    updateDataset(selectedDataset);

    // Call Sorting Function according to user Input
    if (selectedAlgo === "bubble") bubbleSort();
    if (selectedAlgo === "insertion") insertionSort();
    if (selectedAlgo === "selection") selectionSort();
    if (selectedAlgo === "marge") mergeSort();
  }
}

// Scramble Array
function scrambleAra() {
  // Stops Sound
  if (!flag) startOsc(false);

  flag = true; // Stops Whatever operation is going on
  colors.fill("rgba(253, 65, 60, 0.8)", 0); // Reset Coloring of Bar

  // Update the Chart Based on User Input
  updateDataset();

  var currentIndex = ara.length - 1,
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

// Event Handlers
scrambleBtn.addEventListener("click", scrambleAra);
startBtn.addEventListener("click", startSorting);
// muteBtn.addEventListener("click", muteBtnHandler);

// onLoad
createChart();
