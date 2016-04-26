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
    View
} from 'react-native';


class MovingParts extends Component {
    render() {
        return (
            <View style={[styles.container, {paddingTop: 30}]} pointerEvents='box-none'>
                <BehaviorChains />
            </View>
        );
    }
}


class BehaviorChains extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chains: ['red', 'blue'],
        };
    }
    render() {
        return (
            <View style={styles.chains}>
                {this.state.chains.map(chain => <Behavior key={chain} color={chain} />)}
            </View>
        );
    }
}

class Behavior extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            body: '',
        };
    }
    render() {
        return (
			<View style={[styles.behavior, {backgroundColor: this.props.color}]}>
				<View style={styles.container}>
					<TextInput
						onChangeText={(title) => this.setState({title})}
						value={this.state.behavior_title_text}
						placeholder="What happened?"
						autoFocus={true}
						maxLength={60}
						// multiline={true}
						style={[styles.behavior_title_text, styles.unstretch_text]}
					/>
					<TextInput
						onChangeText={(body) => this.setState({body})}
						value={this.state.behavior_body_text}
						placeholder="Additional notes"
						multiline={true}
						style={[styles.behavior_body_text, styles.unstretch_text]}
					/>
				</View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#F5FCFF',
    },
    chains: {
        width: 120,
        // margin: 0,
    },
    behavior: {
        height: 120,
        width: 120,
        borderWidth: 1,
	    borderRadius: 60,
	    transform: [
		    {scaleX: 2},
		    {scale: 1.2},
	    ],
    },
	unstretch_text: {
		transform: [
			{scaleX: 0.5},
			{scale: 0.8},
		],
	},
    behavior_title_text: {
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold',
        // height: 24,
        flex: 1,
        fontSize: 12,
    },
    behavior_body_text: {
        // height: 48,
        flex: 2,
        margin: 5,
        fontSize: 10,
    },
});

AppRegistry.registerComponent('MovingParts', () => MovingParts);
