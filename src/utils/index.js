const _ = require('lodash');

function getSelectData(select = []) {
  return Object.fromEntries(select.map(el => [el, 1]));
}

function unGetSelectData(select = []) {
  return Object.fromEntries(select.map(el => [el, 0]));
}

function removeNilObject(obj) {
  return _.omitBy(obj, _.isNil);
}

const flattenObj = ob => {
  const result = {};

  for (const i in ob) {
    if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        result[`${i}.${j}`] = temp[j];
      }
    } else {
      result[i] = ob[i];
    }
  }
  return result;
};

module.exports = {
  getSelectData,
  unGetSelectData,
  removeNilObject,
  flattenObj,
};
