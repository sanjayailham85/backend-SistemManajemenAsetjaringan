const excelDateToJSDate = (serial) => {
  if (serial === null || serial === undefined || serial === "") return null;

  // kalau sudah string date biasa
  if (typeof serial === "string" && isNaN(serial)) {
    const d = new Date(serial);
    return isNaN(d.getTime()) ? null : formatMySQLDate(d);
  }

  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  const msPerDay = 86400000;

  const date = new Date(excelEpoch.getTime() + serial * msPerDay);

  return formatMySQLDate(date);
};

const formatMySQLDate = (date) => {
  if (!date || isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 19).replace("T", " ");
};

module.exports = excelDateToJSDate;
