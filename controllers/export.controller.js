const { exportData } = require("../services/export/export.service");

const exportModule = async (req, res) => {
  try {
    const { module, format } = req.body;

    const result = await exportData(module, format);

    
    if (format === "excel") {
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${module}.xlsx`
      );

      await result.xlsx.write(res);
      return res.end();
    }

   
    if (format === "pdf") {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${module}.pdf`
      );

      result.pipe(res);
      result.end();
      return;
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Export gagal" });
  }
};

module.exports = {
  exportModule,
};
