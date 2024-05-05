function Draggables(parent) {
  this.draggables = [];
  this.selected = false;
  this.isContour = false;
  this.parent = parent;

  this.addDraggable = (x, y) => {
    const index = this.findClosestIndex(x, y);
    this.draggables.splice(index + 1, 0, new Draggable(x, y, this));
  };

  this.findClosestIndex = (x, y) => {
    let closestIndex = -1;
    let closestDist = Infinity;
    const len = this.draggables.length;
    for (let i = 0; i < len; i++) {
      let nextIndex = (i + 1) % len;
      let distToMidpoint = this.distanceToMidPoint(
        this.draggables[i].position,
        this.draggables[nextIndex].position,
        x,
        y
      );
      if (distToMidpoint < closestDist) {
        closestDist = distToMidpoint;
        closestIndex = i;
      }
    }
    return closestIndex;
  };

  this.distanceToMidPoint = (p1, p2, x, y) => {
    let midX = (p1.x + p2.x) / 2;
    let midY = (p1.y + p2.y) / 2;
    return dist(midX, midY, x, y);
  };

  this.display = () => {
    this.draggables.forEach((draggable) => draggable.display());
  };

  this.selectGroup = () => {
    this.deselectGroup();
    this.selected = true;
  };

  this.deselectGroup = () => {
    this.parent.groups.forEach((set) => set.deselect());
  };

  this.deselect = () => {
    this.selected = false;
  };

  this.toggleContour = () => {
    this.isContour = !this.isContour;
    this.draggables.reverse();
  };

  this.handleMousePressed = () => {
    let handled = false;
    for (let draggable of this.draggables) {
      if (draggable.isMouseOver()) {
        if (keyIsDown(ALT)) {
          if (this.draggables.length > 3) {
            this.draggables.splice(this.draggables.indexOf(draggable), 1);
          } else {
            console.log("Group has been removed");
            return true; // Signal to remove group
          }
          handled = true;
        } else {
          draggable.startDragging();
          handled = true;
        }
        break; // Only handle the topmost draggable
      }
    }

    if (!handled && this.selected && keyIsDown(SHIFT)) {
      if (keyCode === 82) {
        // 'R' key to toggle contour/shape
        this.toggleContour();
      } else {
        const idx = this.findClosestIndex(mouseX, mouseY);
        this.addDraggable(mouseX, mouseY, idx);
      }
      handled = true;
    }

    return handled;
  };

  this.handleMouseDragged = () => {
    this.draggables.forEach((draggable) => {
      if (draggable.isDragging) {
        draggable.drag();
      }
    });
  };

  this.handleMouseReleased = () => {
    this.draggables.forEach((draggable) => (draggable.isDragging = false));
  };

  this.anyDragging = () => {
    return this.draggables.some((draggable) => draggable.isDragging);
  };
  this.getPoints = () => {
    return this.draggables.map((draggable) => {
      return { x: draggable.position.x, y: draggable.position.y };
    });
  };
}
