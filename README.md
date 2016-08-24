# redux-action-binder
A helper to easily and efficiently expose bound action creators.

### Installation
```
npm install redux-action-binder
```
### Usage

This was designed with ["Ducks reducer bundles"](https://github.com/erikras/ducks-modular-redux) in mind but regardless, it will bind all named functions located in a module. As an example, assuming a structure [similar to this](https://github.com/erikras/react-redux-universal-hot-example/tree/master/src/redux):

```
redux/
  reducer.js  // returns the combined reducer
  actions.js  // returns the bound actions (see below)
  modules/
    auth.js   // reducer modules exporting action constants, actions and module reducer
    login.js
    posts.js
```

```javascript
// actions.js
import actionBinder from 'redux-action-binder';

// extract actions from all modules
import * as login from './login';
import * as auth from './auth';
import * as posts from './posts';

actionBinder.bindActions({ login, auth, posts });
const getBoundActions = actionBinder.getBoundActions;
export { getBoundActions };
```

In the PostsContainer class:
```javascript
import { getBoundActions } from './redux/actions';

function mapStateToProps(state) {
  return {
    posts: state.posts
  };
}

function mapDispatchToProps(dispatch) {
  return getBoundActions(dispatch).posts();
}

// or

function mapDispatchToProps(dispatch) {
  return {
    login: getBoundActions(dispatch).login(),
    posts: getBoundActions(dispatch).posts()
  }  
}
```
Note that getBoundActions returns an object who's properties are functions. Calling posts() the first time will invoke bindActionCreators on all post actions and subsequent calls will return the already bound actions. Actions are bound only once per each module. *NOTE:* See warning about testing below.

### What gets bound
The actionBinder currently imports *all named* functions from the modules provided. If the modules include other functions you can tell the actionBinder to ignore them by providing a second argument:

```javascript
actionBinder.bindActions(...modules, ['func1', 'func2']);
```
In this case it will ignore functions func1 and func2.

### Warning about running tests
If you are running tests with a beforeEach that resets the store, don't forget that the action binder caches the bound functions. For this specific use case, you will need to ```reset``` it and rebind the actions. For example, here is the ```redux/actions.js``` that exposes the bound methods as well as the ```reset``` function:

```javascript
import actionBinder from 'redux-action-binder';
import * as login from './modules/login';
import * as auth from './modules/auth';
import * as posts   from './modules/posts';

actionBinder.bindActions({login, auth, posts});
const getBoundActions = actionBinder.getBoundActions;

const resetActionBinder = () => {
  actionBinder.reset();
  actionBinder.bindActions({login, auth, posts});
};

export { getBoundActions, resetActionBinder };
```
Call the resetActionBinder method each time you reconfigure the store for your tests.
