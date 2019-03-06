import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Actions } from 'react-native-router-flux';
import DbManager from '../../app/DBManager';
import CategoriesDetails from '../CategoriesDetails';

configure({ adapter: new Adapter() });

jest.mock('react-native-router-flux', () => ({
  Actions: {
    NewsComment: jest.fn(),
    NewsDetail: jest.fn(),
    pop: jest.fn(),
  },
}));

jest.mock('../../app/DBManager', () => {
  const dbManager = {
    user: {
      id: 123,
      name: 'test-name',
      username: 'test-username',
    },
  };
  return dbManager;
});

DbManager.user.findById = jest.fn();

let categoriesData = {
  navigation: {
    state: {
      params: {
        categoriesName: 'news',
        categoriesData: {
          items: {
            results: [
              {
                __typename: 'Post',
                _id: 'ynCDtwqBhhqK2vveG',
                title: 'Egypt attack: More than 230 killed in Sinai mosque - BBC News 🎈', //  null  line 188
                url: 'http://www.bbc.com/news/world-middle-east-42110223',
                slug: 'egypt-attack-more-than-230-killed-in-sinai-mosque-bbc-news',
                postedAt: '2017-11-24T19:21:42.183Z',
                createdAt: '2017-11-24T19:21:42.183Z',
                sticky: false,
                status: 2,
                excerpt:
                  'The gun and bomb assault in Sinai is the deadliest militant attack in Egypt\n',
                viewCount: 4, // null line 208
                clickCount: 1, // null line 216
                userId: 'BZuKgmPeYjBWWvaxk',
                user: {
                  _id: 'BZuKgmPeYjBWWvaxk',
                  slug: 'admin',
                  username: 'admin',
                  displayName: 'admin', // null  line 102
                  emailHash: 'afcb7d3a42a9fdfe50bfa98f7daf6d93',
                  avatarUrl:
                    'https://secure.gravatar.com/avatar/afcb7d3a42a9fdfe50bfa98f7daf6d93?size=200&default=mm', //  null/false   line 91
                  __typename: 'User',
                },
                thumbnailUrl:
                  'https://ichef-1.bbci.co.uk/news/1024/cpsprodpb/B1ED/production/_98894554_mediaitem98894553.jpg', //   null  line 176
                categories: [{ name: 'news' }], // "name" line 44
                commentCount: 3, // null line 135
                commenters: [
                  {
                    _id: 'Z2mNWQuJXFTJCnMyi',
                    slug: 'tester',
                    username: 'tester',
                    displayName: 'tester',
                    emailHash: '0db53901eca1472a8997a38a24b38d06',
                    avatarUrl:
                      'https://secure.gravatar.com/avatar/0db53901eca1472a8997a38a24b38d06?size=200&default=mm',
                    __typename: 'User',
                  },
                ],
                currentUserVotes: [
                  {
                    _id: '9LDpdbmQpig9SN6X3',
                    voteType: 'upvote',
                    power: 1,
                    __typename: 'Vote',
                  },
                ],
                baseScore: 2, // null line 122
                score: 0.499763,
                color: 'blue',
              },
            ],
          },
        },
      },
    },
  },
};

beforeEach(() => {
  jest.resetModules();
});

it('render correctly with all props', () => {
  const rendered = renderer.create(<CategoriesDetails {...categoriesData} />).toJSON();

  expect(rendered).toMatchSnapshot();
});

it('CatDetail unmounts correctly', () => {
  const CatDetailTree = shallow(<CategoriesDetails {...categoriesData} />);
  CatDetailTree.unmount();

  expect(CatDetailTree._mounted).toBeFalsy();
});

it('NavBAr TO is clicked', () => {
  const CatDetail = shallow(<CategoriesDetails {...categoriesData} />);
  const navBar = CatDetail.find('NavBar').first();
  const TO = navBar
    .shallow()
    .find('TouchableOpacity')
    .first();
  TO.props().onPress();

  expect(Actions.pop).toBeCalled();
});

it('renderItem TO Actions.NewsComment is called', () => {
  const CatDetail = shallow(<CategoriesDetails {...categoriesData} />);
  const flatList = CatDetail.find('FlatList').first();
  const data = flatList.props().data[0];
  const rendererItem = shallow(flatList.props().renderItem({ item: data }));
  const TO = rendererItem.find({ name: 'message1' }).parent();
  TO.props().onPress();

  expect(Actions.NewsComment).toBeCalled();
});

it('renderItem TO Actions.NewsDetail is called', () => {
  const CatDetail = shallow(<CategoriesDetails {...categoriesData} />);
  const flatList = CatDetail.find('FlatList').first();
  const data = flatList.props().data[0];
  const rendererItem = shallow(flatList.props().renderItem({ item: data }));
  const TO = rendererItem.find('TouchableOpacity').at(2);
  TO.props().onPress();

  expect(Actions.NewsDetail).toBeCalled();
});

