/**
 * NewsList Screen
 */

import React, { Component } from 'react';
import { WebView, TouchableOpacity, BackHandler, View, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { styles } from 'react-native-theme';
import AppUtils from '@utils';
import FastImage from 'react-native-fast-image';
import { Icon, Screen, NavBar, Text, Avatar, AntDesignIcon } from '@ui/components';
import { Colors } from '@ui/theme_default';

class NewsDetail extends Component {
  constructor(props) {
    super(props);
    this._news = props.newsUrl;
    this.state = {
      newsUrl: this._news,
    };
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  };

  handleBackPress = () => {
    Actions.pop();
    return true;
  };

  renderNewsContent() {
    const { newsUrl } = this.state;
    const { newsDetails } = this.props;
    if (newsUrl) {
      return <WebView source={{ uri: newsUrl }} style={{}} />;
    }
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', padding: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 15,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {newsDetails.user.avatarUrl && (
              <Avatar
                avatarUrl={newsDetails.user.avatarUrl ? newsDetails.user.avatarUrl : null}
                avatarName={newsDetails.user.displayName}
                avatarSize={35}
              />
            )}
            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.newsUsernameText, { flex: 1, marginRight: 15, paddingLeft: 5 }]}
              >
                {newsDetails.user.displayName
                  ? newsDetails.user.displayName
                  : newsDetails.user.username}
              </Text>
              <Text style={[styles.newsTimeText, { paddingLeft: 5 }]}>
                {AppUtils.formatNewsDate(newsDetails.postedAt)}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 10,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingRight: 30,
              }}
            >
              <AntDesignIcon name="like2" color={Colors.ICON_COMMENT} size={16} />
              <Text style={[styles.newsStatisticsText]}>
                {newsDetails.baseScore !== null ? newsDetails.baseScore : 0}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              onPress={() =>
                Actions.NewsComment({
                  newsDetails,
                })
              }
            >
              <AntDesignIcon name="message1" color={Colors.ICON_COMMENT} size={14} />
              <Text style={[styles.newsStatisticsText]}>
                {newsDetails.commentCount !== null ? newsDetails.commentCount : 0}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'column' }}>
          {newsDetails.title && (
            <Text style={[styles.newsTitleText, { fontSize: 22 }]}>{newsDetails.title}</Text>
          )}
          {newsDetails.thumbnailUrl && (
            <View style={styles.newsImageView}>
              <FastImage
                style={styles.newsImageHeight}
                source={{
                  uri: newsDetails.thumbnailUrl ? newsDetails.thumbnailUrl : newsDetails.avatarUrl,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          )}
          <View style={[styles.newsExcerptView]}>
            <Text
              style={[
                styles.newsExcerptText,
                newsDetails.thumbnailUrl || !newsDetails.title ? null : styles.marginTop10,
              ]}
            >
              {newsDetails.body}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingBottom: 20,
          }}
        >
          {newsDetails.viewCount && (
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 20 }}
            >
              <AntDesignIcon name="eyeo" color={Colors.ICON_COMMENT} size={23} />
              <Text style={styles.newsInfoText}>
                {newsDetails.viewCount !== null ? newsDetails.viewCount : 0}
              </Text>
            </TouchableOpacity>
          )}
          {newsDetails.clickCount && (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesignIcon name="select1" color={Colors.ICON_COMMENT} size={21} />
              <Text style={styles.newsInfoText}>
                {newsDetails.clickCount !== null ? newsDetails.clickCount : 0}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }

  render() {
    return (
      <Screen>
        <NavBar
          titleText="Article"
          titleTextLine={1}
          titleContainer={{ alignItems: 'flex-start' }}
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
        {this.renderNewsContent()}
      </Screen>
    );
  }
}

export default NewsDetail;

NewsDetail.defaultProps = {
  newsUrl: '',
  newsTitle: '',
  newsExcerpt: '',
  newsThumbnailUrl: '',
  newsDetails: {},
};

NewsDetail.propTypes = {
  newsUrl: PropTypes.string,
  newsTitle: PropTypes.string,
  newsExcerpt: PropTypes.string,
  newsThumbnailUrl: PropTypes.string,
  newsDetails: PropTypes.object,
};
