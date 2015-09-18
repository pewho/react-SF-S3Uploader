var React = require('react');
var Constants = require('../config/constants');

var FileActions = require('../actions/FileActions');
var FileStore = require('../stores/FileStore');

var ProgressBarComponent = require('./ProgressBarUploadComponent');

var UploadComponent = React.createClass({
	getInitialState: function() {
		return {
			file: null,
			progress:null
		};
	},
	componentWillMount: function() {
		FileStore.on('PROGRESS_UPDATE', this.onProgressUpdate);
		FileStore.on('CHANGE', this.deactiveProgressBar);
	},
	render: function() {
		var bar;
		if (this.state.progress !== null){
			bar = <ProgressBarComponent progress={ this.state.progress } />;
		}
		return ( 
			<div className="pure-g pure-form">
				<div className="pure-u-1 button-container">
					<input onChange={ this.onChangeInput } type="file" id="file-chooser" />
					<button className="pure-button pure-button-primary" id="upload-button" onClick={ this.clickButton }>Upload</button>
					{ bar }	
				</div>
			</div>
		);
	},
	onProgressUpdate: function(event){
		this.setState({
			progress: event
		});
	},
	deactiveProgressBar: function() {
		this.setState({
			progress: null
		});
	},
	onChangeInput: function(event){
		var file = event.target.files[0];
		this.setState({
			file:file
		});
	},
	clickButton: function(event) {
		event.preventDefault();
		FileActions.upload(this.state.file);
		this.setState({
			file: null
		});
	}
});

module.exports = UploadComponent;
