//
// Extract all action named functions from a modules exports.
//
export default function getActions(moduleObject, ignoreList) {
  if (!moduleObject) return {};
  if (typeof moduleObject !== 'object') return {};

  let actions = {};
  Object.keys(moduleObject).forEach(prop => {
    const obj = moduleObject[prop];
    if (typeof obj === 'function') {
      const fname = obj.name;
      if (fname && ignoreList.indexOf(fname) < 0) {
        actions[obj.name] = obj;
      }
    }
  });
  return actions;
}
