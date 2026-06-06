import fs from "node:fs";
import path from "node:path";

const FILE_PATH = path.join("data", "expenses.json");

let accounts = [];

if (fs.existsSync(FILE_PATH)) {
  const content = fs.readFileSync(FILE_PATH, "utf-8");
  if (content.trim()) {
    accounts = JSON.parse(content);
  }
}

function saveToFile(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data));
}

const db = {
  accounts,
};

export { db, saveToFile };
