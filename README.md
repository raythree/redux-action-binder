# redux-action-binder
A helper to easily and efficiently expose bound action creators.

NOTE: This package is designed to work with [redux "ducks" modules](https://github.com/erikras/ducks-modular-redux).

### Installation
```
npm install redux-action-binder
```

### Usage

In redux/modules:

```javascript
import { actionBinder } from 'redux-action-binder';

// typically you'll be loading all redux modules to create your combined reducer:
import { login } from './login';
import { auth } from './auth';
import { posts } from './posts';
//...

actionBinder.ignore('x', 'y', 'z'); // do not execute any functions with these names

const getBoundActions = actionBinder.getBoundActions({ login, auth, posts });
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
