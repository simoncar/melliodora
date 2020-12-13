import * as React from 'react';
import { Animated, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const size = 30;

type Props = React.ComponentProps<typeof Animated.Text> & {
	visible: boolean;
	icon: string;
	style?: StyleProp<TextStyle>;
	ref?: React.RefObject<typeof Animated.Text>;
};

type State = {
	opacity: Animated.Value;
};

class BadgeIcon extends React.Component<Props, State> {
	static defaultProps = {
		visible: true,
	};
	constructor(props) {
		super(props);

		this.state = {
			opacity: new Animated.Value(this.props.visible ? 1 : 0),
		};
	}

	componentDidUpdate(prevProps: Props) {
		const {
			visible,
		} = this.props;

		if (visible !== prevProps.visible) {
			Animated.timing(this.state.opacity, {
				toValue: visible ? 1 : 0,
				duration: 150,
				useNativeDriver: true,
			}).start();
		}

	}

	render() {
		const {
			icon,
			visible,
			style,
			...rest
		} = this.props;

		const { opacity } = this.state;
		const borderRadius = size / 2


		return (
			<Animated.Text
				numberOfLines={1}

				style={[
					{
						opacity,
						borderRadius
					},
					styles.container
				]}

				{...rest}
			>
				<MaterialCommunityIcons
					style={{
						color: "blue",
						alignSelf: 'flex-end',
					}}
					name={icon}
				/>
			</Animated.Text>
		);
	}
}

export default BadgeIcon;

const styles = StyleSheet.create({

	container: {
		alignSelf: 'flex-end',
		position: 'absolute',
		right: 10,
		top: 10,
	}
});
