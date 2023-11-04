function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function colorMatch(r1, g1, b1, r2, g2, b2, tolerance) {
  return (
    Math.abs(r1 - r2) <= tolerance &&
    Math.abs(g1 - g2) <= tolerance &&
    Math.abs(b1 - b2) <= tolerance
  );
}

function removeColor() {
  const fileInput = document.getElementById("upload");
  const colorInput = document.getElementById("color").value;
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  const tolerance = 50; // You can adjust this value to fit your needs

  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const color = hexToRgb(colorInput);

    for (let i = 0; i < data.length; i += 4) {
      if (
        colorMatch(
          data[i],
          data[i + 1],
          data[i + 2],
          color.r,
          color.g,
          color.b,
          tolerance
        )
      ) {
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    document.getElementById("output").src = canvas.toDataURL();
  };

  img.src = URL.createObjectURL(fileInput.files[0]);
}
