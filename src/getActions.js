//
// If the annotations option is set this method inspects the function to
// see if it contains "@action functionName" to mark it as an action creator
//
export function inspectFunction(f) {
  if (!(f && f.toString && typeof f.toString === 'function')) return null;
  const lines = f.toString().match(/[^\r\n]+/g);
  let fname = null;
  lines.forEach((line) => {
    const ix = line.indexOf('@action ');
    if (ix >= 0) {
      const firstPart = line.substring(ix + 8); // everything after @action
      const ix2 = firstPart.indexOf('"');
      if (ix2 > 0) {
        fname = firstPart.substring(0, ix2);
        if (fname) fname = fname.trim();
      }
    }
  });
  return fname;
}

export default function getActions(moduleObject, ignoreList, useAnnotations) {
  if (!moduleObject) return {};
  if (typeof moduleObject !== 'object') return {};

  let actions = {};
  Object.keys(moduleObject).forEach(prop => {
    const obj = moduleObject[prop];
    if (typeof obj === 'function') {
      if (useAnnotations) {
        let fname = inspectFunction(obj)
        if (fname) {
          actions[fname] = obj;
        }
      }
      else {
        const fname = obj.name;
        if (fname && ignoreList.indexOf(fname) < 0) {
          actions[obj.name] = obj;
        }
      }
    }
  });
  return actions;
}
