const db = require("../../config/db");
const config = require("./export.config");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

const applyBorder = (cell) => {
  cell.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
};

const applyTableBorder = (worksheet, startRow, endRow, startCol, endCol) => {
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      applyBorder(worksheet.getRow(r).getCell(c));
    }
  }
};

const exportData = async (module, format, options = {}) => {
  const moduleConfig = config[module];

  if (!moduleConfig) {
    throw new Error("Module export tidak ditemukan");
  }

  const [rows] = await db.query(moduleConfig.query);

  if (format === "excel") {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(module);

    let filteredRows = rows;

    if (options.startDate && options.endDate) {
      filteredRows = rows.filter((r) => {
        const dateField = r.created_at || r.createdAt;
        if (!dateField) return true;

        const date = new Date(dateField);
        return (
          date >= new Date(options.startDate) &&
          date <= new Date(options.endDate)
        );
      });
    }

    worksheet.columns = moduleConfig.columns;

    const headerRow = worksheet.getRow(1);

    headerRow.font = { bold: true };
    headerRow.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    headerRow.eachCell((cell) => {
      applyBorder(cell);
    });

    const dataStartRow = 2;

    filteredRows.forEach((row) => {
      worksheet.addRow(row);
    });

    const dataEndRow = worksheet.lastRow.number;
    const colCount = moduleConfig.columns.length;

    applyTableBorder(worksheet, dataStartRow, dataEndRow, 1, colCount);

    const hasStatus = filteredRows[0]?.status !== undefined;

    if (hasStatus) {
      const normalize = (val) => (val || "").toLowerCase();

      const total = filteredRows.length;
      const active = filteredRows.filter(
        (r) => normalize(r.status) === "active"
      ).length;

      const inactive = filteredRows.filter(
        (r) => normalize(r.status) === "inactive"
      ).length;

      const damaged = filteredRows.filter(
        (r) => normalize(r.status) === "damaged"
      ).length;

      const startSummaryRow = dataEndRow + 3;

      const colTitle = 1;
      const colValue = 2;

      worksheet.getCell(startSummaryRow, colTitle).value = "SUMMARY";
      worksheet.getCell(startSummaryRow, colTitle).font = { bold: true };

      worksheet.getCell(startSummaryRow + 1, colTitle).value = "Total";
      worksheet.getCell(startSummaryRow + 1, colValue).value = total;

      worksheet.getCell(startSummaryRow + 2, colTitle).value = "Active";
      worksheet.getCell(startSummaryRow + 2, colValue).value = active;

      worksheet.getCell(startSummaryRow + 3, colTitle).value = "Inactive";
      worksheet.getCell(startSummaryRow + 3, colValue).value = inactive;

      worksheet.getCell(startSummaryRow + 4, colTitle).value = "Damaged";
      worksheet.getCell(startSummaryRow + 4, colValue).value = damaged;

      applyTableBorder(worksheet, startSummaryRow, startSummaryRow + 4, 1, 2);
    }

    return workbook;
  }

  if (format === "pdf") {
    const doc = new PDFDocument({ margin: 30 });

    const normalize = (val) => (val || "").toLowerCase();

    const formatDateID = (date = new Date()) => {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    };

    const formattedDate = formatDateID(new Date());

    const path = require("path");
    const logoPath = path.join(
      __dirname,
      "../../assets/logo-unila-resmi-1.png"
    );

    const logoSize = 150;
    const marginLeft = doc.page.margins.left;

    const logoX = marginLeft;
    const logoY = 10;

    doc.image(logoPath, logoX, logoY, {
      width: logoSize,
    });

    const textX = 0;
    let textY = 30;

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("UNIVERSITAS LAMPUNG", textX, textY, {
        width: doc.page.width,
        align: "center",
      });

    doc.fontSize(12).text("UPA TIK", textX, textY + 18, {
      width: doc.page.width,
      align: "center",
    });

    doc
      .fontSize(10)
      .text(
        "Jl. Prof. Dr. Sumantri Brojonegoro No.1 Bandar Lampung 35145",
        textX,
        textY + 34,
        {
          width: doc.page.width,
          align: "center",
        }
      );

    doc.text(
      "Telp: (0721) 704947 | Email: upatik@unila.ac.id",
      textX,
      textY + 48,
      {
        width: doc.page.width,
        align: "center",
      }
    );

    doc
      .moveTo(doc.page.margins.left, textY + 75)
      .lineTo(doc.page.width - doc.page.margins.right, textY + 75)
      .stroke();

    doc.moveDown(3);

    const title =
      module === "physical"
        ? "PHYSICAL SERVER REPORT"
        : `${module.toUpperCase()} REPORT`;

    doc.fontSize(14).text(title, {
      align: "center",
    });

    doc.moveDown(1);

    const columns = moduleConfig.columns;

    const getTextWidth = (text, size = 10) =>
      doc.widthOfString(String(text ?? ""), { size });

    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    const minColWidth = 70;

    const colWidths = columns.map((col) => {
      let max = getTextWidth(col.header || col.key);

      rows.forEach((r) => {
        const w = getTextWidth(r[col.key]);
        if (w > max) max = w;
      });

      return Math.max(minColWidth, max + 20);
    });

    const total = colWidths.reduce((a, b) => a + b, 0);
    const scale = total > pageWidth ? pageWidth / total : 1;
    const finalColWidths = colWidths.map((w) => w * scale);

    const wrapText = (text, width) => {
      const words = String(text).split(" ");
      let line = "";
      const lines = [];

      words.forEach((word) => {
        const test = line + word + " ";
        if (getTextWidth(test) > width) {
          lines.push(line);
          line = word + " ";
        } else {
          line = test;
        }
      });

      lines.push(line);
      return lines;
    };

    const getRowHeight = (row) => {
      let maxLines = 1;

      columns.forEach((col, i) => {
        const lines = wrapText(row[col.key] || "", finalColWidths[i]).length;
        if (lines > maxLines) maxLines = lines;
      });

      return maxLines * 14 + 10; // auto tinggi
    };

    const drawRow = (y, row, isHeader = false, height = 22) => {
      let x = doc.page.margins.left;

      columns.forEach((col, i) => {
        const w = finalColWidths[i];

        doc.rect(x, y, w, height).stroke();

        const text = String(row[col.key] ?? "");

        doc
          .fontSize(10)
          .font(isHeader ? "Helvetica-Bold" : "Helvetica")
          .text(text, x + 5, y + 5, {
            width: w - 10,
            align: "left",
          });

        x += w;
      });
    };

    let y = doc.y;

    const header = {};
    columns.forEach((c) => (header[c.key] = c.header || c.key));

    const headerHeight = getRowHeight(header);

    drawRow(y, header, true, headerHeight);
    y += headerHeight;

    rows.forEach((row) => {
      const rowHeight = getRowHeight(row);

      const bottomLimit = doc.page.height - 180;

      if (y + rowHeight > bottomLimit) {
        doc.addPage();
        y = doc.y;

        drawRow(y, header, true, headerHeight);
        y += headerHeight;
      }

      drawRow(y, row, false, rowHeight);
      y += rowHeight;
    });

    const hasStatus = rows[0]?.status !== undefined;

    if (hasStatus) {
      const total = rows.length;
      const active = rows.filter(
        (r) => normalize(r.status) === "active"
      ).length;
      const inactive = rows.filter(
        (r) => normalize(r.status) === "inactive"
      ).length;
      const damaged = rows.filter(
        (r) => normalize(r.status) === "damaged"
      ).length;

      y += 20;

      doc.fontSize(12).font("Helvetica-Bold").text("SUMMARY", 30, y);

      y += 15;

      doc.fontSize(10).font("Helvetica");
      doc.text(`Total: ${total}`, 30, y);
      doc.text(`Active: ${active}`, 30, y + 12);
      doc.text(`Inactive: ${inactive}`, 30, y + 24);
      doc.text(`Damaged: ${damaged}`, 30, y + 36);

      y += 70;
    }

    const footerDate = `Lampung, ${formattedDate}`;

    y += 30;

    doc.fontSize(10).text(footerDate, 30, y);

    y += 30;

    const leftX = 50;
    const rightX = doc.page.width - 200;
    const centerX = doc.page.width / 2 - 60;

    const gap = 14;

    doc.text("Kepala Program Kerja Infrastruktur", leftX, y, {
      width: 170,
      align: "center",
    });

    doc.text("Hendri Susanto, S.T.", leftX, y + gap * 5, {
      width: 150,
      align: "center",
    });

    doc.text("Staff Infrastruktur", rightX, y, {
      width: 150,
      align: "center",
    });

    doc.text("Nyoman Herman Ardike, S.T.", rightX, y + gap * 5, {
      width: 150,
      align: "center",
    });

    y += 20;

    const pageLeft = doc.page.margins.left;
    const pageRight = doc.page.width - doc.page.margins.right;
    const blockWidth = pageRight - pageLeft;

    doc.text("Mengetahui", pageLeft, y + 80, {
      width: blockWidth,
      align: "center",
    });

    doc.text("Kepala UPA TIK", pageLeft, y + 80 + gap, {
      width: blockWidth,
      align: "center",
    });

    doc.text(
      "Dr. Eng. Ir. Mardiana, S.T., M.T., I.P.M",
      pageLeft,
      y + 80 + gap * 6,
      {
        width: blockWidth,
        align: "center",
      }
    );

    return doc;
  }

  throw new Error("Format tidak valid");
};

module.exports = {
  exportData,
};
