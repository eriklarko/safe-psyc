// @flow

jest.unmock('react-navigation');

import React from 'react';

import renderer from 'react-test-renderer';

// TODO: react-navigation is bad after eject
// /home/erik/Code/safe-psyc/node_modules/react-navigation/src/navigators/StackNavigator.js:3
// import React from 'react';
// ^^^^^^

//    SyntaxError: Unexpected token import
it.skip('renders without crashing', () => {
    const App = require('./App.js');
    // $FlowFixMe
    const rendered = renderer.create(<App />).toJSON();
    expect(rendered).toBeTruthy();
});
