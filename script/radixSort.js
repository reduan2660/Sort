async function radixSort() {
  flag = false;

  let refAra = [];
  for (let i = 0; i < size; i++) refAra[i] = ara[i];

  // Get max
  let max = 0;
  for (let i = 0; i < size; i++) if (max < refAra[i]) max = refAra[i];

  let divider = 1;
  for (; max > 0; max = parseInt(max / 10)) {
    let auxAra = [];
    for (let i = 0; i < 10; i++) auxAra[i] = 0;

    for (let i = 0; i < size; i++) {
      let index = parseInt(refAra[i] / divider);
      index = parseInt(index % 10);

      auxAra[index]++;

      // Color and Sound
      setBarColors(i);
      setSound(i);
      if (flag) break;
      await removeColor();
      //   --------------   //
    }
    for (let i = 1; i < 10; i++) {
      auxAra[i] += auxAra[i - 1];
    }

    for (let i = size - 1; i >= 0; i--) {
      let index = parseInt(refAra[i] / divider);
      index = parseInt(index % 10);

      ara[auxAra[index] - 1] = refAra[i];
      auxAra[index]--;

      //  Color & Sound
      setBarColors(auxAra[ara[i]]);
      setSound(i);
      if (flag) break;
      await removeColor();
    }

    for (let i = 0; i < size; i++) refAra[i] = ara[i];
    divider = divider * 10;
  }

  chart.update(0);

  // Updating State
  if (!flag) chart.update(0);
  startOsc(false); // Stop Sound
  flag = true; // Let the world know, that work is Done
}
