import * as React from 'react';
import { Animated, StyleSheet, StyleProp, TextStyle } from 'react-native';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import color from 'color';


import { MaterialCommunityIcons } from '@expo/vector-icons';

const defaultSize = 20;

type Props = React.ComponentProps<typeof Animated.Text> & {
	/**
	 * Whether the badge is visible
	 */
	visible: boolean;
	/**
	 * MaterialCommunityIcons name.
	 */
	icon: string;
	/**
	 * Size of the `Badge`.
	 */
	size?: number;
	style?: StyleProp<TextStyle>;
	ref?: React.RefObject<typeof Animated.Text>;
	/**
	 * @optional
	 */

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
			style,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			visible,
			...rest
		} = this.props;
		const { opacity } = this.state;
		const borderRadius = size / 2;

		return (
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			<Animated.Text
				numberOfLines={1}
				style={[
					{
						opacity,
						color: "green",
						fontSize: size * 0.5,
						lineHeight: size,
						height: size,
						minWidth: size,
						borderRadius,
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
		textAlign: 'center',
		textAlignVertical: 'center',
		paddingHorizontal: 4,
		overflow: 'hidden',
	},
	container2: {
		alignSelf: 'flex-end',
		textAlign: 'center',
		textAlignVertical: 'center',
		paddingHorizontal: 4,
		overflow: 'hidden',
	},
});
