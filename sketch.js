let draggableSets;
let dragUI;

function setup() {
  createCanvas(800, 800);
  dragUI = new DragUI();
  const outside = [
    [100, 100],
    [600, 100],
    [600, 600],
    [100, 600],
  ];
  const inside = [
    [300, 300],
    [400, 300],
    [400, 400],
    [300, 400],
  ];

  dragUI.addGroup(outside);
  dragUI.addGroup(inside, true);
}

function draw() {
  background(220);
  dragUI.drawGroups();
}

function mousePressed() {
  dragUI.handleMousePressed();
}

function mouseDragged() {
  dragUI.handleMouseDragged();
}

function mouseReleased() {
  dragUI.handleMouseReleased();
}
