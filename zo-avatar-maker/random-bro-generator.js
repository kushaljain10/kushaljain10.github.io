import fs from "fs/promises";
import { readFileSync } from "fs";

// Assuming you have an array of folder names
const traitNames = [
  "background",
  "dress",
  "eyes",
  "eyewear",
  "head",
  "mouth",
  "beard",
  "skin",
];

function readCSV(filePath) {
  const csvData = readFileSync(filePath, "utf8");
  const lines = csvData.split("\n").slice(1); // Assuming there's a header row
  return lines.map((line) => {
    const [fileName, newName] = line.trim().split(",");
    return { fileName, newName };
  });
}

// Load asset data from CSV files
const assets = {};
traitNames.forEach((traitName) => {
  assets[traitName] = readCSV(`assets/Bros/${traitName}/list2.csv`);
});

// Function to select a random asset based on rarity
function selectAsset(assets) {
  const randomIndex = Math.floor(Math.random() * assets.length);
  return assets[randomIndex].fileName;
}

const generateBro = async (selectedAssets, i) => {
  const inputSVGs = [
    `assets/Bros/background/${selectedAssets.background}.svg`,
    `assets/Bros/skin/${selectedAssets.skin}.svg`,
    `assets/Bros/dress/${selectedAssets.dress}.svg`,
    `assets/Bros/eyes/${selectedAssets.eyes}.svg`,
    `assets/Bros/head/${selectedAssets.head}.svg`,
    `assets/Bros/beard/${selectedAssets.beard}.svg`,
    `assets/Bros/mouth/${selectedAssets.mouth}.svg`,
    `assets/Bros/eyewear/${selectedAssets.eyewear}.svg`,
  ];

  const readSVGFile = async (filePath) => {
    try {
      const svgContent = await fs.readFile(filePath, "utf8");
      return svgContent;
    } catch (error) {
      console.error(`Error loading SVG file for ${filePath}:`, error);
      throw error;
    }
  };

  const mergeSVGFiles = async (inputSVGs) => {
    try {
      const svgContents = await Promise.all(
        inputSVGs.map((filePath) => readSVGFile(filePath))
      );
      let mergedSVG = svgContents
        .map(
          (svgContent, index) =>
            `<svg id="layer${index + 1}" x="0" y="0">${svgContent}</svg>`
        )
        .join("");
      mergedSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${mergedSVG}</svg>`;

      await fs.writeFile(`bros/${i}.svg`, mergedSVG);
      console.log(`Generated bro ${i}`);
    } catch (error) {
      console.error("Error generating SVG:", error);
    }
  };

  await mergeSVGFiles(inputSVGs);
};

(async () => {
  for (let i = 0; i < 2000; i++) {
    const selectedAssets = {};
    for (let traitName in assets) {
      selectedAssets[traitName] = selectAsset(assets[traitName]);
    }
    if (selectedAssets.dress === "12" || selectedAssets.dress === "13") {
      selectedAssets.head = "none";
      selectedAssets.beard = "none";
    }
    if (selectedAssets.head === "16" || selectedAssets.head === "18") {
      selectedAssets.eyewear = "none";
      selectedAssets.beard = "none";
    }
    if (selectedAssets.head === "5") {
      selectedAssets.mouth = "none";
      selectedAssets.beard = "none";
    }
    if (
      selectedAssets.eyewear === "12" ||
      selectedAssets.eyewear === "18" ||
      selectedAssets.eyewear === "20"
    ) {
      while (selectedAssets.background === "5") {
        selectedAssets.background = selectAsset(assets.background);
      }
    }
    if (selectedAssets.eyewear === "10" || selectedAssets.head === "49") {
      while (selectedAssets.background === "0") {
        selectedAssets.background = selectAsset(assets.background);
      }
    }
    // For dresses and backgrounds to not match
    const bgDressExceptions = {
      0: ["2", "38"],
      1: ["50"],
      4: ["30", "32", "45", "47"],
      6: ["3", "10", "17", "22", "41", "59"],
      7: ["43"],
    };

    for (const bg in bgDressExceptions) {
      if (
        bg === selectedAssets.background &&
        bgDressExceptions[bg].includes(selectedAssets.dress)
      ) {
        while (selectedAssets.background === bg) {
          selectedAssets.background = selectAsset(assets.background);
        }
      }
    }
    await generateBro(selectedAssets, i);
  }
})();
