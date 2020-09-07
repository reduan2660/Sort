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

      // Set Working Bars' Color & Sound  ///////////////////////////
      setBarColors(j, minIndex);
      setSound(j); // Set Sound Freq

      if (flag) break;
      await removeColor();
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
