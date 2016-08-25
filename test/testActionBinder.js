const assert = require('assert')
const actionBinder = require('../index');

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

function makeModulesWithAnnotations() {
  const posts = {
    getPosts: function getPosts() {
      "@action getPosts";
      return {type: 'GET_POST'};
    },
    GET_POST: 'GET_POST',
    func2: function () {
      // not annotated
      return null;
    }
  };

  const auth = {
    default: function reducer() {},
    login: function login() { "@action myLogin"; return {type: 'LOGIN'}; },
  }

  return {
    posts: posts,
    auth: auth
  };
}

describe('redux-action-binder tests', function () {

  beforeEach(() => {
    actionBinder.reset();
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

  it('should get not get actions that are not annotated', function () {
    const allModules = makeModules();
    function dispatch() {}

    actionBinder.config({useAnnotations: true});
    actionBinder.bindActions(allModules);
    const actions = actionBinder.getBoundActions(dispatch);
    assert(Object.keys(actions.posts()).length === 0);
    assert(Object.keys(actions.auth()).length === 0);
  });

  it('should get functions that are annotated', function () {
    const allModules = makeModulesWithAnnotations();
    function dispatch() {}

    actionBinder.config({useAnnotations: true});
    actionBinder.bindActions(allModules);
    const actions = actionBinder.getBoundActions(dispatch);
    assert(Object.keys(actions.posts()).length === 1);
    assert(Object.keys(actions.auth()).length === 1);
    assert(typeof actions.posts().getPosts === 'function');
    assert(typeof actions.auth().myLogin === 'function');
  });

  it('should ignore functions marked as ignore', function () {
    const allModules = makeModules();

    let count = 0;
    function dispatch() {
      count++;
      console.log('DISPATCH --> ' + count);
    }

    actionBinder.bindActions(allModules, ['login']);
    const actions = actionBinder.getBoundActions(dispatch);

    assert(typeof actions.posts().getPosts === 'function');
    assert(typeof actions.auth === 'function');
    assert(typeof actions.auth().login === 'undefined');
  });

})
