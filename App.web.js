import React, { Component } from "react";
import Setup from "./src/setup";

import Constants from "expo-constants";
import _ from "lodash";

// Node modules check latest
// npm-check

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.disableYellowBox = true;

		return <Setup />;
	}
}
