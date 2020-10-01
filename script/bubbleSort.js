async function bubbleSort() {
  // Updating State
  flag = false;

  // Starting Sorting
  let changing;
  for (let i = 0; i < size; i++) {
    changing = 0;
    for (let j = 0; j < size - i; j++) {
      if (ara[j] > ara[j + 1]) {
        changing++;

        let temp = ara[j];
        ara[j] = ara[j + 1];
        ara[j + 1] = temp;

        // Set Working Bars' Color
        setBarColors(j, j + 1);
      }

      // Set Sound Freq
      setSound(j);
      if (flag) break;
      await removeColor();
    }
    if (changing === 0) break;
  }

  for (let i = 0; i < size; i++) {
    // Color and Sound
    setBarColors(i);
    setSound(i);
    if (flag) break;
    await removeColor();
    //   --------------   //
  }

  // Updating State
  if (!flag) chart.update(0);
  startOsc(false); // Stop Sound
  flag = true; // Let the world know, that work is Done
}
