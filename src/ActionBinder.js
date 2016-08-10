import getActions from './getActions';

function ActionBinder() {

  const log = (msg) => { console.log('ActionBinder: ' + msg); }

  const ignoreNames = [];

  this.ignore = () => {
    for (let ix = 0; ix < arguments.length; ix++) {
      ignoreNames.push(arguments[ix]);
      log.debug('ignoring ' +  arguments[ix]);
    }
  };

  this.getBoundActions = (obj) => {
    return getActions(obj);
  };

}

export default new ActionBinder();
