"use strict";

var canvas;
var gl;
var program;

/******** VIEWS ********/
//use them to be able to change the view of the camera
var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var modelViewMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
var alpha = -7.09 + 0.9;
var beta = 0.2;
var radius = 1.0;
/******** END OF VIEWS ********/

/******** BOOLEANS ********/
var useAnimation = true;
var IsWalking = false;
/******** END OF BOOLEANS ********/

var vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),
];

/***** TORSO *****/
var torsoId = 0;
var torsoRotation = 90.0;
/***** HEAD *****/
var headId = 1;
var head1Id = 1;
var head2Id = 10;
var headUpperId = 12;
var ear1Id = 15;
var ear2Id = 18;

/***** LEGS *****/
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;

/***** GROUND *****/
var baseId = 11;

/***** SIZE OF ROBOT ELEMENTS *****/
//add sizing element?
/***** SIZE OF robot *****/
var robotWidth = 0.25;
var robotHeight = 0.4;

/***** SIZE OF TORSO *****/
var torsoHeight = 3.5;
var torsoWidth = 1;

/***** SIZE OF ARM/LEG *****/
var upperArmHeight = 1.0;
var lowerArmHeight = 1.0;
var upperArmWidth = 0.25;
var lowerArmWidth = 0.25;
var upperLegWidth = 0.25;
var lowerLegWidth = 0.25;
var lowerLegHeight = 1.0;
var upperLegHeight = 1.0;

/***** SIZE OF HEAD *****/
var headHeight = 0.7;
var headWidth = 0.5;
var upperHeadHeight = 1.1;
var upperHeadWidth = 0.7;

/***** SIZE OF GROUND *****/
var groundWidth = 10;

var numNodes = 20;
var c;

//legs
var leftLowerLegFlag = false;
var leftUpperLegFlag = false;

var rightLowerLegFlag = false;
var rightUpperLegFlag = false;

//arms
var leftLowerArmFlag = false;
var leftUpperArmFlag = false;

var rightLowerArmFlag = false;
var rightUpperArmFlag = false;
var cameraSize = 10;
var moveinXaxis = -cameraSize;
var moveinYaxis = 0.0;
//theta used for checking the rotation angle for object
var theta = [0, 0, 0, 0, 0, 0, 180, 0, 180, 0, 0, 0];

/**
 *
 * LIGHTS
 *
 */
var positionsArray = [];
var normalsArray = [];
var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
var materialShininess = 100.0;

var numVertices = 24;

var stack = [];

var figure = [];

for (var i = 0; i < numNodes; i++)
  figure[i] = createNode(null, null, null, null);

var textureBody;
var textureHead;

var texCoordsArray = [];
var pointsArray = [];

var texCoord = [vec2(0, 0), vec2(0, 1), vec2(1, 1), vec2(1, 0)];

function scale4(a, b, c) {
  var result = mat4();
  result[0][0] = a;
  result[1][1] = b;
  result[2][2] = c;
  return result;
}

function createNode(transform, render, sibling, child) {
  var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
  };
  return node;
}

function traverse(Id) {
  if (Id == null) return;
  stack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
  figure[Id].render();
  if (figure[Id].child != null) traverse(figure[Id].child);
  modelViewMatrix = stack.pop();
  if (figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function quad(a, b, c, d) {
  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[b]);
  var normal = cross(t1, t2);
  normal = vec3(normal);

  pointsArray.push(vertices[a]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[0]);
  pointsArray.push(vertices[b]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[1]);
  pointsArray.push(vertices[c]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[2]);
  pointsArray.push(vertices[d]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[3]);
}

function colorCube() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

function configureTexture(image) {
  textureBody = gl.createTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, textureBody);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_LINEAR
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.uniform1i(gl.getUniformLocation(program, "uTextureMapBody"), 0);

  textureHead = gl.createTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, textureBody);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_LINEAR
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.uniform1i(gl.getUniformLocation(program, "uTextureMapHead"), 0);
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
  animation();

  gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);

  for (i = 0; i < numNodes; i++) initNodes(i);
  render();
};

