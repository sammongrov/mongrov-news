import React from 'react';
import { View } from 'react-native';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { setContext } from 'apollo-link-context';
import ApolloWrapper from '../ApolloWrapper';

configure({ adapter: new Adapter() });

jest.mock('apollo-link-context', () => ({
  setContext: jest.fn((cb) => {
    const headers = {
      header: 'ABDC',
    };
    cb({}, { headers });
    return { concat: jest.fn() };
  }),
}));

jest.mock('../../app/DBManager', () => {
  const dbManager = { app: { token: 'METEOR TOKEN' } };
  return dbManager;
});

beforeEach(() => {
  jest.resetModules();
});

it('ApolloWrapper is instantiated', () => {
  const apolloWrapper = new ApolloWrapper(View);
  expect(apolloWrapper).toBeTruthy();
  expect(setContext).toBeCalled();
});

it('ApolloWrapper renders correctly', () => {
  jest.unmock('apollo-link-context');
  const ApWrapper = jest.requireActual('../ApolloWrapper').default;
  console.log(ApWrapper);
  const TestComponent = ApWrapper(View);
  const tree = shallow(<TestComponent />);
  expect(tree.find('ApolloProvider').length).toBe(1);
  expect(tree.find('Component').length).toBe(1);
});
