import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MockedProvider } from 'react-apollo/test-utils';
import PropTypes from 'prop-types';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Actions } from 'react-native-router-flux';
import DbManager from '../../app/DBManager';
import NewsList from '../NewsList';

configure({ adapter: new Adapter() });

jest.mock('react-native-router-flux', () => ({
  Actions: {
    NewsComment: jest.fn(),
    NewsDetail: jest.fn(),
    CategoriesDetails: jest.fn(),
    pop: jest.fn(),
  },
}));

jest.mock('../../app/DBManager', () => {
  const dbManager = {
    user: {
      findById: jest.fn(() => null),
    },
  };
  return dbManager;
});

const MYQUERY = gql`
  query multiPostQuery($input: MultiPostInput) {
    posts(input: $input) {
      results {
        ...PostsList
        __typename
      }
    }
  }

  fragment PostsList on Post {
    _id
    title
    url
    slug
    postedAt
    createdAt
    sticky
    status
    excerpt
    viewCount
    clickCount
    userId
    user {
      ...UsersMinimumInfo
      __typename
    }
    thumbnailUrl
    categories {
      ...CategoriesMinimumInfo
      __typename
    }
    commentCount
    commenters {
      ...UsersMinimumInfo
      __typename
    }
    currentUserVotes {
      ...VoteFragment
      __typename
    }
    baseScore
    score
    color
    __typename
  }

  fragment UsersMinimumInfo on User {
    _id
    slug
    username
    displayName
    emailHash
    avatarUrl
    __typename
  }

  fragment CategoriesMinimumInfo on Category {
    _id
    name
    slug
    __typename
  }

  fragment VoteFragment on Vote {
    _id
    voteType
    power
    __typename
  }
`;

const INCREMENT_LIKES = gql`
  mutation vote($documentId: String, $voteType: String, $collectionName: String, $voteId: String) {
    vote(
      documentId: $documentId
      voteType: $voteType
      collectionName: $collectionName
      voteId: $voteId
    ) {
      ... on Post {
        __typename
        _id
        currentUserVotes {
          _id
          voteType
          power
          __typename
        }
        baseScore
        score
      }
    }
  }
`;

const getTop = {
  input: {
    terms: {
      view: 'top',
      limit: 20,
      itemsPerPage: 20,
    },
    enableTotal: true,
  },
};

const mocks = [
  {
    request: {
      query: MYQUERY,
      variables: getTop,
    },
    result: {
      data: {
        posts: {
          results: {
            __typename: 'Post',
            _id: 'ynCDtwqBhhqK2vveG',
            title: 'Egypt attack: More than 230 killed in Sinai mosque - BBC News 🎈',
            url: 'http://www.bbc.com/news/world-middle-east-42110223',
            slug: 'egypt-attack-more-than-230-killed-in-sinai-mosque-bbc-news',
            postedAt: '2017-11-24T19:21:42.183Z',
            createdAt: '2017-11-24T19:21:42.183Z',
            sticky: false,
            status: 2,
            excerpt:
              'The gun and bomb assault in Sinai is the deadliest militant attack in Egypt\n',
            viewCount: 4,
            clickCount: 1,
            userId: 'BZuKgmPeYjBWWvaxk',
            user: {
              _id: 'BZuKgmPeYjBWWvaxk',
              slug: 'admin',
              username: 'admin',
              displayName: 'admin',
              emailHash: 'afcb7d3a42a9fdfe50bfa98f7daf6d93',
              avatarUrl:
                'https://secure.gravatar.com/avatar/afcb7d3a42a9fdfe50bfa98f7daf6d93?size=200&default=mm',
              __typename: 'User',
            },
            thumbnailUrl:
              'https://ichef-1.bbci.co.uk/news/1024/cpsprodpb/B1ED/production/_98894554_mediaitem98894553.jpg',
            categories: [],
            commentCount: 3,
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
            baseScore: 2,
            score: 0.499763,
            color: 'blue',
          },
        },
      },
    },
  },
  {
    request: {
      query: INCREMENT_LIKES,
      variables: {
        documentId: 'ynCDtwqBhhqK2vveG',
        voteType: 'upvote',
        collectionName: 'Posts',
        voteId: 1111111111,
      },
    },
    result: {
      data: {
        posts: {
          results: {
            __typename: 'Post',
            _id: 'ynCDtwqBhhqK2vveG',
            currentUserVotes: [
              {
                _id: '9LDpdbmQpig9SN6X3',
                voteType: 'upvote',
                power: 1,
                __typename: 'Vote',
              },
              {
                _id: '1111111111111111',
                voteType: 'upvote',
                power: 1,
                __typename: 'Vote',
              },
            ],
            baseScore: 2,
            score: 0.499763,
          },
        },
      },
    },
  },
];

