let draggableSets;
let dragUI;

const init = () => {
  const outside = [
    [100, 100],
    [400, 100],
    [400, 400],
    [100, 400],
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
  createCanvas(1200, 700);
  init();
  resetButton = createButton("Reset");
  resetButton.mousePressed(init);
  resetButton.position(10, 10);
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
  //   beginShape();
  //   const start = groups[0].getPoints()[0];
  //   vertex(start.x, start.y);
  //   hobbyPoints.forEach(({ startControl, endControl, point }) => {
  //     bezierVertex(
  //       startControl.x,
  //       startControl.y,
  //       endControl.x,
  //       endControl.y,
  //       point.x,
  //       point.y
  //     );
  //   });
  //   endShape();
  /*
  for (let group of groups) {
    const hobbyPoints = createHobbyBezier(group.getPoints(), {
      tension: 1,
      cyclic: true,
    });
    if (!shapeStarted || !group.isContour) {
      if (shapeStarted) {
        endShape(CLOSE);
      }
      beginShape();
      shapeStarted = true;
    }
    if (group.isContour) {
      beginContour();
    }
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
    if (group.isContour) {
      endContour(CLOSE);
    }
  }
  if (shapeStarted) {
    endShape(CLOSE);
  }
  */

  dragUI.drawDraggables();

  /*
    push();
		translate(width/2, 0);
		var hobbyPoints = createHobbyBezier(dragabble, { tension: 1, cyclic: true });
		beginShape();
		vertex(dragabble[0].x, dragabble[0].y);
		hobbyPoints.forEach(({ startControl, endControl, point }) => {
			bezierVertex(startControl.x, startControl.y, endControl.x, endControl.y, point.x, point.y);
		});
		endShape();
	pop();
    */
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
