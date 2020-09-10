// Merge Sort  --  mergerSort() is called
// Recursive -- coloring and sound IGNORED

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
  //   for (i = 0; i < n1; i++) L[i] = ara[l + i];
  //   for (j = 0; j < n2; j++) R[j] = ara[m + 1 + j];
  //   i = 0;
  //   j = 0;
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
  //   while (i < n1) {
  //     ara[k] = L[i];
  //     i++;
  //     k++;
  //   }
  //   while (j < n2) {
  //     ara[k] = R[j];
  //     j++;
  //     k++;
  //   }
  // }
  // async function mergeDivide(l, r) {
  //   l = parseInt(l);
  //   r = parseInt(r);
  //   if (l < r) {
  //     let m = l + (r - l) / 2;
  //     await mergeDivide(l, m);
  //     await mergeDivide(m + 1, r);
  //     await merge(l, m, r);
  //   }
  // }
  // async function mergeSort() {
  //   // Updating State
  //   flag = false;
  //   await mergeDivide(0, size - 1);
  //   // Updating State
  //   if (!flag) chart.update(0);
  //   startOsc(false); // Stop Sound
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

        // Set Working Bars' Color ///////////////////
        setBarColors(m);
        setSound(m); // Set Sound Frequency

        if (flag) break;
        await removeColor();
      }
    }
  }

  // Updating State
  startOsc(false);
  colors.fill("rgba(253, 65, 60, 0.8)", 0);
  if (!flag) chart.update();
  flag = true;
}
