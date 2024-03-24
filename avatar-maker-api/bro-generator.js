import fs from "fs";

// const broTraitNames = [
//   ".assets/Bros/background/" + req.query.background + ".svg",
//   ".assets/Bros/beard/" + req.query.beard + ".svg",
//   ".assets/Bros/dress/" + req.query.dress + ".svg",
//   ".assets/Bros/eyes/" + req.query.eyes + ".svg",
//   ".assets/Bros/eyewear/" + req.query.eyewear + ".svg",
//   ".assets/Bros/head/" + req.query.head + ".svg",
//   ".assets/Bros/mouth/" + req.query.mouth + ".svg",
//   ".assets/Bros/skin/" + req.query.skin + ".svg",
// ];

// const inputSVGs = [
//   "assets/Baes/background/" + req.query.background + ".svg",
//   "assets/Baes/dress/" + req.query.dress + ".svg",
//   "assets/Baes/earrings/" + req.query.earrings + ".svg",
//   "assets/Baes/eyes/" + req.query.eyes + ".svg",
//   "assets/Baes/eyewear/" + req.query.eyewear + ".svg",
//   "assets/Baes/head/" + req.query.head + ".svg",
//   "assets/Baes/mouth/" + req.query.mouth + ".svg",
//   "assets/Baes/neck/" + req.query.neck + ".svg",
//   "assets/Baes/skin/" + req.query.skin + ".svg",
// ];

export function generateBro(req, res) {
  const inputSVGs = [
    "assets/Bros/background/" + req.query.background + ".svg",
    "assets/Bros/skin/" + req.query.skin + ".svg",
    "assets/Bros/dress/" + req.query.dress + ".svg",
    "assets/Bros/beard/" + req.query.beard + ".svg",
    "assets/Bros/eyes/" + req.query.eyes + ".svg",
    "assets/Bros/mouth/" + req.query.mouth + ".svg",
    "assets/Bros/eyewear/" + req.query.eyewear + ".svg",
    "assets/Bros/head/" + req.query.head + ".svg",
  ];

  // Function to read SVG file contents
  const readSVGFile = (filePath) => {
    return fs.readFileSync(filePath, "utf8");
  };

  let mergedSVG = "";

  // Iterate over input SVG files
  for (let i = 0; i < inputSVGs.length; i++) {
    // Read SVG file contents
    const svgContent = readSVGFile(inputSVGs[i]);

    // Append the current SVG content as a new layer
    mergedSVG += `<g id="layer${i + 1}">${svgContent}</g>`;
  }

  // Wrap the merged layers in an SVG element
  mergedSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">${mergedSVG}</svg>`;

  // document.getElementById('result').innerHTML = mergedSVG;
  res.status(200).json({
    bro: mergedSVG, // Data to be returned as JSON object.
  });
  // return mergedSVG;
  // console.log('SVG files merged successfully!');
}

export function generateBae(req, res) {
  const inputSVGs = [
    "assets/Baes/background/" + req.query.background + ".svg",
    "assets/Baes/skin/" + req.query.skin + ".svg",
    "assets/Baes/dress/" + req.query.dress + ".svg",
    "assets/Baes/hair/" + req.query.hair + ".svg",
    "assets/Baes/earrings/" + req.query.earrings + ".svg",
    "assets/Baes/eyes/" + req.query.eyes + ".svg",
    "assets/Baes/eyewear/" + req.query.eyewear + ".svg",
    "assets/Baes/head/" + req.query.head + ".svg",
    "assets/Baes/mouth/" + req.query.mouth + ".svg",
    "assets/Baes/neck/" + req.query.neck + ".svg",
  ];

  // Function to read SVG file contents
  const readSVGFile = (filePath) => {
    return fs.readFileSync(filePath, "utf8");
  };

  let mergedSVG = "";

  // Iterate over input SVG files
  for (let i = 0; i < inputSVGs.length; i++) {
    // Read SVG file contents
    const svgContent = readSVGFile(inputSVGs[i]);

    // Append the current SVG content as a new layer
    mergedSVG += `<g id="layer${i + 1}">${svgContent}</g>`;
  }

  // Wrap the merged layers in an SVG element
  mergedSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">${mergedSVG}</svg>`;

  // document.getElementById('result').innerHTML = mergedSVG;
  res.status(200).json({
    bae: mergedSVG, // Data to be returned as JSON object.
  });
  // return mergedSVG;
  // console.log('SVG files merged successfully!');
}
