const ctx = document.getElementById("myChart").getContext("2d");
const scrambleBtn = document.getElementById("scramble");
const startBtn = document.getElementById("start");
const datasetBtn = document.getElementById("datasetSelection");

// User Input
let selectedAlgo = "bubble"; // Default
let selectedDataset = "regular"; // Default

// Data
let ara = smallAra; // Default
let size = ara.length;
let Labels = ara;
let speedMS = 10;

// Set Each Bar Color
let colors = new Array(size);
colors.fill("rgba(253, 65, 60, 0.8)", 0);

// Flag => If true, Stop what is doing, Start the new operation
let flag = false;

// Chart
let chart = new Chart(ctx, {
  type: "bar",

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

// Delay
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Update Dataset

function updateDataset() {}

// Start Soring -- Done
function startSorting() {
  flag = true; // Stops Whatever operation is going on
  colors.fill("rgba(253, 65, 60, 0.8)", 0); // Reset Coloring
  selectedAlgo = document.getElementById("algorithmSelection").value;
  selectedDataset = document.getElementById("datasetSelection").value;

  updateDataset(selectedDataset);

  if (selectedAlgo === "bubble") bubbleSort();
  if (selectedAlgo === "insertion") insertionSort();
}

// Scramble Array -- Done

function scrambleAra() {
  flag = true; // Stops Whatever operation is going on
  colors.fill("rgba(253, 65, 60, 0.8)", 0); // Reset Coloring of Bar
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

// Bubble Sort -- Done

async function bubbleSort() {
  flag = false;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - 1; j++) {
      if (ara[j] > ara[j + 1]) {
        let temp = ara[j];
        ara[j] = ara[j + 1];
        ara[j + 1] = temp;

        // Set Working Bars' Color
        colors[j] = "rgba(254, 188, 44, 1)";
        colors[j + 1] = "rgba(254, 188, 44, 1)";
      }
      if (flag) break;
      chart.update(0);
      await sleep(speedMS);

      // Reset Working Bars' Color
      colors.fill("rgba(253, 65, 60, 0.8)", 0);
    }
  }
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

      if (flag) break;
      chart.update(0);
      await sleep(speedMS);

      // Reset Working Bars' Color
      colors[j] = "rgba(253, 65, 60, 0.8)";
      colors[j - 1] = "rgba(253, 65, 60, 0.8)";
      // colors.fill("rgba(253, 65, 60, 0.8)", 0);
    }
  }
  // console.log(colors);
  if (!flag) chart.update(0);
}

// Event Handlers
scrambleBtn.addEventListener("click", scrambleAra);
startBtn.addEventListener("click", startSorting);
// datasetBtn.addEventListener("click", datasetChange);
