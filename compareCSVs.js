const fs = require("fs");
const Papa = require("papaparse");

// Helper function to read a CSV file and parse it into JSON
const readCSV = async (filePath) => {
  const csvFile = fs.readFileSync(filePath, "utf8");
  const parsed = Papa.parse(csvFile, { header: true, skipEmptyLines: true });
  return parsed.data;
};

// Helper function to write a CSV file from JSON
const writeCSV = (filePath, data) => {
  const csv = Papa.unparse(data);
  fs.writeFileSync(filePath, csv, "utf8");
};

// Helper function to compare rows, ignoring the first column
const rowsAreEqual = (row1, row2) => {
  const keys1 = Object.keys(row1).slice(1); // Skip the first column
  const keys2 = Object.keys(row2).slice(1); // Skip the first column

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (row1[key] !== row2[key]) {
      return false;
    }
  }

  return true;
};

// Main function to read both CSVs, compare them, and output the difference
const compareAndWriteCSV = async () => {
  try {
    const list1 = await readCSV("list1.csv");
    const list2 = await readCSV("list2.csv");

    // Filter out the rows from list2 that are present in list1
    const filteredList2 = list2.filter((row2) => {
      return !list1.some((row1) => rowsAreEqual(row1, row2));
    });

    // Write the filtered list to list3.csv
    writeCSV("list3.csv", filteredList2);
    console.log("list3.csv has been created with the filtered data.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// Run the main function
compareAndWriteCSV();
