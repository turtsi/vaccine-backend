const getTotalInjections = (data) => {
  let totalInjections = 0;
  for (let i = 0; i < data.length; i++) {
    totalInjections += data[i].injections;
  }
  return totalInjections;
};

const getTotalUsed = (data) => {
  let totalUsed = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].dateInjected) {
      totalUsed += data[i].dateInjected.length;
    }
  }
  return totalUsed;
};

const getExpiredBottles = (data) => {
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].injections != data[i].dateInjected.length) count++;
  }
  return count;
};

const getVaccinatedGender = (data, gender) => {
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].dateInjected) {
      for (let j = 0; j < data[i].dateInjected.length; j++) {
        if (data[i].dateInjected[j].gender === gender) count++;
      }
    }
  }
  return count;
};

module.exports = {
  getTotalInjections,
  getTotalUsed,
  getExpiredBottles,
  getVaccinatedGender,
};
