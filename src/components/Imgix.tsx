import React, { useState } from 'react'
import { Image as ReactImage, Dimensions } from 'react-native'
import Uri from 'jsuri';
import { base64 } from 'base-64';
import _ from "lodash";

interface IProps {
	source: {},
	imageProps: any,
	style: any,
	htn: number,
	auto: boolean,
	testID: string,
}

export default function Image(props: IProps) {
	const [imageHeight, setHeight] = useState(1000);
	const [imageWidth, setWidth] = useState(1000);

	let uri = props.source.uri

	if (uri === undefined || uri === "") {
		uri = "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2FdefaultCalendar.jpg?alt=media&token=e7ba4a0a-e785-4601-bcae-5e43ce71e680"
	}
	const { width, height } = Dimensions.get('window');
	const photo1Imgix = img(uri)

	let objImgix = {}

	objImgix.fit = "clip"
	objImgix.w = width
	objImgix.auto = "enhance"

	if (props.htn !== undefined) {
		objImgix.htn = props.htn
	}

	if (props.style !== undefined && props.style.width > 0) {
		objImgix.w = props.style.width
	}

	var _src = processImage(photo1Imgix, objImgix)

	if (props.autoSizeProps) {

		ReactImage.getSize(_src, (width, height) => {
			setHeight(height / width * Dimensions.get('window').width)
			setWidth(width)

		});

		return <ReactImage
			{...props.imageProps}
			style={[{ width: imageWidth, height: imageHeight }, props.style]}
			source={{ uri: _src }}
		/>;

	} else {
		return <ReactImage
			{...props.imageProps}
			style={props.style}
			source={{ uri: _src }}

		/>;
	}
}

function img(photo: string) {
	if (!photo) return false;

	return photo.replace(
		"https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/",
		"https://smartcookies.imgix.net/");
}

var DEFAULT_OPTIONS = Object.freeze({
	auto: 'format',
})

function constructUrl(src, params) {
	var optionKeys = Object.keys(params)
	var fullUrl = optionKeys.reduce(function (uri, key) {
		return uri.addQueryParam(key, params[key])
	}, new Uri(src))

	return fullUrl.toString()
}

function processImage(src, longOptions) {
	if (!src) {
		return ''
	}

	var shortOptions = Object.assign({}, DEFAULT_OPTIONS)

	Object.keys(longOptions).forEach(function (key) {
		var val = longOptions[key]

		key = encodeURIComponent(key)

		if (key.substr(-2) === '64') {
			val = base64.encode(val)
		}

		shortOptions[key] = val
	})

	return constructUrl(src, shortOptions)
}

