import fs from "fs";

// Assuming the asset folders and CSV files are structured in a similar way to the HTML code provided
const traitNames = [
  "background",
  "beard",
  "dress",
  "eyes",
  "eyewear",
  "face",
  "head",
  "skin",
];

// Function to read a CSV file and return its contents as an array of objects
function readCSV(filePath) {
  const csvData = fs.readFileSync(filePath, "utf8");
  const lines = csvData.split("\n").slice(1); // Assuming there's a header row
  return lines.map((line) => {
    const [fileName, rarity] = line.trim().split(",");
    return { fileName, rarity: parseFloat(rarity) };
  });
}

// Function to select a random asset based on rarity
function selectAsset(assets) {
  const totalRarity = assets.reduce((sum, asset) => sum + asset.rarity, 0);
  let randomValue = Math.random() * totalRarity;
  for (let asset of assets) {
    randomValue -= asset.rarity;
    if (randomValue <= 0) {
      return asset.fileName;
    }
  }
}

function generateBro(selectedAssets) {
  const inputSVGs = [
    `./assets/background/${selectedAssets.background}.svg`,
    `./assets/skin/${selectedAssets.skin}.svg`,
    `./assets/head/${selectedAssets.head}.svg`,
    `./assets/dress/${selectedAssets.dress}.svg`,
    `./assets/beard/${selectedAssets.beard}.svg`,
    `./assets/face/${selectedAssets.face}.svg`,
    `./assets/eyes/${selectedAssets.eyes}.svg`,
    `./assets/eyewear/${selectedAssets.eyewear}.svg`,
  ];

  const readSVGFile = (filePath) => {
    return fs.readFileSync(filePath, "utf8");
  };

  let mergedSVG = "";

  for (let i = 0; i < inputSVGs.length; i++) {
    const svgContent = readSVGFile(inputSVGs[i]);
    mergedSVG += `<g id="layer${i + 1}">${svgContent}</g>`;
  }

  mergedSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">${mergedSVG}</svg>`;
  return mergedSVG;
}

// Load asset data from CSV files
const assets = {};
traitNames.forEach((traitName) => {
  assets[traitName] = readCSV(`assets/${traitName}/list.csv`);
});

function writeCSV(fileName, rows) {
  const headers = [
    "number",
    "background",
    "beard",
    "dress",
    "eyes",
    "eyewear",
    "face",
    "head",
    "skin",
  ];
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");
  fs.writeFileSync(fileName, csvContent);
}

// Generate 5000 bros and save them to disk
(async () => {
  const csvRows = [];
  for (let i = 1; i <= 5000; i++) {
    const selectedAssets = {};
    for (let traitName in assets) {
      selectedAssets[traitName] = selectAsset(assets[traitName]);
    }
    if (selectedAssets.eyes == "btc" || selectedAssets.eyes == "eth") {
      selectedAssets.eyewear = "none";
    }
    if (selectedAssets.dress == "eminem" || selectedAssets.dress == "hack") {
      selectedAssets.head = "none";
    }

    const broSVG = generateBro(selectedAssets);
    fs.writeFileSync(`bros/${i}.svg`, broSVG);
    console.log(`Generated bro ${i}`);

    // Prepare the row data for the CSV file
    const csvRow = [
      `${i}`,
      ...traitNames.map((traitName) => selectedAssets[traitName]),
    ];
    csvRows.push(csvRow);
  }

  // Write data to the CSV file
  writeCSV("bros.csv", csvRows);
})();
