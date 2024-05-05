function Draggable(x, y, parent) {
  this.position = createVector(x, y);
  this.radius = 30;
  this.parent = parent;
  this.isDragging = false;

  this.display = () => {
    push();
    strokeWeight(1);
    stroke(0);
    fill(this.getColor());
    ellipse(this.position.x, this.position.y, this.radius);
    pop();
  };

  this.getColor = () => {
    if (this.isDragging) {
      return this.parent.isContour ? "red" : "blue";
    } else if (this.parent.selected) {
      return this.parent.isContour ? "pink" : "cyan";
    }
    return color(0);
  };

  this.isMouseOver = () => {
    return (
      Math.hypot(mouseX - this.position.x, mouseY - this.position.y) <
      this.radius
    );
  };

  this.startDragging = () => {
    if (this.isMouseOver() && !this.parent.anyDragging()) {
      this.parent.selectGroup();
      this.isDragging = true;
    }
  };

  this.drag = () => {
    if (this.isDragging) {
      this.position.set(mouseX, mouseY);
    }
  };
}
