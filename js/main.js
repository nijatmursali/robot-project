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
  document.getElementById("decreaseRadius").onclick = function (event) {
    radius -= 1.5;
  };
  document.getElementById("increaseRadius").onclick = function (event) {
    radius += 1.5;
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

  clear();
  walk();

  gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);

  for (i = 0; i < numNodes; i++) initNodes(i);
  render();
};

function clear() {
  walkSeq = 2;
}

var render = function () {
  moveinXaxis += 0.15;
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
