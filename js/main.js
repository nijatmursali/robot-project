function initNodes(Id) {
  var m = mat4();

  switch (Id) {
    case torsoId:
      m = translate(moveinXaxis, 5 + moveinYaxis, 0);
      m = mult(m, rotate(theta[torsoId], 0, 1, 0));
      m = mult(m, rotate(torsoRotation, 1, 0, 0));
      figure[torsoId] = createNode(m, torso, baseId, headId);
      break;

    case headId:
    case head1Id:
    case head2Id:
      m = translate(
        0.0,
        torsoHeight * 0.8 + headHeight * 0.82,
        -headWidth * 0.55
      );
      m = mult(m, rotate(theta[head1Id], 1, 0, 0));
      m = mult(m, rotate(theta[head2Id], 0, 1, 0));
      m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
      figure[headId] = createNode(m, head, tailId, headUpperId);
      break;
    case headUpperId:
      m = translate(
        0.0,
        -torsoHeight + upperHeadHeight * 2.6,
        upperHeadWidth * 0.5
      );
      m = mult(m, rotate(theta[headUpperId], 1, 0, 0));
      m = mult(m, rotate(theta[head2Id], 0, 1, 0));
      m = mult(m, translate(0.0, -0.9 * upperHeadHeight, -0.4));
      figure[headUpperId] = createNode(m, headUpper, null, null);
      break;

    // case ear1Id:
    //   m = translate(
    //     0.0,
    //     -torsoHeight + upperHeadHeight * 2,
    //     upperHeadWidth * 0.5
    //   );
    //   m = mult(m, rotate(theta[ear1Id], 1, 0, 0));
    //   m = mult(m, rotate(theta[ear1Id], 0, 1, 0));
    //   m = mult(m, translate(0.0, -0.5 * upperHeadHeight, 0.0));
    //   figure[ear1Id] = createNode(m, ears1, null, ear2Id);
    //   break;

    // case ear2Id:
    //   m = translate(
    //     0.0,
    //     -torsoHeight + upperHeadHeight * 2,
    //     upperHeadWidth * 0.5
    //   );
    //   m = mult(m, rotate(theta[ear2Id], 1, 0, 0));
    //   m = mult(m, rotate(theta[ear2Id], 3, 1, 0));
    //   m = mult(m, translate(0.0, -0.7 * upperHeadHeight, 1.0));
    //   figure[ear2Id] = createNode(m, ears2, null, null);
    //   break;

    case tailId:
      m = translate(
        -(torsoWidth * 0.5 - tailWidth * 2),
        2.6 * tailHeight - torsoWidth,
        -torsoHeight * 0.1
      );
      m = mult(m, rotate(theta[tailId], 1, 0, 0));
      figure[tailId] = createNode(m, tail, leftUpperArmId, null);
      break;

    //legs
    case leftUpperLegId:
      m = translate((torsoWidth + upperLegWidth) * 0.5, 0.1 * torsoHeight, 0.0);
      m = mult(m, rotate(theta[leftUpperLegId], 1, 0, 0));
      figure[leftUpperLegId] = createNode(
        m,
        leftUpperLeg,
        rightUpperLegId,
        leftLowerLegId
      );
      break;

    case leftLowerLegId:
      m = translate(0.0, upperLegHeight, 0.0);
      m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
      figure[leftLowerLegId] = createNode(m, leftLowerLeg, null, null);
      break;
    case rightUpperLegId:
      m = translate(
        -(torsoWidth + upperLegWidth) * 0.5,
        0.1 * torsoHeight,
        0.0
      );
      m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
      figure[rightUpperLegId] = createNode(
        m,
        rightUpperLeg,
        null,
        rightLowerLegId
      );
      break;

    case rightLowerLegId:
      m = translate(0.0, upperLegHeight, 0.0);
      m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
      figure[rightLowerLegId] = createNode(m, rightLowerLeg, null, null);
      break;

    //arms
    case leftUpperArmId:
      m = translate((torsoWidth + upperArmWidth) * 0.5, 0.8 * torsoHeight, 0.0);
      m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
      figure[leftUpperArmId] = createNode(
        m,
        leftUpperArm,
        rightUpperArmId,
        leftLowerArmId
      );
      break;
    case leftLowerArmId:
      m = translate(0.0, upperArmHeight, 0.0);
      m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
      figure[leftLowerArmId] = createNode(m, leftLowerArm, null, null);
      break;

    case rightUpperArmId:
      m = translate(
        -(torsoWidth + upperArmWidth) * 0.5,
        0.8 * torsoHeight,
        0.0
      );
      m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
      figure[rightUpperArmId] = createNode(
        m,
        rightUpperArm,
        leftUpperLegId,
        rightLowerArmId
      );
      break;

    case rightLowerArmId:
      m = translate(0.0, upperArmHeight, 0.0);
      m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
      figure[rightLowerArmId] = createNode(m, rightLowerArm, null, null);
      break;

    case baseId:
      m = translate(1, -2.15, 2);
      m = mult(m, rotate(theta[baseId], 1, 0, 0));
      figure[baseId] = createNode(m, baseGround, null, null);
      break;
  }
}