const client = new ApolloClient({
  link: new HttpLink(),
  cache: new InMemoryCache(),
});

jest.useFakeTimers();

it('NewsList renders without props', () => {
  const rendered = renderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
      <NewsList />
    </MockedProvider>,
  );
  expect(rendered).toMatchSnapshot();
});

it('NewsList unmounts correctly', () => {
  const tree = shallow(<NewsList />, {
    context: { client },
    childContextTypes: {
      client: PropTypes.object.isRequired,
    },
  });
  const inst = tree
    .dive()
    .dive()
    .instance();
  inst.componentWillUnmount();
  expect(inst._mounted).toBe(false);
});

it('NewsList - keyExtractor', () => {
  const item = {
    _id: 'ynCDtwqBhhqK2vveG',
    title: 'Egypt attack: More than 230 killed in Sinai mosque - BBC News 🎈',
  };
  const tree = shallow(<NewsList />, {
    context: { client },
    childContextTypes: {
      client: PropTypes.object.isRequired,
    },
  })
    .dive()
    .dive();
  const instance = tree.instance();
  const id = instance.keyExtractor(item);
  expect(id).toMatch(item._id);
});

it('NewsList - renderList - loading', () => {
  const refresh = jest.fn();
  const tree = shallow(<NewsList loading={true} items={[]} error={null} refresh={refresh} />, {
    context: { client },
    childContextTypes: {
      client: PropTypes.object.isRequired,
    },
  })
    .dive()
    .dive();
  const instance = tree.instance();
  const list = shallow(<View>{instance.renderList()}</View>);
  expect(list.find('Loading').length).toBe(1);
});

it('NewsList - navbar onPress - topSelected', () => {
  const tree = shallow(<NewsList />, {
    context: { client },
    childContextTypes: {
      client: PropTypes.object.isRequired,
    },
  })
    .dive()
    .dive();
  const instance = tree.instance();
  const screen = shallow(instance.render());
  const rightOpacity = screen
    .find('NavBar')
    .shallow()
    .find('TouchableOpacity')
    .first();
  rightOpacity.props().onPress();
  expect(tree.state().newSelected).toBe(false);
  expect(tree.state().bestSelected).toBe(false);
  expect(tree.state().topSelected).toBe(true);
});

it('NewsList - navbar onPress - newSelected', () => {
  const tree = shallow(<NewsList />, {
    context: { client },
    childContextTypes: {
      client: PropTypes.object.isRequired,
    },
  })
    .dive()
    .dive();
  const instance = tree.instance();
  const screen = shallow(instance.render());
  const rightOpacity = screen
    .find('NavBar')
    .shallow()
    .find('TouchableOpacity')
    .at(1);
  rightOpacity.props().onPress();
  expect(tree.state().newSelected).toBe(true);
  expect(tree.state().bestSelected).toBe(false);
  expect(tree.state().topSelected).toBe(false);
});

it('NewsList - navbar onPress - bestSelected', () => {
  const tree = shallow(<NewsList />, {
    context: { client },
    childContextTypes: {
      client: PropTypes.object.isRequired,
    },
  })
    .dive()
    .dive();
  const instance = tree.instance();
  const screen = shallow(instance.render());
  const rightOpacity = screen
    .find('NavBar')
    .shallow()
    .find('TouchableOpacity')
    .at(2);
  rightOpacity.props().onPress();
  expect(tree.state().newSelected).toBe(false);
  expect(tree.state().bestSelected).toBe(true);
  expect(tree.state().topSelected).toBe(false);
});

