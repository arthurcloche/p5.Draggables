function createSVGPath(groups) {
  let svgContent = "";

  for (let group of groups) {
    const hobbyPoints = createHobbyBezier(group.getPoints(), {
      tension: 1,
      cyclic: true,
    });
    let d = `M ${group.getPoints()[0].x} ${group.getPoints()[0].y} `;
    hobbyPoints.forEach(({ startControl, endControl, point }) => {
      d += `C ${startControl.x} ${startControl.y}, ${endControl.x} ${endControl.y}, ${point.x} ${point.y} `;
    });
    d += "Z"; // Close the path

    // Depending on whether the group is a contour or not, fill accordingly
    const fill = group.isContour ? "#000000" : "#FFFFFF";
    svgContent += `<path d="${d}" fill="${fill}" />\n`;
  }

  return svgContent;
}

function calculateBoundingBox(groups, margin = 10) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  groups.forEach((group) => {
    group.getPoints().forEach((point) => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });
  });

  return {
    x: minX - margin,
    y: minY - margin,
    width: maxX - minX + 2 * margin,
    height: maxY - minY + 2 * margin,
  };
}

function downloadSVG(groups) {
  const bbox = calculateBoundingBox(groups);

  const svgHeader = `<?xml version="1.0" standalone="no"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
    "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg width="${bbox.width}" height="${bbox.height}" viewBox="${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}" xmlns="http://www.w3.org/2000/svg" version="1.1">\n`;

  const svgBackground = `<rect x ="${bbox.x}" y="${bbox.y}" width="100%" height="100%" fill="black" />\n`;
  const svgFooter = "</svg>";
  const svgContent = createSVGPath(groups);

  const svgData = `${svgHeader}${svgBackground}${svgContent}${svgFooter}`;
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // Trigger a download
  const a = document.createElement("a");
  a.href = url;
  a.download = "output.svg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
