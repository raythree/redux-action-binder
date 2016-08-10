const assert = require('assert')
const actionBinder = require('../index').actionBinder;

describe('redux-action-binder tests', function () {

  beforeEach(() => {
  });

  it('should export properly', function () {
    assert(actionBinder);
    assert(typeof actionBinder.getBoundActions === 'function');
    assert(typeof actionBinder.ignore === 'function');
  });


  it('should get an action from an object', function () {
    const obj = {
      a: 'a string',
      b: function func1() {
        return { type: 'ACTION1' };
      },
      c: function func2() {
        return { typeX: 'ACTION1' };
      }
    };
    const actions = actionBinder.getBoundActions(obj);
    assert(actions.func1);
    assert(Object.keys(actions).length === 1);
  });



})
