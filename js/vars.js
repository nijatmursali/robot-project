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

/***** TAIL *****/
var tailId = 11;

/***** GROUND *****/
var baseId = 13;

/***** SIZE OF ROBOT ELEMENTS *****/
//add sizing element?
/***** SIZE OF TAIL *****/
var tailWidth = 0.25;
var tailHeight = 0.4;

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
var ear1Height = 1.1;
var ear1Width = 0.7;
var ear2Height = 1.1;
var ear2Width = 0.7;

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
var cameraSize = 15;
var moveinXaxis = -cameraSize;
var moveinYaxis = 0.0;
//theta used for checking the rotation angle for object
var theta = [
  90,
  90,
  90,
  0,
  90,
  0,
  90, // leg which one lol
  0,
  90,
  0,
  0,
  180,
  90,
  0,
  0,
  0,
  0,
  90,
  90,
  90,
];

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