function clear() {
  walkorNot = 2;
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


//adding the elements of the object like nodes and connecting them like child parent
function initNodes(Id) {
  var m = mat4();

  switch (Id) {
    case torsoId:
      m = translate(moveinXaxis, 5 + moveinYaxis, 0);
      m = rotate(theta[torsoId], 0, 1, 0);
      figure[torsoId] = createNode(m, torso, baseId, headId);
      break;

    case headId:
    case head1Id:
    case head2Id:
      m = translate(0.0, torsoHeight + 0.5 * headHeight, 0.0);
      m = mult(m, rotate(theta[head1Id], 1, 0, 0));
      m = mult(m, rotate(theta[head2Id], 0, 1, 0));
      m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
      figure[headId] = createNode(m, head, leftUpperArmId, null);
      break;

    case leftUpperArmId:
      m = translate(-(torsoWidth + upperArmWidth), 0.9 * torsoHeight, 0.0);
      m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
      figure[leftUpperArmId] = createNode(
        m,
        leftUpperArm,
        rightUpperArmId,
        leftLowerArmId
      );
      break;

    case rightUpperArmId:
      m = translate(torsoWidth + upperArmWidth, 0.9 * torsoHeight, 0.0);
      m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
      figure[rightUpperArmId] = createNode(
        m,
        rightUpperArm,
        leftUpperLegId,
        rightLowerArmId
      );
      break;

    case leftUpperLegId:
      m = translate(-(torsoWidth + upperLegWidth), 0.1 * upperLegHeight, 0.0);
      m = mult(m, rotate(theta[leftUpperLegId], 1, 0, 0));
      figure[leftUpperLegId] = createNode(
        m,
        leftUpperLeg,
        rightUpperLegId,
        leftLowerLegId
      );
      break;

    case rightUpperLegId:
      m = translate(torsoWidth + upperLegWidth, 0.1 * upperLegHeight, 0.0);
      m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
      figure[rightUpperLegId] = createNode(
        m,
        rightUpperLeg,
        null,
        rightLowerLegId
      );
      break;

    case leftLowerArmId:
      m = translate(0.0, upperArmHeight, 0.0);
      m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
      figure[leftLowerArmId] = createNode(m, leftLowerArm, null, null);
      break;

    case rightLowerArmId:
      m = translate(0.0, upperArmHeight, 0.0);
      m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
      figure[rightLowerArmId] = createNode(m, rightLowerArm, null, null);
      break;

    case leftLowerLegId:
      m = translate(0.0, upperLegHeight, 0.0);
      m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
      figure[leftLowerLegId] = createNode(m, leftLowerLeg, null, null);
      break;

    case rightLowerLegId:
      m = translate(0.0, upperLegHeight, 0.0);
      m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
      figure[rightLowerLegId] = createNode(m, rightLowerLeg, null, null);
      break;

    case baseId:
      m = translate(1, -6.5, 2);
      m = mult(m, rotate(theta[baseId], 1, 0, 0));
      figure[baseId] = createNode(m, baseGround, null, null);
      break;
  }
}

function traverse(Id) {
  if (Id == null) return;
  stack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
  figure[Id].render();
  if (figure[Id].child != null) traverse(figure[Id].child);
  modelViewMatrix = stack.pop();
  if (figure[Id].sibling != null) traverse(figure[Id].sibling);
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

function torso() {
  var image = document.getElementById("texture");
  configureTexture(image);
  gl.uniform1i(gl.getUniformLocation(program, "bodyFlag"), true);
  gl.uniform1i(gl.getUniformLocation(program, "headFlag"), false);
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * torsoHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(torsoWidth, torsoHeight, torsoWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function head() {
  var image = document.getElementById("headTexture");
  configureTexture(image);
  gl.uniform1i(gl.getUniformLocation(program, "bodyFlag"), false);
  gl.uniform1i(gl.getUniformLocation(program, "headFlag"), true);
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(headWidth, headHeight, headWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftUpperArm() {
  gl.uniform1i(gl.getUniformLocation(program, "bodyFlag"), true);
  gl.uniform1i(gl.getUniformLocation(program, "headFlag"), false);
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.7, 0.5 * upperArmHeight, 0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperArmWidth, upperArmHeight, upperArmWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftLowerArm() {
  gl.uniform1i(gl.getUniformLocation(program, "bodyFlag"), true);
  gl.uniform1i(gl.getUniformLocation(program, "headFlag"), false);
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.7, 0.5 * lowerArmHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightUpperArm() {
  gl.uniform1i(gl.getUniformLocation(program, "bodyFlag"), true);
  gl.uniform1i(gl.getUniformLocation(program, "headFlag"), false);
  instanceMatrix = mult(
    modelViewMatrix,
    translate(-0.7, 0.5 * upperArmHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperArmWidth, upperArmHeight, upperArmWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightLowerArm() {
  gl.uniform1i(gl.getUniformLocation(program, "bodyFlag"), true);
  gl.uniform1i(gl.getUniformLocation(program, "headFlag"), false);
  instanceMatrix = mult(
    modelViewMatrix,
    translate(-0.7, 0.5 * lowerArmHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftUpperLeg() {
  gl.uniform1i(gl.getUniformLocation(program, "bodyFlag"), true);
  gl.uniform1i(gl.getUniformLocation(program, "headFlag"), false);
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.7, 0.5 * upperLegHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperLegWidth, upperLegHeight, upperLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftLowerLeg() {
  gl.uniform1i(gl.getUniformLocation(program, "bodyFlag"), true);
  gl.uniform1i(gl.getUniformLocation(program, "headFlag"), false);
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.7, 0.5 * lowerLegHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightUpperLeg() {
  gl.uniform1i(gl.getUniformLocation(program, "bodyFlag"), true);
  gl.uniform1i(gl.getUniformLocation(program, "headFlag"), false);
  instanceMatrix = mult(
    modelViewMatrix,
    translate(-0.7, 0.5 * upperLegHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperLegWidth, upperLegHeight, upperLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightLowerLeg() {
  gl.uniform1i(gl.getUniformLocation(program, "bodyFlag"), true);
  gl.uniform1i(gl.getUniformLocation(program, "headFlag"), false);
  instanceMatrix = mult(
    modelViewMatrix,
    translate(-0.7, 0.5 * lowerLegHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}


var walkorNot;
//check if 
function animation() {
  walkorNot = 0;
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
    walkCycle();
  }, 150);

  function walkCycle() {
    if (theta[leftUpperArmId] >= 100 && walkorNot == 0) {
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
        walkorNot = 1;
      }
    }

    if (theta[leftUpperArmId] <= 200 && walkorNot == 1) {
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
        walkorNot = 0;
      }
    }
  }
}
