const fs = require("fs");
const csv = require("csv-parser");
const { parse } = require("json2csv");

exports.importProfiles = () => {
  return new Promise((resolve, reject) => {
    const profiles = [];
    fs.createReadStream("People.csv")
      .pipe(csv())
      .on("data", (row) => {
        profiles.push(row["profileUrl"]);
      })
      .on("end", () => {
        console.log("CSV file successfully processed:", profiles.length);
        resolve(profiles);
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        reject(error);
      });
  });
};
