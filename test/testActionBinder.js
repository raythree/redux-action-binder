const assert = require('assert')
const ActionBinder = require('../index').ActionBinder;

//--------------------------------------------------------
// This is what will be passed to ActionBinder.bindActions
//--------------------------------------------------------
function makeModules() {
  const posts = {
    getPosts: function getPosts() {
      return {type: 'GET_POST'};
    },
    GET_POST: 'GET_POST',
    func2: function () {
      return null;
    }
  };

  const auth = {
    default: function reducer() {},
    login: function login() {
      return {type: 'LOGIN'};
    },
  }

  return {
    posts: posts,
    auth: auth
  };
}

describe('redux-action-binder tests', function () {

  let actionBinder;

  beforeEach(() => {
    actionBinder = new ActionBinder();
  });

  it('should export properly', function () {
    assert(actionBinder);
    assert(typeof actionBinder.getBoundActions === 'function');
  });


  it('should get bound actions from an object', function () {
    const allModules = makeModules();

    let count = 0;
    function dispatch() {
      count++;
      console.log('DISPATCH --> ' + count);
    }

    actionBinder.bindActions(allModules);
    const actions = actionBinder.getBoundActions(dispatch);

    assert(typeof actions.posts().getPosts === 'function');
    assert(typeof actions.auth().login === 'function');

    // make sure they're wrapped in dispatch
    actions.posts().getPosts();
    actions.auth().login();

    assert(count === 2);
  });


  it('should ignore functions marked as ignore', function () {
    const allModules = makeModules();

    let count = 0;
    function dispatch() {
      count++;
      console.log('DISPATCH --> ' + count);
    }

    actionBinder = new ActionBinder({ignore: ['login']});
    actionBinder.bindActions(allModules);
    const actions = actionBinder.getBoundActions(dispatch);

    assert(typeof actions.posts().getPosts === 'function');
    assert(typeof actions.auth === 'function');
    assert(typeof actions.auth().login === 'undefined');
  });

})
