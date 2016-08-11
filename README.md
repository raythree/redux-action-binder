# redux-action-binder
A helper to easily and efficiently expose bound action creators.

### Installation
```
npm install redux-action-binder
```
### Usage

In redux/modules:

```javascript
import actionBinder from 'redux-action-binder';

// typically you'll be loading all redux modules to create your combined reducer:
import { login } from './login';
import { auth } from './auth';
import { posts } from './posts';
//...

actionBinder.bindActions({ login, auth, posts });
const getBoundActions = actionBinder.getBoundActions;

export getBoundActions;
```

In the PostsContainer class:
```javascript
import { getBoundActions } from './redux/modules';

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
Note that getBoundActions returns an object who's properties are functions. Calling
posts() the first time will invoke bindActionCreators on all post actions and subsequent
calls will return the already bound actions. Actions are bound only once per each module.

### What gets bound
[This](https://github.com/erikras/ducks-modular-redux) seems to be a very good way to structure redux actions, types and reducers. The actionBinder currently imports *all named* functions from the modules provided. If the modules include other functions you can tell the actionBinder to ignore them by providing a second argument:

```javascript
actionBinder.bindActions(...modules, ['func1', 'func2']);
```
In this case it will ignore functions func1 and func2.
