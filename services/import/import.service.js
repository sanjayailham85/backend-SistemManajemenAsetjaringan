const xlsx = require("xlsx");
const db = require("../../config/db");
const config = require("./import.config");
const excelDateToJSDate = require("../../helpers/excelDateToJS.helper");

// normalize
const normalize = (str) =>
  str?.toString().toLowerCase().replace(/\s+/g, "").replace(/_/g, "");

const normalizeRow = (row) => {
  const newRow = {};
  Object.keys(row).forEach((key) => {
    newRow[normalize(key)] = row[key];
  });
  return newRow;
};

const importData = async (module, filePath) => {
  const moduleConfig = config[module];

  if (!moduleConfig) throw new Error("Module tidak ditemukan");

  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: null });

  const normalizedConfig = {};
  for (const key in moduleConfig.columns) {
    normalizedConfig[normalize(key)] = moduleConfig.columns[key];
  }

  const preparedData = [];
  const errors = [];

  jsonData.forEach((row, i) => {
    const clean = normalizeRow(row);
    const mapped = {};

    for (const key in normalizedConfig) {
      let value = clean[key];

      if (key === "createdat" || key === "updatedat") {
        value = excelDateToJSDate(value);
      }

      mapped[normalizedConfig[key]] = value?.toString().trim?.() ?? value;
    }

    if (!mapped.name) errors.push({ row: i + 2, reason: "Name wajib" });
    if (!mapped.ip) errors.push({ row: i + 2, reason: "IP wajib" });

    preparedData.push(mapped);
  });

  if (errors.length) {
    return { success: false, message: "Invalid data", errors };
  }

  try {
    for (const data of preparedData) {
      const keys = Object.keys(data);
      const values = Object.values(data);

      const query = `
        INSERT INTO ${moduleConfig.table}
        (${keys.join(",")})
        VALUES (${keys.map(() => "?").join(",")})
      `;

      await db.query(query, values);
    }

    return { success: true, inserted: preparedData.length };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

module.exports = { importData };
