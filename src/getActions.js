// Extract all action creators from an object. An object is considered
// an action creator if it is a function that returns an object with
// a type property of type 'string'.
//
// () => { return {type: 'AN_ACTION' };}
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
