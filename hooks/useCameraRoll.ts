import * as React from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';

export interface CameraRollResult {
	images: MediaLibrary.Asset[];
	isRefreshing: boolean;
	isLoadingMore: boolean;
	permissionsGranted: boolean;
	doRefresh: () => Promise<void>;
	loadMore: () => Promise<void>;
}

export function useCameraRoll(): CameraRollResult {
	const [assets, setAssets] = React.useState<MediaLibrary.Asset[]>([]);
	const [isRefreshing, setRefreshing] = React.useState(true);
	const [isLoadingMore, setLoadingMore] = React.useState(false);
	const [permissions, setPermissions] = React.useState(true);
	const [last, setLast] = React.useState<string | null>(null);

	const loadMorePhotos = async () => {
		setLoadingMore(true);

		const promiseAlbum = await MediaLibrary.getAlbumAsync("Imports")

		const result = await MediaLibrary.getAssetsAsync({
			mediaType: MediaLibrary.MediaType.photo,
			album: promiseAlbum,
			first: 100,
			after: last || undefined,
		});
		setLast(result.endCursor);
		setAssets([...assets, ...result.assets]);
		setLoadingMore(false);
	};

	const doRefresh = async () => {
		setRefreshing(true);
		setLast(null);
		setAssets([]);

		const { status } = await MediaLibrary.requestPermissionsAsync();
		if (status !== Permissions.PermissionStatus.GRANTED) {
			setPermissions(false);
			setRefreshing(false);
			return;
		}

		await loadMorePhotos();
		setRefreshing(false);
	};

	React.useEffect(() => {
		doRefresh();
	}, []);

	return {
		images: assets,
		isRefreshing,
		permissionsGranted: permissions,
		doRefresh,
		loadMore: loadMorePhotos,
		isLoadingMore: isLoadingMore && !isRefreshing,
	};
}
