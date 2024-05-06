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

// Function to generate and download SVG file
function downloadSVG(groups) {
  const svgHeader = `<?xml version="1.0" standalone="no"?>
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
      "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg" version="1.1">\n`; // Specify your dimensions

  const svgBackground = '<rect width="100%" height="100%" fill="black" />\n'; // Black background
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
