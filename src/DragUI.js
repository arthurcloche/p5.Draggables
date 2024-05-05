/*
p5.draggables prototype
@arthurcloche may 2024
Controls

CLICK to select a group
CLICK outside to unselect
CLICK + DRAG to move a point on a selected group
CLICK + SHIFT when group is selected to add a point
CLICK + ALT on a point when a group is selected will remove the point, groups with < 3 elements will be removed 
CLICK + SHIFT + R when a group is selected but no hovering a point to make the group a contour group
CLICK + SHIFT when no group are selected will create a new group with 4 nodes
*/

function DragUI() {
  this.groups = [];

  this.deselectAll = () => {
    this.groups.forEach((set) => set.deselect());
  };

  this.addGroup = (points = [], isContour = false) => {
    const group = new Draggables(this);
    if (points.length === 0) {
      group.addDraggable(mouseX - 50, mouseY - 50);
      group.addDraggable(mouseX + 50, mouseY - 50);
      group.addDraggable(mouseX + 50, mouseY + 50);
      group.addDraggable(mouseX - 50, mouseY + 50);
    } else {
      points.forEach(([x, y]) => {
        group.addDraggable(x, y);
      });
    }
    if (isContour) group.toggleContour();
    this.groups.push(group);
    group.selectGroup();
  };

  this.drawGroups = () => {
    let shapeStarted = false;
    for (let group of this.groups) {
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
      group.getPoints().forEach((pt) => vertex(pt.x, pt.y));
      if (group.isContour) {
        endContour(CLOSE);
      }
    }
    if (shapeStarted) {
      endShape(CLOSE);
    }

    this.groups.forEach((group) => group.display());
  };

  this.handleMousePressed = () => {
    let handled = this.groups.some((group) => group.handleMousePressed());
    console.log(handled);
    if (!handled) {
      this.deselectAll();
      if (keyIsDown(SHIFT)) this.addGroup();
    }
  };

  this.handleMouseDragged = () => {
    this.groups.forEach((group) => group.handleMouseDragged());
  };

  this.handleMouseReleased = () => {
    this.groups.forEach((group) => group.handleMouseReleased());
  };
}
