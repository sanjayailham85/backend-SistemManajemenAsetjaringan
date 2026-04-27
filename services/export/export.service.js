const db = require("../../config/db");
const config = require("./export.config");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

const exportData = async (module, format) => {
  const moduleConfig = config[module];

  if (!moduleConfig) {
    throw new Error("Module export tidak ditemukan");
  }

  const [rows] = await db.query(moduleConfig.query);

  // ======================
  // EXCEL EXPORT
  // ======================
  if (format === "excel") {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(module);

    worksheet.columns = moduleConfig.columns;

    rows.forEach((row) => worksheet.addRow(row));

    return workbook;
  }

  // ======================
  // PDF EXPORT
  // ======================
  if (format === "pdf") {
    const doc = new PDFDocument({ margin: 30 });

    doc.fontSize(16).text(`${module.toUpperCase()} REPORT`, {
      align: "center",
    });

    doc.moveDown();

    rows.forEach((row, i) => {
      const line = moduleConfig.columns.map((col) => row[col.key]).join(" | ");

      doc.fontSize(10).text(`${i + 1}. ${line}`);
    });

    return doc;
  }

  throw new Error("Format tidak valid");
};

module.exports = {
  exportData,
};
