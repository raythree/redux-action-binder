const assert = require('assert');
const getActions = require('../index');

describe('redux-action-binder tests', function () {

  beforeEach(() => {
  });

  it('should pass', function () {

    const obj = {
      a: 'a string',
      b: function func1() {
        return { type: 'ACTION1' };
      },
    };

    console.log("RETURN: " + getActions(obj))
    assert(typeof getActions() === 'object');

    const actions = {
      actionOne: (msg) => {
        return {type: 'ACTION_ONE' };
      },
      sayHello: (name, delay) => {
        return {type: 'SAY_HELLO', payload: name, delay: delay };
      }
    };

    const actionCreators = getActions(actions);
    assert(actionCreators.actionOne);

  });

})
