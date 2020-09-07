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
      setBarColors(j, j - 1);

      // Set Sound Freq
      setSound(j);

      if (flag) break;
      // Reset Working Bars' Color
      await removeColor();
    }
  }

  // Updating State
  if (!flag) chart.update(0);
  startOsc(false); // Stop Sound
  flag = true; // Let the world know, that work is Done
}
