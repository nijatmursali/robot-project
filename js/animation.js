function animate() {
  console.log("Left upper leg is: ", theta[leftUpperLegId]);
  console.log("Left lower leg is: ", theta[leftLowerLegId]);

  //moving left lower leg
  if (theta[leftUpperLegId] <= 70) {
    leftUpperLegFlag = false;
  } else if (theta[leftUpperLegId] >= 90) {
    leftUpperLegFlag = true;
  }
  if (leftUpperLegFlag) {
    theta[leftUpperLegId] -= 0.1;
    theta[leftLowerLegId] += 0.03;
  } else {
    theta[leftUpperLegId] += 0.1;
    theta[leftLowerLegId] -= 0.03;
  }
  //right
}
