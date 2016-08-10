const log = { debug: (msg) => {console.log('getActions: ' + msg)} }

//
// Extract all action creators from an object. An object is considered
// an action creator if it is a function that returns an object with
// a type property of type 'string'.
//
// () => { return {type: 'AN_ACTION' };}
//
export default function getActions(moduleObject) {
  if (!moduleObject) return {};
  if (typeof moduleObject !== 'object') return {};

  log.debug('getting actions')
  let actions = {};
  Object.keys(moduleObject).forEach(prop => {
    const obj = moduleObject[prop];
    if (typeof obj === 'function') {
      const ret = obj();
      if (ret && typeof ret === 'object') {
        if (ret['type'] && typeof ret['type'] === 'string') {
          console.log('got function ' + obj.name);
          if (obj.name) {
            actions[obj.name] = obj;
          }
        }
      }
    }
  });
  return actions;
}