describe('NewsList - renderItem', () => {
  const item = {
    __typename: 'Post',
    _id: 'ynCDtwqBhhqK2vveG',
    title: 'Egypt attack: More than 230 killed in Sinai mosque - BBC News 🎈',
    url: 'http://www.bbc.com/news/world-middle-east-42110223',
    slug: 'egypt-attack-more-than-230-killed-in-sinai-mosque-bbc-news',
    postedAt: '2017-11-24T19:21:42.183Z',
    createdAt: '2017-11-24T19:21:42.183Z',
    sticky: false,
    status: 2,
    excerpt: 'The gun and bomb assault in Sinai is the deadliest militant attack in Egypt\n',
    viewCount: 4,
    clickCount: 1,
    userId: 'BZuKgmPeYjBWWvaxk',
    user: {
      _id: 'BZuKgmPeYjBWWvaxk',
      slug: 'admin',
      username: 'admin',
      displayName: 'admin',
      emailHash: 'afcb7d3a42a9fdfe50bfa98f7daf6d93',
      avatarUrl:
        'https://secure.gravatar.com/avatar/afcb7d3a42a9fdfe50bfa98f7daf6d93?size=200&default=mm',
      __typename: 'User',
    },
    thumbnailUrl:
      'https://ichef-1.bbci.co.uk/news/1024/cpsprodpb/B1ED/production/_98894554_mediaitem98894553.jpg',
    categories: 'news',
    commentCount: 3,
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
    baseScore: 2,
    score: 0.499763,
    color: 'blue',
  };

  it('onPress of a news comment button', () => {
    DbManager.user.findById.mockClear();
    Actions.NewsComment.mockClear();
    const tree = shallow(<NewsList />, {
      context: { client },
      childContextTypes: {
        client: PropTypes.object.isRequired,
      },
    })
      .dive()
      .dive();
    const instance = tree.instance();
    const card = shallow(instance.renderItem({ item }));
    const commentButton = card.find({ name: 'message1' }).parent();

    commentButton.props().onPress();
    expect(Actions.NewsComment).toBeCalledWith({ newsDetails: item });
  });

  it('onPress of a news detail button', () => {
    DbManager.user.findById = jest.fn(() => ({
      _id: 'BZuKgmPeYjBWWvaxk',
      name: 'admin',
    }));
    DbManager.user.findById.mockClear();
    Actions.NewsDetail.mockClear();
    item.user.displayName = null;
    item.commentCount = null;
    item.thumbnailUrl = null;
    item.categories = ['news', 'politics'];
    const tree = shallow(<NewsList />, {
      context: { client },
      childContextTypes: {
        client: PropTypes.object.isRequired,
      },
    })
      .dive()
      .dive();
    const instance = tree.instance();
    const card = shallow(instance.renderItem({ item }));
    const newsDetailButton = card.find('TouchableOpacity').at(1);
    newsDetailButton.props().onPress();
    expect(Actions.NewsDetail).toBeCalledWith({
      newsUrl: item.url,
      newsTitle: item.title,
      newsDetails: item,
    });
  });

  it('onPress of a categories detail button', () => {
    DbManager.user.findById = jest.fn(() => ({
      _id: 'BZuKgmPeYjBWWvaxk',
      name: 'admin',
    }));
    DbManager.user.findById.mockClear();
    Actions.CategoriesDetails.mockClear();
    item.categories = [{ name: 'news' }, { name: 'politics' }];
    item.thumbnailUrl =
      'https://ichef-1.bbci.co.uk/news/1024/cpsprodpb/B1ED/production/_98894554_mediaitem98894553.jpg';
    const tree = shallow(<NewsList />, {
      context: { client },
      childContextTypes: {
        client: PropTypes.object.isRequired,
      },
    })
      .dive()
      .dive();
    const instance = tree.instance();
    const card = shallow(instance.renderItem({ item }));
    const categoriesDetailButton = card.find('TouchableOpacity').at(2);
    categoriesDetailButton.props().onPress();
    expect(Actions.CategoriesDetails).toBeCalled();
  });
});
