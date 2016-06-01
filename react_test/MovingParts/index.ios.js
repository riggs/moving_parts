/**
 * Created by riggs on 2016/4/12.
 */
"use strict";

import React, {
  Animated,
  AppRegistry,
  Component,
  PanResponder,
  PropTypes,
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
  static propTypes = {
    chanis: PropTypes.arrayOf(PropTypes.string),
    center: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    zoom: PropTypes.number,
  }
  state = {
    chains: ['red', 'blue'],
    center: {x: 0, y: 0},
    zoom: 1,
  };
  constructor(props) {
    super(props);
    for (let prop in this.state) {
      let value = props[prop];
      if (value) {this.setState({[prop]: value})}
    }
  }
  componentWillMount() {
    this.pan = new Animated.ValueXY(this.state.center);
//     let pan_listener_callback = (center) => this.setState({center});
    let pan_listener_callback = (center) => {
      console.log(center);
      this.setState({center})
    };
    let listenerID = this.pan.addListener(pan_listener_callback);
    this.zoom = new Animated.Value(this.state.zoom);
    this.zoom.addListener(({value}) => this.setState({zoom: value}));
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {return true},
      onPanResponderGrant: (e, guestureState) => {
        console.log(this.constructor.name, {...guestureState}, this.state.center);
        this.pan.removeListener(listenerID);
        this.pan.setOffset(this.state.center);
        this.pan.setValue({x:0, y:0});
        listenerID = this.pan.addListener(pan_listener_callback);
      },
      onPanResponderMove: Animated.event([null, {
        dx: this.pan.x,
        dy: this.pan.y
      }]),
      onPanResponderRelease: (e, guestureState) => {
//         console.log(this.constructor.name, {...guestureState});
        this.pan.flattenOffset();
      }
    })
  }
  componentWillUnmount() {
    this.pan.removeAllListeners();
    this.zoom.removeAllListeners();
  }
  render() {
    return (
      <View style={[styles.app.container, {flexDirection: 'row'}]}>
        <Animated.View style={[styles.app.container, styles.app.centered]} {...this.panResponder.panHandlers}>
          {this.state.chains.map(chain => <Behavior key={chain} color={chain}
                                            offset={this.state.center} zoom={this.state.zoom}/>)}
        </Animated.View>
        <SideBar />
      </View>
    );
  }
}


class Behavior extends Component {
  static propTypes = {
    offset: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }).isRequired,
    zoom: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    scale: PropTypes.number,
  };
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
    let position = {
      x: this.state.position.x + this.props.offset.x,
      y: this.state.position.y + this.props.offset.y
    };
    this.pan = new Animated.ValueXY(position);
    this.pan.addListener(value => position = value);
    let scale = this.state.scale * this.props.zoom;
    this.scale = new Animated.Value(scale);
    let onPanEnd = (e, guestureState) => {
      Animated.timing(this.scale, {
        toValue: scale,
        duration: 100,
      }).start()
      this.pan.flattenOffset();
      this.setState({position: {
        x: position.x - this.props.offset.x,
        y: position.y - this.props.offset.y,
      }});
    }
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {return true},
      onPanResponderGrant: (e, guestureState) => {
//         console.log(this.constructor.name, {...guestureState});
        Animated.timing(this.scale, {
          toValue: scale * 1.1,
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
    this.scale.removeAllListeners();
  }
  componentWillReceiveProps(nextProps) {
    this.pan.setValue({
      x: this.state.position.x + this.props.offset.x,
      y: this.state.position.y + this.props.offset.y
    });
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
    console.log(this.props.offset, this.props.color);
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
