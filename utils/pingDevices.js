const ping = require("ping");

const pingDevice = async (ip) => {
  try {
    const res = await ping.promise.probe(ip, {
      timeout: 2,
    });

    return {
      alive: res.alive,
      time: res.time,
    };
  } catch (err) {
    return {
      alive: false,
      time: null,
    };
  }
};

module.exports = pingDevice;
