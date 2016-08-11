import { bindActionCreators } from 'redux';
import getActions from './getActions';

//------------------------------------------------------------------------------
// Usage:
//
// import { ActionBinder } from 'redux-action-binder';
//
// import auth from './auth';
// import login from './login';
// import posts from './posts';
//
// const actionBinder = new ActionBinder();
// actionBinder.bindActions({auth, login, posts});
//
// export default actionBinder.getBoundActions;
//
//------------------------------------------------------------------------------
function ActionBinder(opts) {

  const boundActions = {};
  const boundActionAccessor = {};

  const actions = {};       // actions to be bound
  const reducers = {};      // collected reducers for combining, only if reduce == true
  let reduxDispatch = null; // capture the dispach passed to getBoundActions(dispatch)

  const ignoreNames = [];

  if (opts && opts.ignore && typeof opts.ignore.forEach === 'function') {
    opts.ignore.forEach((name) => {
      ignoreNames.push(name);
    });
  }

  // Input is an object containing all imported redux modules keyed by module name.
  this.bindActions = (allModules) => {
    if (!allModules) return;
    if (!(typeof allModules === 'object')) return;
    Object.keys(allModules).forEach((modName) => {
      // for each module create an accessor function that will be used
      // to access all bound actions for the module. This function will
      // be called as getBoundActionds(dispatch).name() and will return either
      // the already bound actions from boundActions or it will call
      // bindActionCreators and cache the result in boundActions.
      boundActionAccessor[modName] = () => {
        if (boundActions[modName]) {
          // already bound this modules actions
          return boundActions[modName];
        }
        else {
          // bind action creators then store the result
          boundActions[modName] = bindActionCreators(actions[modName], reduxDispatch);
          return boundActions[modName];
        }
      }

      const modObject = allModules[modName];
      let moduleActions = getActions(modObject, ignoreNames);
      actions[modName] = moduleActions; // store all actions by name so they can be bound when needed
    });
  };

  this.getBoundActions = (dispatch) => {
    reduxDispatch = dispatch;
    return boundActionAccessor;
  };

}

export default ActionBinder;
