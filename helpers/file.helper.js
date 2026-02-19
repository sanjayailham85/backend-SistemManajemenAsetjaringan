const fs = require("fs");
const path = require("path");

const deleteImage = (filename) => {
  if (!filename) return;

  const filePath = path.join(__dirname, "../uploads", filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Gagal hapus file:", err);
        else console.log("File berhasil dihapus:", filename);
      });
    }
  });
};

module.exports = { deleteImage };
