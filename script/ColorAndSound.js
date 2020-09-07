function setBarColors(index1, index2, index3) {
  if (index1) colors[index1] = "rgba(254, 188, 44, 1)";
  if (index2) colors[index2] = "rgba(254, 188, 44, 1)";
  if (index3) colors[index3] = "rgba(254, 188, 44, 1)";
}

function setSound(index1, index2) {
  if (index1) osc.frequency.value = ara[index1] * freqMultiplyer;
  if (index2) osc.frequency.value = ara[index2] * freqMultiplyer;
}

async function removeColor() {
  chart.update(speedMS);
  await sleep(speedMS);

  // Reset Working Bars' Color
  colors.fill("rgba(253, 65, 60, 0.8)", 0);
}
