module.exports = function (api) {
	api.cache(true);
	return {
		"env": {
			"development": {
				"plugins": [
					"@babel/plugin-transform-react-jsx-source",
					["module-resolver", {
						"root": ["./src"]
					}]
				]
			}
		},
		presets: ["babel-preset-expo", "module:react-native-dotenv"],
	};
};
