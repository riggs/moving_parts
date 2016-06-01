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
        <Tableau />
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


class Tableau extends Component {
  state = {
    chains: ['red', 'blue'],
    center: {x: 0, y: 0},
    scale: 1,
  };
  constructor(props) {
    super(props);
    for (let prop in this.state) {
      let value = props[prop];
      if (value) {this.setState({[prop]: value})}
    }
  }
  componentWillMount() {
    let {center, scale} = this.state;
    this.pan = new Animated.ValueXY(center);
    this.pan.addListener(value => center = value);
    this.scale = new Animated.Value(this.state.scale);
    this.scale.addListener(value => scale = value);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {return true},
//       onMoveShouldSetPanResponder: () => {return true},
      onPanResponderGrant: (e, guestureState) => {
//         console.log(this.constructor.name, {...guestureState});
        this.pan.setOffset(center);
        this.pan.setValue({x:0, y:0});
      },
      onPanResponderMove: Animated.event([null, {
        dx: this.pan.x,
        dy: this.pan.y
      }]),
      onPanResponderRelease: (e, guestureState) => {
        this.pan.flattenOffset();
        this.setState({center, scale});
      }
    })
  }
  componentWillUnmount() {
    this.pan.removeAllListeners();
    this.scale.removeAllListeners();
  }
  get style() {
    return [
      styles.app.container,
      styles.app.centered,
      {
        transform: this.pan.getTranslateTransform().concat({scale: this.scale})
      },
    ];
  }
  render() {
    return (
      <View style={[styles.app.container, {flexDirection: 'row'}]}>
        <Animated.View style={this.style} {...this.panResponder.panHandlers}>
          {this.state.chains.map(chain => <Behavior key={chain} color={chain}/>)}
        </Animated.View>
        <SideBar />
      </View>
    );
  }
}


class Behavior extends Component {
  state = {
    position: {x: 0, y: 0},
    scale: 1,
  };
  constructor(props) {
    super(props);
    for (let prop in this.state) {
      let value = props[prop];
      if (value) {this.setState({[prop]: value})}
    }
  }
  componentWillMount() {
    let position = this.state.position;
    this.scale = new Animated.Value(this.state.scale);
    this.pan = new Animated.ValueXY(position);
    this.pan.addListener(value => position = value);
    let onPanEnd = (e, guestureState) => {
        Animated.timing(this.scale, {
          toValue: this.state.scale,
          duration: 100,
        }).start()
        this.pan.flattenOffset();
        this.setState({position});
    }
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {return true},
//       onMoveShouldSetPanResponder: () => {return true},
      onMoveShouldSetPanResponderCapture: () => {return true},
      onPanResponderTerminationRequiest: () => {return false},
      onPanResponderGrant: (e, guestureState) => {
        console.log(this.constructor.name, {...guestureState});
        Animated.timing(this.scale, {
          toValue: this.state.scale * 1.1,
          duration: 100,
        }).start();
        this.pan.setOffset(position);
        this.pan.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event([null, {
        dx: this.pan.x,
        dy: this.pan.y
      }]),
      onPanResponderRelease: onPanEnd,
      onPanResponderTerminate: onPanEnd,
    });
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
