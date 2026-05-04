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

const importData = async (module, fileBuffer) => {
  const moduleConfig = config[module];

  if (!moduleConfig) throw new Error("Module tidak ditemukan");

  const workbook = xlsx.read(fileBuffer, { type: "buffer" });
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

      mapped[normalizedConfig[key]] =
        typeof value === "string" ? value.trim() : value;
    }

    if (!mapped.name) errors.push({ row: i + 2, reason: "Name wajib" });
    if (!mapped.ip) errors.push({ row: i + 2, reason: "IP wajib" });

    preparedData.push(mapped);
  });

  if (errors.length) {
    return { success: false, message: "Invalid data", errors };
  }

  let inserted = 0;

  for (const data of preparedData) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);

      const query = `
        INSERT INTO ${moduleConfig.table}
        (${keys.join(",")})
        VALUES (${keys.map(() => "?").join(",")})
      `;

      await db.query(query, values);
      console.log("PREPARED DATA:", preparedData);
      console.log("ERRORS VALIDATION:", errors);
      inserted++;
    } catch (err) {
      errors.push({ data, reason: err.message });
    }
  }

  return {
    success: errors.length === 0,
    inserted,
    errors,
  };
};

module.exports = { importData };
