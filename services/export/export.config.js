module.exports = {
  rack: {
    query: `
      SELECT id, name, location
      FROM rack
    `,
    columns: [
      { header: "Id", key: "id", width: 15 },
      { header: "Name", key: "name", width: 25 },
      { header: "Location", key: "location", width: 25 },
    ],
  },

  physical: {
    query: `
      SELECT id, name, ip, owner, year, status, model,  cpu, ram, storage,  detail, image, rackId, authUsername, authPassword, ownerContact, createdAt, updatedAt, category
      FROM physicalServer
    `,
    columns: [
      { header: "id", key: "id", width: 25 },
      { header: "Name", key: "name", width: 25 },
      { header: "IP", key: "ip", width: 20 },
      { header: "Year", key: "year", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Model", key: "model", width: 20 },
      { header: "CPU", key: "cpu", width: 15 },
      { header: "RAM", key: "ram", width: 15 },
      { header: "Storage", key: "storage", width: 15 },
      { header: "Detail", key: "detail", width: 15 },
      { header: "Image", key: "image", width: 15 },
      { header: "Rack Id", key: "rackId", width: 15 },
      { header: "Auth Username", key: "authUsername", width: 15 },
      { header: "Auth Password", key: "authPassword", width: 15 },
      { header: "Owner Contact", key: "ownerContact", width: 15 },
      { header: "Created At", key: "createdAt", width: 15 },
      { header: "Updated At", key: "updatedAt", width: 15 },
    ],
  },
  host: {
    query: `
      SELECT id, ip, version, serverDevice, status, detail,  physicalId, name, authUsername,  authPassword, createdAt, updatedAt, category
      FROM host
    `,
    columns: [
      { header: "id", key: "id", width: 25 },
      { header: "IP", key: "ip", width: 20 },
      { header: "version", key: "version", width: 20 },
      { header: "serverDevice", key: "serverDevice", width: 15 },
      { header: "status", key: "status", width: 20 },
      { header: "detail", key: "detail", width: 15 },
      { header: "physicalId", key: "physicalId", width: 15 },
      { header: "name", key: "name", width: 15 },
      { header: "authUsername", key: "authUsername", width: 15 },
      { header: "authPassword", key: "authPassword", width: 15 },
      { header: "createdAt", key: "createdAt", width: 15 },
      { header: "updatedAt", key: "updatedAt", width: 15 },
      { header: "category", key: "category", width: 15 },
    ],
  },
  guest: {
    query: `
      SELECT id, name, ip, owner, domainInstance, ram, storage,  cpu, model, osVersion, status, detail, hostId, authUsername, authPassword, createdAt, updatedAt, category
      FROM guest
    `,
    columns: [
      { header: "id", key: "id", width: 25 },
      { header: "name", key: "name", width: 25 },
      { header: "IP", key: "ip", width: 20 },
      { header: "owner", key: "owner", width: 20 },
      { header: "domainInstance", key: "domainInstance", width: 15 },
      { header: "ram", key: "ram", width: 20 },
      { header: "storage", key: "storage", width: 15 },
      { header: "cpu", key: "cpu", width: 15 },
      { header: "model", key: "model", width: 15 },
      { header: "osVersion", key: "osVersion", width: 15 },
      { header: "status", key: "status", width: 15 },
      { header: "detail", key: "detail", width: 15 },
      { header: "hostId", key: "hostId", width: 15 },
      { header: "authUsername", key: "authUsername", width: 15 },
      { header: "authPassword", key: "authPassword", width: 15 },
      { header: "createdAt", key: "createdAt", width: 15 },
      { header: "updatedAt", key: "updatedAt", width: 15 },
      { header: "category", key: "category", width: 15 },
    ],
  },

  accessPoint: {
    query: `
        SELECT id,name, ip, type, category, tahunAnggaran, location, locationDetail, mac, controllerAP, code, createdAt, updatedAt
        FROM accessPoint
      `,
    columns: [
      { header: "id", key: "id", width: 25 },
      { header: "Name", key: "name", width: 25 },
      { header: "IP", key: "ip", width: 20 },
      { header: "Type", key: "type", width: 15 },
      { header: "Category", key: "category", width: 15 },
      { header: "Tahun Anggaran", key: "tahunAnggaran", width: 15 },
      { header: "Location", key: "location", width: 25 },
      { header: "Location Detail", key: "locationDetail", width: 25 },
      { header: "MAC", key: "mac", width: 25 },
      { header: "Controller AP", key: "controllerAP", width: 25 },
      { header: "Code", key: "code", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Updated At", key: "updatedAt", width: 20 },
    ],
  },
  switch: {
    query: `
        SELECT id,name, ip, type, location, locationDetail, status, code, createdAt, updatedAt, category, detail
        FROM switch
      `,
    columns: [
      { header: "id", key: "id", width: 25 },
      { header: "name", key: "name", width: 25 },
      { header: "IP", key: "ip", width: 20 },
      { header: "Type", key: "type", width: 15 },
      { header: "location", key: "location", width: 15 },
      { header: "locationDetail", key: "locationDetail", width: 15 },
      { header: "status", key: "status", width: 25 },
      { header: "Code", key: "code", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Updated At", key: "updatedAt", width: 20 },
      { header: "category", key: "category", width: 25 },
      { header: "detail", key: "detail", width: 25 },
    ],
  },
  router: {
    query: `
        SELECT id,name, ip, type, location, locationDetail, status, detail, code, createdAt, updatedAt, category
        FROM router
      `,
    columns: [
      { header: "id", key: "id", width: 25 },
      { header: "name", key: "name", width: 25 },
      { header: "IP", key: "ip", width: 20 },
      { header: "location", key: "location", width: 15 },
      { header: "locationDetail", key: "locationDetail", width: 15 },
      { header: "Type", key: "type", width: 15 },
      { header: "status", key: "status", width: 25 },
      { header: "detail", key: "detail", width: 25 },
      { header: "Code", key: "code", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Updated At", key: "updatedAt", width: 20 },
      { header: "category", key: "category", width: 25 },
    ],
  },

  cctv: {
    query: `
        SELECT id,name, ip, location, locationDetail, type, status, detail, code, createdAt, updatedAt, category
        FROM cctv
      `,
    columns: [
      { header: "id", key: "id", width: 25 },
      { header: "name", key: "name", width: 25 },
      { header: "IP", key: "ip", width: 20 },
      { header: "location", key: "location", width: 15 },
      { header: "locationDetail", key: "locationDetail", width: 15 },
      { header: "Type", key: "type", width: 15 },
      { header: "status", key: "status", width: 25 },
      { header: "detail", key: "detail", width: 25 },
      { header: "Code", key: "code", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Updated At", key: "updatedAt", width: 20 },
      { header: "category", key: "category", width: 25 },
    ],
  },
};