it('keyExtractor', () => {
  const CatDetail = shallow(<CategoriesDetails {...categoriesData} />);
  const flatList = CatDetail.find('FlatList').first();
  const data = flatList.props().data[0];

  expect(flatList.props().keyExtractor({ ...data })).toEqual('ynCDtwqBhhqK2vveG');
});

// UT with props (viewCount, clickCount, displayName, avatarUrl, thumbnailUrl, commentCount, basescore) = false
it('render correctly with categories data', () => {
  categoriesData = {
    navigation: {
      state: {
        params: {
          categoriesName: 'news',
          categoriesData: {
            items: {
              results: [
                {
                  __typename: 'Post',
                  _id: 'ynCDtwqBhhqK2vveG',
                  title: 'Egypt attack: More than 230 killed in Sinai mosque - BBC News 🎈', //  null  line 188
                  url: 'http://www.bbc.com/news/world-middle-east-42110223',
                  slug: 'egypt-attack-more-than-230-killed-in-sinai-mosque-bbc-news',
                  postedAt: '2017-11-24T19:21:42.183Z',
                  createdAt: '2017-11-24T19:21:42.183Z',
                  sticky: false,
                  status: 2,
                  excerpt:
                    'The gun and bomb assault in Sinai is the deadliest militant attack in Egypt\n',
                  viewCount: null, // 4 line 208
                  clickCount: null, // 1 line 216
                  userId: 'BZuKgmPeYjBWWvaxk',
                  user: {
                    // I added new key in object user
                    name: 'admin', // null line 55
                    // ----------------------------------
                    _id: 'BZuKgmPeYjBWWvaxk',
                    slug: 'admin',
                    username: 'admin',
                    //   "displayName": "admin",  // null  line 102
                    emailHash: 'afcb7d3a42a9fdfe50bfa98f7daf6d93',
                    avatarUrl: null, //  null/false   line 91
                    //  "https://secure.gravatar.com/avatar/afcb7d3a42a9fdfe50bfa98f7daf6d93?size=200&default=mm"
                    __typename: 'User',
                  },
                  thumbnailUrl: null, //   null  line 176
                  // "https://ichef-1.bbci.co.uk/news/1024/cpsprodpb/B1ED/production/_98894554_mediaitem98894553.jpg"
                  categories: [{ name: 'news' }], // "name" line 44
                  commentCount: null, // 3 line 135
                  commenters: [
                    {
                      _id: 'Z2mNWQuJXFTJCnMyi',
                      slug: 'tester',
                      username: 'tester',
                      displayName: 'tester',
                      emailHash: '0db53901eca1472a8997a38a24b38d06',
                      avatarUrl:
                        'https://secure.gravatar.com/avatar/0db53901eca1472a8997a38a24b38d06?size=200&default=mm',
                      __typename: 'User',
                    },
                  ],
                  currentUserVotes: [
                    {
                      _id: '9LDpdbmQpig9SN6X3',
                      voteType: 'upvote',
                      power: 1,
                      __typename: 'Vote',
                    },
                  ],
                  baseScore: null, // 2 line 122
                  score: 0.499763,
                  color: 'blue',
                },
              ],
            },
          },
        },
      },
    },
  };
  const rendered = renderer.create(<CategoriesDetails {...categoriesData} />).toJSON();

  expect(rendered).toMatchSnapshot();
});

// UT with props (viewCount, cliclCount, displayName, avatarUrl,
// thumbnailUrl, commentCount, basescore, user.name, user.username) = false

