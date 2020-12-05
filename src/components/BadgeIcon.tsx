import * as React from 'react';
import { Animated, StyleSheet, StyleProp, TextStyle } from 'react-native';


import { MaterialCommunityIcons } from '@expo/vector-icons';

const defaultSize = 20;

type Props = React.ComponentProps<typeof Animated.Text> & {
	visible: boolean;
	icon: string;
	size?: number;
	style?: StyleProp<TextStyle>;
	ref?: React.RefObject<typeof Animated.Text>;
};

type State = {
	opacity: Animated.Value;
};

class BadgeIcon extends React.Component<Props, State> {
	static defaultProps = {
		visible: true,
		size: defaultSize,
	};

	state = {
		opacity: new Animated.Value(this.props.visible ? 1 : 0),
	};

	componentDidUpdate(prevProps: Props) {
		const {
			visible,

		} = this.props;

		if (visible !== prevProps.visible) {
			Animated.timing(this.state.opacity, {
				toValue: visible ? 1 : 0,
				useNativeDriver: true,
			}).start();
		}
	}

	render() {
		const {
			icon,
			size = defaultSize,
			...rest
		} = this.props;
		const { opacity } = this.state;
		const borderRadius = size / 2;

		return (
			<Animated.Text
				numberOfLines={1}
				style={[
					{
						color: "green",
						fontSize: size * 0.5,
						height: size,
						lineHeight: size,
						minWidth: size,
					},
					styles.container,
				]}
				{...rest}
			>
				<MaterialCommunityIcons name={icon} />
			</Animated.Text>
		);
	}
}

export default BadgeIcon;

const styles = StyleSheet.create({

	container: {
		alignSelf: 'flex-end',
		overflow: 'hidden',
		paddingHorizontal: 4,
		textAlign: 'center',
		textAlignVertical: 'center',
	}

});
