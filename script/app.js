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

// Bubble Sort  -- Done

async function bubbleSort() {
  // Updating State
  flag = false;

  // Starting Sorting
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
      colors.fill("rgba(253, 65, 60, 0.8)", 0);
    }
  }
  // console.log(colors);
  if (!flag) chart.update(0);

  // Updating State
  // Stop Sound
  startOsc(false);
  flag = true; // Let the world know, that work is Done
}

// Selection Sort -- Done
async function selectionSort() {
  // Updating State
  flag = false;

  // Staring Sorting
  let prevMin = 10000,
    presentMin,
    minIndex;

  for (let i = 0; i < size - 1; i++) {
    presentMin = 10000;
    for (let j = i; j < size; j++) {
      presentMin = Math.min(presentMin, ara[j]);

      if (presentMin != prevMin) {
        minIndex = j;
        prevMin = presentMin;
      }
      ////////////////////////////////////////////////
      // Set Working Bars' Color
      colors[j] = "rgba(254, 188, 44, 1)";
      colors[minIndex] = "rgba(254, 188, 44, 1)";

      // Set Sound Freq
      osc.frequency.value = ara[j] * freqMultiplyer;
      if (flag) break;
      // Animation
      chart.update(speedMS);
      await sleep(speedMS);

      // Reset Working Bars' Color
      colors.fill("rgba(253, 65, 60, 0.8)", 0);
      ///////////////////////////////////////////////////
    }

    // insert into ara[i] the minimum value and shift upto minIndex of array right
    let temp = ara[minIndex];
    for (let j = minIndex; j > i; j--) ara[j] = ara[j - 1];
    ara[i] = temp;
  }
  if (!flag) chart.update(0);
  // Updating State
  // Stop Sound
  startOsc(false);
  flag = true; // Let the world know that work is Done
}

// Merge Sort
// Recursive --- Seems to N O T  W O R K

function RecursiveMergeSortIseHereRemoveFunctionToUse() {
  // async function merge(l, m, r) {
  //   l = parseInt(l);
  //   r = parseInt(r);
  //   m = parseInt(m);
  //   let i, j, k;
  //   let n1 = m - l + 1;
  //   let n2 = r - m;
  //   // Temp Array
  //   let L = [];
  //   let R = [];
  //   // Copy data to temp arrays
  //   for (i = 0; i < n1; i++) L[i] = ara[l + i];
  //   for (j = 0; j < n2; j++) R[j] = ara[m + 1 + j];
  //   /* Merge the temp arrays back into ara[l..r]*/
  //   i = 0; // Initial index of first subarray
  //   j = 0; // Initial index of second subarray
  //   k = l;
  //   while (i < n1 && j < n2) {
  //     if (L[i] <= R[j]) {
  //       ara[k] = L[i];
  //       i++;
  //     } else {
  //       ara[k] = R[j];
  //       j++;
  //     }
  //     k++;
  //   }
  //   // if (flag) return;
  //   /* Copy the remaining elements of L[], if there
  //    are any */
  //   while (i < n1) {
  //     ara[k] = L[i];
  //     i++;
  //     k++;
  //   }
  //   /* Copy the remaining elements of R[], if there
  //    are any */
  //   while (j < n2) {
  //     ara[k] = R[j];
  //     j++;
  //     k++;
  //   }
  //   chart.update(speedMS);
  //   await sleep(speedMS);
  //   colors.fill("rgba(253, 65, 60, 0.8)", 0);
  // }
  // function mergeDivide(l, r) {
  //   l = parseInt(l);
  //   r = parseInt(r);
  //   if (l < r) {
  //     let m = l + (r - l) / 2;
  //     mergeDivide(l, m);
  //     mergeDivide(m + 1, r);
  //     merge(l, m, r);
  //   }
  // }
  // function mergeSort() {
  //   // Updating State
  //   flag = false;
  //   mergeDivide(0, size - 1);
  //   console.log(ara);
  //   if (!flag) chart.update(0);
  //   // Updating State
  //   // Stop Sound
  //   startOsc(false);
  //   flag = true; // Let the world know that work is Done
  // }
}

// Non-Recursive -- Done -- Yellow Flickering in Line and Radar Graph
async function mergeSort() {
  // Updating State
  flag = false;

  // Starting sort
  let b = [];
  let rght, rend;
  let i, j, m, t;

  for (let k = 1; k < size; k *= 2) {
    for (let left = 0; left + k < size; left += k * 2) {
      rght = left + k;
      rend = rght + k;
      if (rend > size) rend = size;
      m = left;
      i = left;
      j = rght;
      while (i < rght && j < rend) {
        if (ara[i] <= ara[j]) {
          b[m] = ara[i];
          i++;
        } else {
          b[m] = ara[j];
          j++;
        }
        m++;
      }
      while (i < rght) {
        b[m] = ara[i];
        i++;
        m++;
      }
      while (j < rend) {
        b[m] = ara[j];
        j++;
        m++;
      }
      for (m = left; m < rend; m++) {
        ara[m] = b[m];

        ////////////////////////////////////////////////
        // Set Working Bars' Color
        colors[m] = "rgba(254, 188, 44, 1)";

        // Set Sound Freq
        osc.frequency.value = ara[m] * freqMultiplyer;

        if (flag) break;
        // Animation
        chart.update(speedMS);
        await sleep(speedMS);

        // Reset Working Bars' Color
        colors.fill("rgba(253, 65, 60, 0.8)", 0);

        ///////////////////////////////////////////////////
      }
    }
  }

  // Updating State
  startOsc(false);
  colors.fill("rgba(253, 65, 60, 0.8)", 0);
  if (!flag) chart.update();
  flag = true;
}
// Event Handlers
scrambleBtn.addEventListener("click", scrambleAra);
startBtn.addEventListener("click", startSorting);
// datasetBtn.addEventListener("click", datasetChange);

// onLoad
createChart();