it('render correctly with false props', () => {
  categoriesData = {
    navigation: {
      state: {
        params: {
          categoriesName: 'test', // line 63 'news'
          categoriesData: {
            items: {
              results: [
                {
                  __typename: 'Post',
                  _id: 'ynCDtwqBhhqK2vveG',
                  title: 'Egypt attack: More than 230 killed in Sinai mosque - BBC News 🎈', //  null  line 188
                  url: 'http://www.bbc.com/news/world-middle-east-42110223',
                  slug: 'egypt-attack-more-than-230-killed-in-sinai-mosque-bbc-news',
                  postedAt: '2017-11-24T19:21:42.183Z',
                  createdAt: '2017-11-24T19:21:42.183Z',
                  sticky: false,
                  status: 2,
                  excerpt:
                    'The gun and bomb assault in Sinai is the deadliest militant attack in Egypt\n',
                  viewCount: null, // 4 line 208
                  clickCount: null, // 1 line 216
                  userId: 'BZuKgmPeYjBWWvaxk',
                  user: {
                    // I added new key in object user
                    name: null, // "admin" line 55
                    // ----------------------------------
                    _id: 'BZuKgmPeYjBWWvaxk',
                    slug: 'admin',
                    username: null,
                    //   "displayName": "admin",  // null  line 102
                    emailHash: 'afcb7d3a42a9fdfe50bfa98f7daf6d93',
                    avatarUrl: null, //  null/false   line 91
                    //  "https://secure.gravatar.com/avatar/afcb7d3a42a9fdfe50bfa98f7daf6d93?size=200&default=mm"
                    __typename: 'User',
                  },
                  thumbnailUrl: null, //   null  line 176
                  // "https://ichef-1.bbci.co.uk/news/1024/cpsprodpb/B1ED/production/_98894554_mediaitem98894553.jpg"
                  categories: [{ name: 'news' }], // "name" line 44
                  commentCount: null, // 3 line 135
                  commenters: [
                    {
                      _id: 'Z2mNWQuJXFTJCnMyi',
                      slug: 'tester',
                      username: 'tester',
                      displayName: 'tester',
                      emailHash: '0db53901eca1472a8997a38a24b38d06',
                      avatarUrl:
                        'https://secure.gravatar.com/avatar/0db53901eca1472a8997a38a24b38d06?size=200&default=mm',
                      __typename: 'User',
                    },
                  ],
                  currentUserVotes: [
                    {
                      _id: '9LDpdbmQpig9SN6X3',
                      voteType: 'upvote',
                      power: 1,
                      __typename: 'Vote',
                    },
                  ],
                  baseScore: null, // 2 line 122
                  score: 0.499763,
                  color: 'blue',
                },
              ],
            },
          },
        },
      },
    },
  };

  const rendered = renderer.create(<CategoriesDetails {...categoriesData} />).toJSON();

  expect(rendered).toMatchSnapshot();
});

// UT with props (viewCount, cliclCount, displayName, avatarUrl,
// thumbnailUrl, commentCount, basescore, user.name, user.username,
// categoriesName, categorias.name) = false

it('render correctly with false props2', () => {
  categoriesData = {
    navigation: {
      state: {
        params: {
          categoriesName: 'test', // line 63 'news'
          categoriesData: {
            items: {
              results: [
                {
                  __typename: 'Post',
                  _id: 'ynCDtwqBhhqK2vveG',
                  title: 'Egypt attack: More than 230 killed in Sinai mosque - BBC News 🎈', //  null  line 188
                  url: 'http://www.bbc.com/news/world-middle-east-42110223',
                  slug: 'egypt-attack-more-than-230-killed-in-sinai-mosque-bbc-news',
                  postedAt: '2017-11-24T19:21:42.183Z',
                  createdAt: '2017-11-24T19:21:42.183Z',
                  sticky: false,
                  status: 2,
                  excerpt:
                    'The gun and bomb assault in Sinai is the deadliest militant attack in Egypt\n',
                  viewCount: null, // 4 line 208
                  clickCount: null, // 1 line 216
                  userId: 'BZuKgmPeYjBWWvaxk',
                  user: {
                    // I added new key in object user
                    name: null, // "admin" line 55
                    // ----------------------------------
                    _id: 'BZuKgmPeYjBWWvaxk',
                    slug: 'admin',
                    username: null,
                    displayName: null, // null  line 102 "admin"
                    emailHash: 'afcb7d3a42a9fdfe50bfa98f7daf6d93',
                    avatarUrl: null, //  null/false   line 91
                    //  "https://secure.gravatar.com/avatar/afcb7d3a42a9fdfe50bfa98f7daf6d93?size=200&default=mm"
                    __typename: 'User',
                  },
                  thumbnailUrl: null, //   null  line 176
                  // "https://ichef-1.bbci.co.uk/news/1024/cpsprodpb/B1ED/production/_98894554_mediaitem98894553.jpg"
                  categories: [{ test: 'news' }], // "name" line 44 false
                  commentCount: null, // 3 line 135
                  commenters: [
                    {
                      _id: 'Z2mNWQuJXFTJCnMyi',
                      slug: 'tester',
                      username: 'tester',
                      displayName: 'tester',
                      emailHash: '0db53901eca1472a8997a38a24b38d06',
                      avatarUrl:
                        'https://secure.gravatar.com/avatar/0db53901eca1472a8997a38a24b38d06?size=200&default=mm',
                      __typename: 'User',
                    },
                  ],
                  currentUserVotes: [
                    {
                      _id: '9LDpdbmQpig9SN6X3',
                      voteType: 'upvote',
                      power: 1,
                      __typename: 'Vote',
                    },
                  ],
                  baseScore: null, // 2 line 122
                  score: 0.499763,
                  color: 'blue',
                },
              ],
            },
          },
        },
      },
    },
  };

  DbManager.user.findById = jest.fn(() => true);
  const rendered = renderer.create(<CategoriesDetails {...categoriesData} />).toJSON();

  expect(rendered).toMatchSnapshot();
});
