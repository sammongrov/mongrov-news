/**
 * NewsList Screen
 */

import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import Random from 'react-native-meteor/lib/Random';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import {
  Loading,
  Screen,
  NavBar,
  Avatar,
  FontAwesomeIcon,
  FontAwesome5Icon,
  Icon,
  MaterialIcon,
  AntDesignIcon,
} from '@ui/components';
import { styles } from 'react-native-theme';
import { Card } from 'react-native-elements';
// import AppUtil from '@utils';
import FastImage from 'react-native-fast-image';
import gql from 'graphql-tag';
import { graphql, Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { Colors } from '@ui/theme_default';
import _ from 'lodash';
import AppUtils from '@mongrov/utils';
import {Application} from '@mongrov/config' ;
import {DBManager} from 'app-module';

/* Styles ==================================================================== */

/* Component ==================================================================== */
// var { height, width } = Dimensions.get('window');

/* Mutations ================================================================== */
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

class NewsList extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   layout: {
    //     height,
    //     width,
    //   },
    // };
    this.state = {
      topSelected: true,
      newSelected: false,
      bestSelected: false,
    };
    this._mounted = false;
  }

  componentDidMount() {
    this._insideStateUpdate = false;
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  // _onLayout = (event) => {
  //   this.setState({
  //     layout: {
  //       height: event.nativeEvent.layout.height,
  //       width: event.nativeEvent.layout.width,
  //     },
  //   });
  // };
  // {
  //   "__typename": "Post",
  //   "_id": "ynCDtwqBhhqK2vveG",
  //   "title": "Egypt attack: More than 230 killed in Sinai mosque - BBC News 🎈",
  //   "url": "http://www.bbc.com/news/world-middle-east-42110223",
  //   "slug": "egypt-attack-more-than-230-killed-in-sinai-mosque-bbc-news",
  //   "postedAt": "2017-11-24T19:21:42.183Z",
  //   "createdAt": "2017-11-24T19:21:42.183Z",
  //   "sticky": false,
  //   "status": 2,
  //   "excerpt": "The gun and bomb assault in Sinai is the deadliest militant attack in Egypt\n",
  //   "viewCount": 4,
  //   "clickCount": 1,
  //   "userId": "BZuKgmPeYjBWWvaxk",
  //   "user": {
  //     "_id": "BZuKgmPeYjBWWvaxk",
  //     "slug": "admin",
  //     "username": "admin",
  //     "displayName": "admin",
  //     "emailHash": "afcb7d3a42a9fdfe50bfa98f7daf6d93",
  //     "avatarUrl": "https://secure.gravatar.com/avatar/afcb7d3a42a9fdfe50bfa98f7daf6d93?size=200&default=mm",
  //     "__typename": "User"
  //   },
  //   "thumbnailUrl": "https://ichef-1.bbci.co.uk/news/1024/cpsprodpb/B1ED/production/_98894554_mediaitem98894553.jpg",
  //   "categories": [],
  //   "commentCount": 3,
  //   "commenters": [
  //     {
  //       "_id": "Z2mNWQuJXFTJCnMyi",
  //       "slug": "tester",
  //       "username": "tester",
  //       "displayName": "tester",
  //       "emailHash": "0db53901eca1472a8997a38a24b38d06",
  //       "avatarUrl": "https://secure.gravatar.com/avatar/0db53901eca1472a8997a38a24b38d06?size=200&default=mm",
  //       "__typename": "User"
  //     }
  //   ],
  //   "currentUserVotes": [
  //     {
  //       "_id": "9LDpdbmQpig9SN6X3",
  //       "voteType": "upvote",
  //       "power": 1,
  //       "__typename": "Vote"
  //     }
  //   ],
  //   "baseScore": 2,
  //   "score": 0.499763,
  //   "color": "blue"
  // },

  keyExtractor = (item) => item._id;

  renderItem = ({ item }) => {
    var data = item;
    const items = this.props;
    const cateName = [];
    if (data.categories && Array.isArray(data.categories)) {
      data.categories.map((catItem) => {
        if (catItem.name) {
          cateName.push(catItem.name);
        }
        return null;
      });
    }
    const user = DBManager.user.findById(data.userId)
      ? DBManager.user.findById(data.userId)
      : data.user;
    data.user.displayName = user.name ? user.name : user.username;
    data.user.avatarUrl = `${Application.urls.SERVER_URL}/avatar/${
      data.user.username
    }?_dc=undefined`;
    data.type = 'group';
    const excerpt = _.unescape(data.excerpt);
    return (
      <Card
        key={`list-row-${data._id}`}
        flexDirection="column"
        containerStyle={{
          borderRadius: 0,
          margin: 0,
          shadowOffset: { height: 0, width: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#FFF',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 15,
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {data.user.avatarUrl && (
              <Avatar
                avatarUrl={data.user.avatarUrl ? data.user.avatarUrl : null}
                avatarName={data.user.displayName}
                avatarSize={35}
              />
            )}
            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.newsUsernameText, { flex: 1, marginRight: 15, paddingLeft: 5 }]}
              >
                {data.user.displayName ? data.user.displayName : data.user.username}
              </Text>
              <Text style={[styles.newsTimeText, { paddingLeft: 5 }]}>
                {AppUtils.formatNewsDate(data.postedAt)}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Mutation mutation={INCREMENT_LIKES}>
              {(likeArticle) => (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingRight: 30,
                  }}
                  onPress={() => {
                    const variables = {
                      documentId: data._id,
                      voteType: 'upvote',
                      collectionName: 'Posts',
                      voteId: Random.id(),
                    };
                    // console.log('Variables', variables);
                    likeArticle({ variables });
                  }}
                >
                  <AntDesignIcon name="like2" color={Colors.ICON_COMMENT} size={16} />
                  <Text style={[styles.newsStatisticsText]}>
                    {data.baseScore !== null ? data.baseScore : 0}
                  </Text>
                </TouchableOpacity>
              )}
            </Mutation>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              onPress={() =>
                Actions.NewsComment({
                  newsDetails: data,
                })
              }
            >
              <AntDesignIcon name="message1" color={Colors.ICON_COMMENT} size={14} />
              <Text style={[styles.newsStatisticsText]}>
                {data.commentCount !== null ? data.commentCount : 0}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={{ flexDirection: 'column' }}
          onPress={() => {
            Actions.NewsDetail({
              newsUrl: data.url,
              newsTitle: data.title,
              newsDetails: data,
            });
          }}
        >
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
          >
            {data.title && <Text style={styles.newsTitleText}>{data.title}</Text>}
            <View>
              {cateName.map((cateNameItem) => (
                <TouchableOpacity
                  key={`cat-${cateNameItem._id}`}
                  style={{
                    marginRight: 5,
                    marginTop: 5,
                  }}
                  onPress={() => {
                    Actions.CategoriesDetails({
                      categoriesData: items,
                      categoriesName: cateNameItem,
                    });
                  }}
                >
                  <Text style={{ color: Colors.NAV_ICON }}>{`#${cateNameItem}`}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {data.thumbnailUrl && (
            <View style={styles.newsImageView}>
              <FastImage
                style={styles.newsImageHeight}
                source={{
                  uri: data.thumbnailUrl ? data.thumbnailUrl : data.avatarUrl,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          )}
          <View>
            <Text
              numberOfLines={2}
              style={[
                styles.newsExcerptText,
                data.thumbnailUrl || !data.title ? null : styles.marginTop10,
              ]}
            >
              {excerpt}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {data.viewCount && (
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 20 }}
            >
              <AntDesignIcon name="eyeo" color={Colors.ICON_COMMENT} size={16} />
              <Text style={styles.newsInfoText}>
                {data.viewCount !== null ? data.viewCount : 0}
              </Text>
            </TouchableOpacity>
          )}
          {data.clickCount && (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesignIcon name="select1" color={Colors.ICON_COMMENT} size={14} />
              <Text style={styles.newsInfoText}>
                {data.clickCount !== null ? data.clickCount : 0}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    );
  };

  renderList() {
    const { loading, items, error, refresh } = this.props;
    if (loading) {
      return <Loading />;
    }
    if (error) {
      return (
        <TouchableOpacity style={styles.centerContainer} onPress={() => refresh()}>
          <FontAwesomeIcon name="refresh" color={Colors.TEXT_HEADER} size={24} />
          <Text style={styles.heading}>Please check your data connection</Text>
          <Text style={styles.heading}>Tap to refresh</Text>
        </TouchableOpacity>
      );
    }
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={items.results}
        renderItem={this.renderItem}
        numColumns={1}
        contentContainerStyle={[styles.newsBg, { paddingBottom: 15 }]}
      />
    );
  }

  render() {
    const { sortByTop, sortByNew, sortByBest } = this.props;
    const { newSelected, bestSelected, topSelected } = this.state;
    return (
      <Screen>
        <NavBar
          titleText="News"
          titleContainer={{
            position: 'absolute',
            left: 15,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
          rightComponent={
            <View style={styles.rowDirection}>
              <TouchableOpacity
                style={{ marginRight: 35 }}
                onPress={() => {
                  sortByTop();
                  this.setState({
                    newSelected: false,
                    bestSelected: false,
                    topSelected: true,
                  });
                }}
              >
                <Icon
                  name="trending-up"
                  color={topSelected ? Colors.NAV_ICON : Colors.NAV_DISABLE_ICON}
                  size={24}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: 35 }}
                onPress={() => {
                  sortByNew();
                  this.setState({
                    newSelected: true,
                    bestSelected: false,
                    topSelected: false,
                  });
                }}
              >
                <MaterialIcon
                  name="new-releases"
                  color={newSelected ? Colors.NAV_ICON : Colors.NAV_DISABLE_ICON}
                  size={24}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.marginRight15}
                onPress={() => {
                  sortByBest();
                  this.setState({
                    newSelected: false,
                    bestSelected: true,
                    topSelected: false,
                  });
                }}
              >
                <FontAwesome5Icon
                  name="fire"
                  color={bestSelected ? Colors.NAV_ICON : Colors.NAV_DISABLE_ICON}
                  size={21}
                />
              </TouchableOpacity>
            </View>
          }
        />
        {this.renderList()}
      </Screen>
    );
  }
}

NewsList.defaultProps = {
  items: [],
  refresh: () => {},
  error: null,
  sortByTop: () => {},
  sortByNew: () => {},
  sortByBest: () => {},
  categoriesData: {},
  categoriesName: '',
};

NewsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  refresh: PropTypes.func,
  error: PropTypes.object,
  sortByTop: PropTypes.func,
  sortByNew: PropTypes.func,
  sortByBest: PropTypes.func,
  categoriesData: PropTypes.object,
  categoriesName: PropTypes.string,
};

/* GQL Query ==================================================================== */

const MYQUERY = gql`
  query multiPostQuery($input: MultiPostInput) {
    posts(input: $input) {
      results {
        ...PostsList
        __typename
      }
      totalCount
      __typename
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
    body
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
    pageUrl
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

const getNew = {
  input: {
    terms: {
      view: 'new',
      limit: 20,
      itemsPerPage: 20,
    },
    enableTotal: true,
  },
};

const getBest = {
  input: {
    terms: {
      view: 'best',
      limit: 20,
      itemsPerPage: 20,
    },
    enableTotal: true,
  },
};

const hNewsGraphQuery = graphql(MYQUERY, {
  options: {
    variables: getTop,
  },
  props: ({ data: { loading, posts, refetch, error } }) => ({
    loading,
    items: loading ? [] : posts,
    refresh: refetch,
    sortByNew: () => refetch(getNew),
    sortByTop: () => refetch(getTop),
    sortByBest: () => refetch(getBest),
    error,
  }),
})(NewsList);

/* Export Component ==================================================================== */
export default hNewsGraphQuery;
