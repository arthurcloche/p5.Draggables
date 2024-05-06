let draggableSets;
let dragUI;

function showControls() {
  const controlsMessage = `
p5.draggables prototype
@arthurcloche, May 2024

--- Controls ---

• Click on a group to select it.
• Click outside any group to deselect.
• Click and drag a point to move it within a selected group.
• With a group selected, click + SHIFT to add a point.
• With a group selected, click + ALT on a point to remove it. Groups with fewer than 3 points will be deleted.
• With a group selected and not pointing at a node, click + SHIFT + R to toggle the group as a contour.
• With no group selected, click + SHIFT to create a new group with four nodes.
`;

  alert(controlsMessage);
}

const init = () => {
  const outside = [
    [250, 100],
    [400, 250],
    [250, 400],
    [100, 250],
  ];
  const inside = [
    [200, 200],
    [300, 200],
    [300, 300],
    [200, 300],
  ];
  dragUI = new DragUI();
  dragUI.addGroup(outside);
  dragUI.addGroup(inside, true);
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  init();
  resetButton = createButton("Reset");
  resetButton.mousePressed(init);
  resetButton.position(10, 10);

  exportButton = createButton("Make SVG");
  exportButton.mousePressed(() => {
    downloadSVG(dragUI.groups);
  });
  exportButton.position(10, 40);

  controlsButton = createButton("Show Controls");
  controlsButton.mousePressed(showControls);
  controlsButton.position(10, 70);
}

function draw() {
  background(20);
  const groups = dragUI.groups;

  push();

  for (let group of groups) {
    push();
    if (group.isContour) {
      fill(0);
    } else {
      fill(255);
    }
    beginShape();
    group.getPoints().forEach((pt) => vertex(pt.x, pt.y));
    endShape(CLOSE);
    pop();
  }
  pop();

  push();
  translate(width / 2, 0);

  for (let group of groups) {
    const hobbyPoints = createHobbyBezier(group.getPoints(), {
      tension: 1,
      cyclic: true,
    });
    push();
    if (group.isContour) {
      fill(0);
    } else {
      fill(255);
    }
    beginShape();
    vertex(group.getPoints()[0].x, group.getPoints()[0].y);
    hobbyPoints.forEach(({ startControl, endControl, point }) => {
      bezierVertex(
        startControl.x,
        startControl.y,
        endControl.x,
        endControl.y,
        point.x,
        point.y
      );
    });

    endShape(CLOSE);
    pop();
  }
  pop();
  dragUI.drawDraggables();
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
