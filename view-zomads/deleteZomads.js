const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const results = [];

fs.createReadStream("delete.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    results.forEach((row) => {
      // Assuming the column name in the CSV is 'filename'
      const filename = row.number + ".svg";
      const filePath = path.join(__dirname, "zomads_final", filename);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filename}:`, err.message);
        } else {
          console.log(`Successfully deleted ${filename}`);
        }
      });
    });
  });
