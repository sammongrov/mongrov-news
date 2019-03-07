import React, { Component } from 'react';
import { TouchableOpacity, View, ScrollView, Text, Dimensions } from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import { GiftedChat } from 'react-native-gifted-chat';
import { Actions } from 'react-native-router-flux';
import { Icon, Screen, NavBar } from '@ui/components';
import { Colors } from '@ui/theme_default';
import { styles } from 'react-native-theme';
import { iOSColors } from 'react-native-typography';
import {DBManager} from 'app-module';

class NewsCommentView extends Component {
  state = {
    messages: [],
  };

  componentWillMount() {
    // this.setState({
    //   messages: [
    //     {
    //       _id: 1,
    //       text: 'Hello developer',
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any',
    //       },
    //     },
    //   ],
    // });
  }

  componentDidUpdate() {
    const { comments } = this.props;
    const { messages: previousMessages } = this.state;
    if (comments.results && comments.results.length !== previousMessages.length) {
      // console.log('COMMENTS.length', comments.results.length);
      const messages = this.commentsToMessages(comments.results);
      // console.log('MESSAGES', messages);
      /* eslint-disable */
      this.setState({ messages });
      /* eslint-enable */
    }
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  commentsToMessages = (comments) =>
    comments.map((comment) => {
      const userInDB = DBManager.user.findById(comment.userId);
      const author = userInDB || comment.user;
      return {
        _id: comment._id,
        text: comment.body,
        createdAt: comment.postedAt,
        user: {
          _id: author._id,
          name: author.name || author.username,
          avatar: author.avatarURL || author.avatarUrl,
        },
      };
    });

  getImageSizes = () => {
    const { width, height } = Dimensions.get('window');
    let imgHeight = height / 3;
    if (width > height) {
      imgHeight = height / 8;
    }
    return { width, height: imgHeight };
  };

  render() {
    const imgSizes = this.getImageSizes();
    const { height } = imgSizes;
    const { newsDetails } = this.props;
    const { messages } = this.state;
    return (
      <Screen>
        <NavBar
          titleText="News Comments"
          titleTextLine={1}
          leftComponent={
            <TouchableOpacity
              onPress={Actions.pop}
              style={[styles.navSideButtonDimension, styles.alignJustifyCenter]}
            >
              <Icon
                name="chevron-left"
                type="material-community"
                color={Colors.NAV_ICON}
                size={36}
              />
            </TouchableOpacity>
          }
        />
        <View
          style={{
            // alignItems: 'center',
            position: 'relative',
            backgroundColor: iOSColors.lightGray,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: 15,
            maxHeight: height,
          }}
        >
          <ScrollView>
            <Text style={{ fontSize: 16, flex: 1, color: Colors.TEXT_DARK }}>
              {newsDetails.title}
            </Text>
          </ScrollView>
        </View>
        <GiftedChat
          messages={messages}
          onSend={(message) => this.onSend(message)}
          user={{
            _id: 1,
          }}
        />
      </Screen>
    );
  }
}

NewsCommentView.defaultProps = {
  newsDetails: {},
  comments: {},
  refresh: () => {},
  error: {},
};

NewsCommentView.propTypes = {
  newsDetails: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  comments: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  refresh: PropTypes.func,
  error: PropTypes.object,
};

/* GQL Query ==================================================================== */
const COMMENTS_QUERY = gql`
  query multiCommentQuery($input: MultiCommentInput) {
    comments(input: $input) {
      results {
        ...CommentsList
        __typename
      }
      totalCount
      __typename
    }
  }

  fragment CommentsList on Comment {
    _id
    postId
    parentCommentId
    topLevelCommentId
    body
    postedAt
    userId
    user {
      ...UsersMinimumInfo
      __typename
    }
    post {
      _id
      commentCount
      commenters {
        ...UsersMinimumInfo
        __typename
      }
      __typename
    }
    currentUserVotes {
      ...VoteFragment
      __typename
    }
    baseScore
    score
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

  fragment VoteFragment on Vote {
    _id
    voteType
    power
    __typename
  }
`;

const NewsCommentsGraphQuery = graphql(COMMENTS_QUERY, {
  options: (props) => ({
    variables: {
      input: {
        terms: {
          itemsPerPage: 0,
          limit: 0,
          postId: props.newsDetails._id,
          view: 'postComments',
        },
        enableTotal: true,
      },
    },
  }),
  props: ({ data: { loading, comments, refetch, error } }) => ({
    loading,
    comments: loading ? [] : comments,
    refresh: refetch,
    error,
  }),
})(NewsCommentView);

export default NewsCommentsGraphQuery;
