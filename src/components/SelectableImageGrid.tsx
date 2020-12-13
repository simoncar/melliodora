import React, { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { StyleSheet, View, Image, RefreshControl, ListRenderItemInfo } from 'react-native';
import { IImage } from '../lib/interfaces';
import BadgeIcon from './BadgeIcon';
import { useTheme } from '@react-navigation/native';

interface SelectableItem<T extends IImage> {
	selected: boolean;
	img: T;
}

interface ImageGridProps<T extends IImage> {
	images: T[];
	refreshing?: boolean;
	loadingMore?: boolean;
	onSelectedChange?: (items: T[]) => void;
	onRefresh?: () => void;
	onEndReached?: () => void;
}

export default function SelectableImageGrid<T extends IImage>(props: ImageGridProps<T>) {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set([]));
	const theme = useTheme();

	const items = React.useMemo(() => props.images.map((img) => ({ img, selected: selectedIds.has(img.id) })), [
		props.images,
	]);

	const handlePress = (item: SelectableItem<T>) => {
		item.selected = !item.selected;

		const sel = items.filter((it) => it.selected).map((it) => it.img);

		props.onSelectedChange && props.onSelectedChange(sel);
		setSelectedIds(new Set(sel.map((it) => it.id)));
	};

	const renderItem = ({ item }: ListRenderItemInfo<SelectableItem<T>>) => (
		<View style={styles.itemView}>
			<TouchableOpacity
				key={item.img.id}
				style={{
					flex: 1,
					borderWidth: 1,
					height: 200,

				}}
				onPress={() => {
					handlePress(item);
				}}
			>
				<Image
					style={
						item.selected ? [styles.image, styles.selectionBorder,
						{ borderColor: theme.colors.primary }] : styles.image
					}
					source={{ uri: item.img.uri }}
				/>

				<BadgeIcon
					style={styles.badge}
					visible={item.selected}
					icon="check-bold"
				/>

			</TouchableOpacity>
		</View>
	);

	const refreshControl = <RefreshControl refreshing={props.refreshing || false} onRefresh={props.onRefresh} />;

	return (
		<FlatList
			data={items}
			extraData={[selectedIds, props.loadingMore]}
			refreshControl={refreshControl}
			onEndReached={props.onEndReached}
			onEndReachedThreshold={0.2}
			windowSize={11}
			renderItem={renderItem}
			numColumns={2}
			initialNumToRender={20}
			keyExtractor={(item) => item.img.id}

		/>
	);
}

const styles = StyleSheet.create({
	image: {
		height: "100%",
		resizeMode: "cover",
	},
	selectionBorder: {
		borderRadius: 3,
		borderWidth: 5,
	},
	itemView: {
		flex: 1,
		flexDirection: 'column',
		margin: 1,
	},
	badge: {
		position: 'absolute',
		alignSelf: 'flex-end',

	},
});
