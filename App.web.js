import React, { Component } from "react";
import Setup from "./src/setup";

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