function tail() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.2 * tailHeight, 0.0));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(tailWidth * 0, tailHeight * 0.0, 0)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function torso() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * torsoHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(torsoWidth * 1.1, torsoHeight * 0.4, torsoWidth * 2.1)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) {
    gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
}

function headUpper() {
  // bash
  instanceMatrix = mult(modelViewMatrix, translate(0, 3, -1));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperHeadWidth * 1, upperHeadHeight * 1.0, upperHeadWidth * 1.5)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function head() {
  // neck / boyun
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0, 3.9 * (headHeight - torsoWidth), -1.6)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(headWidth, headHeight, headWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftUpperArm() {
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), true);
  instanceMatrix = mult(modelViewMatrix, translate(-1, -0.6, -0.7));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperArmWidth, upperArmHeight * 0.3, upperArmWidth * 3)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), false);
}

function leftLowerArm() {
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), true);
  instanceMatrix = mult(modelViewMatrix, translate(-1, -1.6, 0.05));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerArmWidth, lowerArmHeight * 0.3, lowerArmWidth * 3)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), false);
}

function rightUpperArm() {
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), true);
  instanceMatrix = mult(modelViewMatrix, translate(1, -0.6, -0.7));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperArmWidth, upperArmHeight * 0.3, upperArmWidth * 3)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), false);
}

function rightLowerArm() {
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), true);
  instanceMatrix = mult(modelViewMatrix, translate(1, -1.6, 0));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerArmWidth, lowerArmHeight * 0.3, lowerArmWidth * 3)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), false);
}

function leftUpperLeg() {
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), true);
  instanceMatrix = mult(modelViewMatrix, translate(-0.9, 1.2, 1.6));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperLegWidth, upperLegHeight * 0.6, upperLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), false);
}

function leftLowerLeg() {
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), true);
  instanceMatrix = mult(modelViewMatrix, translate(-0.9, 0.8, 1.6));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerLegWidth, lowerLegHeight * 0.6, lowerLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), false);
}

function rightUpperLeg() {
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), true);
  instanceMatrix = mult(modelViewMatrix, translate(1.0, 1.2, 1.6));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperLegWidth, upperLegHeight * 0.6, upperLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), false);
}

function rightLowerLeg() {
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), true);
  instanceMatrix = mult(modelViewMatrix, translate(1.0, 0.8, 1.6));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerLegWidth, lowerLegHeight * 0.6, lowerLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  gl.uniform1i(gl.getUniformLocation(program, "handFlag"), false);
}

function baseGround() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 4.8, -1.8)); // change here
  instanceMatrix = mult(
    instanceMatrix,
    scale4(groundWidth + 25, 0.5, groundWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("WebGL 2.0 isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");

  gl.useProgram(program);

  instanceMatrix = mat4();

  projectionMatrix = ortho(
    -cameraSize,
    cameraSize,
    -cameraSize,
    cameraSize,
    -cameraSize,
    cameraSize
  );
  modelViewMatrix = mat4();

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "modelViewMatrix"),
    false,
    flatten(modelViewMatrix)
  );
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "projectionMatrix"),
    false,
    flatten(projectionMatrix)
  );

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

  colorCube();

  var nBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

  var normalLoc = gl.getAttribLocation(program, "aNormal");
  gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(normalLoc);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var tBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

  var ambientProduct = mult(lightAmbient, materialAmbient);
  var diffuseProduct = mult(lightDiffuse, materialDiffuse);
  var specularProduct = mult(lightSpecular, materialSpecular);

  /* BUFFER FOR TEXTURES */
  var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texCoordLoc);

  document.getElementById("increaseAlpha").onclick = function (event) {
    alpha += 1.5;
    console.log(alpha);
  };
  document.getElementById("decreaseAlpha").onclick = function (event) {
    alpha -= 1.5;
    console.log(alpha);
  };

  gl.uniform4fv(
    gl.getUniformLocation(program, "uAmbientProduct"),
    ambientProduct
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "uDiffuseProduct"),
    diffuseProduct
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "uSpecularProduct"),
    specularProduct
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "uLightPosition"),
    lightPosition
  );

  gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);

  for (i = 0; i < numNodes; i++) initNodes(i);
  render();
};

var render = function () {
  if (useAnimation) {
    if (moveinXaxis <= 7.0) {
      animate();
      moveinXaxis += 0.07;
    }
  }

  for (i = 0; i < numNodes; i++) initNodes(i);
  eye = vec3(
    radius * Math.sin(alpha),
    radius * Math.sin(beta),
    radius * Math.cos(alpha)
  );
  modelViewMatrix = lookAt(eye, at, up);
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "modelViewMatrix"),
    false,
    flatten(modelViewMatrix)
  );
  gl.clear(gl.COLOR_BUFFER_BIT);
  traverse(torsoId);
  requestAnimationFrame(render);
};
