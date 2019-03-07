/**
 * NewsList Screen
 */

import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Screen, NavBar, Avatar, Icon, AntDesignIcon } from '@ui/components';
import { styles } from 'react-native-theme';
import { Card } from 'react-native-elements';
// import AppUtil from '@utils';
import FastImage from 'react-native-fast-image';
import { Colors } from '@ui/theme_default';
import _ from 'lodash';
import AppUtils from '@mongrov/utils';
import {Application} from '@mongrov/config' ;
import {DBManager} from 'app-module';

/* Styles ==================================================================== */

/* Component ==================================================================== */
// var { height, width } = Dimensions.get('window');

class CategoriesDetails extends Component {
  constructor(props) {
    super(props);
    this._mounted = false;
  }

  componentDidMount() {
    this._insideStateUpdate = false;
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  keyExtractor = (item) => item._id;

  renderItem = ({ item }) => {
    var data = item;
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
    const categoriesName = this.props;
    const name = categoriesName.navigation.state.params.categoriesName;
    if (name === data.categories[0].name) {
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
            <View
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
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
                  {data.baseScore !== null ? data.baseScore : 0}
                </Text>
              </TouchableOpacity>
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
                    style={{
                      marginRight: 5,
                      marginTop: 5,
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
    }
  };

  renderList() {
    const categoriesData = this.props;
    const data = categoriesData.navigation.state.params.categoriesData.items;
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={data.results}
        renderItem={this.renderItem}
        numColumns={1}
        contentContainerStyle={[styles.newsBg, { paddingBottom: 15 }]}
      />
    );
  }

  render() {
    return (
      <Screen>
        <NavBar
          titleText="Categories"
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
        {this.renderList()}
      </Screen>
    );
  }
}

export default CategoriesDetails;
