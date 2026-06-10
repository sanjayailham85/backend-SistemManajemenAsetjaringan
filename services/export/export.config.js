module.exports = {
  physical: {
    query: `
      SELECT name, ip, status, cpu, ram, storage, detail, year
      FROM physicalserver
    `,
    columns: [
      { header: "Nama", key: "name", width: 25 },
      { header: "IP", key: "ip", width: 20 },
      { header: "Detail", key: "detail", width: 30 },
      { header: "CPU", key: "cpu", width: 15 },
      { header: "RAM", key: "ram", width: 15 },
      { header: "Storage", key: "storage", width: 15 },
      { header: "Tahun Pengadaan", key: "year", width: 25 },
      { header: "Status", key: "status", width: 15 },
    ],
  },

  accessPoint: {
    query: `
        SELECT name, ip, type, tahunAnggaran, location, locationDetail
        FROM accessPoint
      `,
    columns: [
      { header: "Name", key: "name", width: 25 },
      { header: "IP", key: "ip", width: 20 },
      { header: "Type", key: "type", width: 15 },
      { header: "Tahun Anggaran", key: "tahunAnggaran", width: 25 },
      { header: "Location", key: "location", width: 20 },
      { header: "Location Detail", key: "locationDetail", width: 30 },
    ],
  },
  switch: {
    query: `
        SELECT name, ip, type, location, locationDetail, status, detail,
        FROM switch
      `,
    columns: [
      { header: "Name", key: "name", width: 25 },
      { header: "IP", key: "ip", width: 20 },
      { header: "Type", key: "type", width: 15 },
      { header: "Location", key: "location", width: 15 },
      { header: "Location Detail", key: "locationDetail", width: 25 },
      { header: "Detail", key: "detail", width: 30 },
      { header: "Status", key: "status", width: 25 },
    ],
  },
  router: {
    query: `
        SELECT name, ip, type, location, locationDetail, status, detail
        FROM router
      `,
    columns: [
      { header: "Name", key: "name", width: 25 },
      { header: "IP", key: "ip", width: 20 },
      { header: "Type", key: "type", width: 15 },
      { header: "Location", key: "location", width: 15 },
      { header: "Location Detail", key: "locationDetail", width: 25 },
      { header: "Detail", key: "detail", width: 30 },
      { header: "Status", key: "status", width: 25 },
    ],
  },

  cctv: {
    query: `
        SELECT name, ip, location, locationDetail, type, status, detail, 
        FROM cctv
      `,
    columns: [
      { header: "Name", key: "name", width: 25 },
      { header: "IP", key: "ip", width: 20 },
      { header: "Location", key: "location", width: 15 },
      { header: "Location Detail", key: "locationDetail", width: 25 },
      { header: "Type", key: "type", width: 15 },
      { header: "Detail", key: "detail", width: 30 },
      { header: "Status", key: "status", width: 25 },
    ],
  },
};
