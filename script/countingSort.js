async function countingSort() {
  flag = false;
  let ara2 = [];
  for (let i = 0; i < size; i++) ara2[i] = ara[i];

  let auxAra = [];
  for (let i = 0; i < k; i++) auxAra[i] = 0;
  for (let i = 0; i < size; i++) {
    auxAra[ara2[i]]++;

    // Set Working Bars' Color
    setBarColors(i);

    // Set Sound Freq
    setSound(i);

    if (flag) break;
    // Reset color
    await removeColor();
  }
  for (let i = 1; i < k; i++) auxAra[i] = auxAra[i] + auxAra[i - 1];

  //   let sortedAra = [];
  for (let i = size - 1; i >= 0; --i) {
    ara[auxAra[ara2[i]] - 1] = ara2[i];
    auxAra[ara2[i]]--;

    // // Set Working Bars' Color
    setBarColors(auxAra[ara[i]]);

    // Set Sound Freq
    setSound(i);

    if (flag) break;
    // Reset color
    await removeColor();
  }

  chart.update(0);

  // Updating State
  if (!flag) chart.update(0);
  startOsc(false); // Stop Sound
  flag = true; // Let the world know, that work is Done
}
