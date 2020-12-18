var walkSeq;
function walk() {
  walkSeq = 0;
  theta[torsoId] = 70;
  initNodes(torsoId);
  theta[leftUpperArmId] = 160;
  initNodes(leftUpperArmId);
  theta[rightUpperArmId] = -160;
  initNodes(rightUpperArmId);
  theta[leftUpperLegId] = 170;
  initNodes(leftUpperLegId);
  theta[rightUpperLegId] = -170;
  initNodes(rightUpperLegId);
  setInterval(function () {
    walkLoop();
  }, 150);

  function walkLoop() {
    if (theta[leftUpperArmId] >= 100 && walkSeq == 0) {
      theta[leftUpperArmId] -= 10;
      initNodes(leftUpperArmId);
      theta[leftUpperLegId] += 10;
      initNodes(leftUpperLegId);
      theta[rightUpperArmId] += 10;
      initNodes(rightUpperArmId);
      theta[rightUpperLegId] -= 10;
      initNodes(rightUpperLegId);
      if (theta[leftUpperLegId] == 120) {
        theta[leftLowerLegId] = 20;
        initNodes(leftLowerLegId);
        theta[rightLowerLegId] = 20;
        initNodes(rightLowerLegId);
      }
      if (theta[leftUpperArmId] == 130) {
        walkSeq = 1;
      }
    }

    if (theta[leftUpperArmId] <= 200 && walkSeq == 1) {
      theta[leftUpperArmId] += 10;
      initNodes(leftUpperArmId);
      theta[leftUpperLegId] -= 10;
      initNodes(leftUpperLegId);
      theta[rightUpperArmId] -= 10;
      initNodes(rightUpperArmId);
      theta[rightUpperLegId] += 10;
      initNodes(rightUpperLegId);
      if (theta[leftUpperLegId] == 110) {
        theta[leftLowerLegId] = 0;
        initNodes(leftLowerLegId);
        theta[rightLowerLegId] = 0;
        initNodes(rightLowerLegId);
      }
      if (theta[leftUpperArmId] == 200) {
        walkSeq = 0;
      }
    }
  }
}
