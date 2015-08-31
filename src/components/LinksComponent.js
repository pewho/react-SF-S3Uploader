var React = require('react');
var Constants = require('../config/constants');

var LinkComponent = require('./LinkComponent');

var FileActions = require('../actions/FileActions');
var FileStore = require('../stores/FileStore');

var LinksComponent = React.createClass({
	getInitialState: function() {
		return {
			files: []
		};
	},
	render: function() {
		var links = this.state.files.map(function(link){
			return (
				<LinkComponent file={ link } key={ link.ETag } />
			);
		})
		return (
			<div className="pure-g">
				{links}
			</div>
		);
	},
	componentWillMount: function() {
		FileStore.on('CHANGE', this.onStoreChange);
	},
	onStoreChange: function() {
		this.setState({
			files: FileStore.getFiles()
		});
	},
});

module.exports = LinksComponent;
