import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { setContext } from 'apollo-link-context';
import News from '../News';

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

jest.mock('apollo-client', () => {
  function MockClient() {}
  return { ApolloClient: MockClient };
});

jest.mock('../../app/DBManager', () => {
  const dbManager = { app: { token: 'METEOR TOKEN' } };
  return dbManager;
});

beforeEach(() => {
  jest.resetModules();
});

it('News is instantiated', () => {
  const news = new News();
  expect(news).toBeTruthy();
  expect(setContext).toBeCalled();
});

it('News renders correctly', () => {
  jest.unmock('apollo-link-context');
  jest.unmock('apollo-client');
  const NewsComponent = jest.requireActual('../News').default;
  const tree = shallow(<NewsComponent />);
  const provider = tree.find('ApolloProvider');
  expect(provider.length).toBe(1);
  expect(provider.children().length).toBe(1);
});
