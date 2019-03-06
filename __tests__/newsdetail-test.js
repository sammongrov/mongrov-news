import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Actions } from 'react-native-router-flux';
import { BackHandler } from 'react-native';
import NewsDetailView from '../NewsDetail';
import NewsDetail from '../NewsDetail';

configure({ adapter: new Adapter() });

jest.mock('react-native-router-flux', () => ({
  Actions: {
    pop: jest.fn(),
    NewsComment: jest.fn(),
  },
}));

jest.mock('BackHandler', () => {
  const backHandler = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  return backHandler;
});

beforeEach(() => {
  jest.resetModules();
});

let newsDetails = {
  user: {
    avatarUrl: 'test_avatarUrl', // false ''
    displayName: 'test_displayName', // false ''
    username: 'test_userName',
  },
  postedAt: 'test_postedAt',
  baseScore: 1, // null
  commentCount: 2, // null
  title: 'test_title', // false ''
  thumbnailUrl: 'test_thumbnailUrl', // false ''
  body: 'test_body',
  viewCount: 3, // null
  clickCount: 4, // null
};

const newsUrl = 'test_newsUrl';

it('news detail renders correctly', () => {
  const rendered = renderer.create(<NewsDetailView newsDetails={newsDetails} />).toJSON();

  expect(rendered).toBeTruthy();
});

it('news detail snapshot test', () => {
  const rendered = renderer.create(<NewsDetailView newsDetails={newsDetails} />).toJSON();

  expect(rendered).toMatchSnapshot();
});

it('newsDetail unmounts correctly', () => {
  const newsDetailTree = shallow(<NewsDetail newsDetails={newsDetails} />);
  newsDetailTree.unmount();

  expect(BackHandler.removeEventListener).toHaveBeenCalled();
});

it('handleBackPress', () => {
  const rootComponent = shallow(<NewsDetail newsDetails={newsDetails} />);
  const instance = rootComponent.instance();
  const result = instance.handleBackPress();

  expect(result).toBe(true);
  expect(Actions.pop.mock.calls.length).toBe(1);
});

it('First TouchOP Actions is called', () => {
  const rootComp = shallow(<NewsDetail newsDetails={newsDetails} />);
  const navBar = rootComp.find('NavBar').first();
  const TouchOp = navBar
    .shallow()
    .find('TouchableOpacity')
    .first();
  TouchOp.props().onPress();

  expect(Actions.pop).toBeCalled();
});

it('TouchOp Actions is called in renderNewsContent', () => {
  const rootComp = shallow(<NewsDetail newsDetails={newsDetails} />);
  const TO = rootComp.find({ name: 'message1' }).parent();
  TO.props().onPress();

  expect(Actions.NewsComment).toBeCalled();
});

it('renderNewsContent first if', () => {
  const rootComp = shallow(<NewsDetail newsDetails={newsDetails} newsUrl={newsUrl} />);
  const webView = rootComp.find('WebView').first();

  expect(webView).toBeTruthy();
});

it('covered all branches with false/null', () => {
  newsDetails = {
    user: {
      avatarUrl: '', // false
      displayName: '', // false ''
      username: 'test_userName',
    },
    postedAt: 'test_postedAt',
    baseScore: null, // null
    commentCount: null, // null
    title: '', // false ''
    thumbnailUrl: '', // false ''
    body: 'test_body',
    viewCount: null, // null
    clickCount: null, // null
  };
  const newsDetailTree = renderer.create(<NewsDetail newsDetails={newsDetails} />).toJSON();

  expect(newsDetailTree).toMatchSnapshot();
});
