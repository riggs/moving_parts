/**
 * Created by riggs on 2016/4/12.
 */
"use strict";

import React, {
  Animated,
  AppRegistry,
  Component,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import * as styles from './styles.js'


class MovingParts extends Component {
  render() {
    return (
      <View style={styles.app.container}>
        <TitleBar />
        <View style={[styles.app.container, {flexDirection: 'row'}]}>
          <BehaviorChains />
          <SideBar />
        </View>
      </View>
    );
  }
}


class TitleBar extends Component {
  render() {
    return (
      <View style={styles.title_bar.background}>
        <Text style={styles.title_bar.title_text}>Moving Parts</Text>
        <Text style={styles.title_bar.menu}>Menu</Text>
      </View>
    );
  }
}


class SideBar extends Component {
  render() {
    return (
      <View style={styles.side_bar.background}>
      
      </View>
    );
  }
}


class BehaviorChains extends Component {
  state = {
    chains: ['red', 'blue'],
  };

  render() {
    return (
      <View style={[styles.app.container, styles.app.centered]}>
        {this.state.chains.map(chain => <Behavior key={chain} color={chain}/>)}
      </View>
    );
  }
}

class Behavior extends Component {
  state = {
    position: {x: 0, y: 0}
  };
  constructor(props) {
    super(props);
    let scale = this.props.scale || 1;
    this.scale = new Animated.Value(scale);
    this.pan = new Animated.ValueXY(this.props.location);
//     this.position = {x: 0, y: 0,};
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {return true},
      onMoveShouldSetPanResponderCapture: () => {return true},
      onPanResponderGrant: (e, guestureState) => {
        Animated.timing(this.scale, {
          toValue: scale * 1.1,
          duration: 100,
        }).start();
        this.pan.setOffset(this.state.position);
        this.pan.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event([null, {
        dx: this.pan.x,
        dy: this.pan.y
      }]),
      onPanResponderRelease: (e, guestureState) => {
        Animated.timing(this.scale, {
          toValue: scale,
          duration: 100,
        }).start()
        this.pan.flattenOffset();
      },
    });
  }
  componentWillMount() {
    this.pan.addListener(position => this.setState({position: position}));
  }
  componentWillUnmount() {
    this.pan.removeAllListeners();
  }
  get style() {
    return [
      styles.behavior.background,
      {
        backgroundColor: this.props.color,
        transform: this.pan.getTranslateTransform().concat({scale: this.scale})
      },
    ];
  }
  render() {
    console.log({...this.style[1]})
    return (
//       <Animated.View style={[this.style, styles.app.centered]} {...this.panResponder.panHandlers}>
//         <Text style={styles.title_bar.title_text}>
//           {JSON.stringify(this.state.position)}
//         </Text>
      <Animated.View style={this.style} {...this.panResponder.panHandlers}>
      </Animated.View>
    );
  }
}

class BehaviorText extends Component {
  state = {
    title: '',
    body: '',
  };
  render() {
    return (
      <View style={styles.app.container}>
        <TextInput
          onChangeText={(title) => this.setState({title})}
          value={this.state.behavior_title_text}
          placeholder="Describe what happened"
          autoFocus={true}
          maxLength={140}
          multiline={true}
          style={[styles.behavior_title_text, ]}
        />
        <TextInput
          onChangeText={(body) => this.setState({body})}
          value={this.state.behavior_body_text}
          placeholder="Additional notes"
          multiline={true}
          style={[styles.behavior_body_text, ]}
        />
      </View>
    );
  }
}

AppRegistry.registerComponent('MovingParts', () => MovingParts);
