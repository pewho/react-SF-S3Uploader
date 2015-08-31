var React = require('react');
var Constants = require('../config/constants');

var FileActions = require('../actions/FileActions');
var FileStore = require('../stores/FileStore');

var LinkComponent = React.createClass({
	propTypes: {
		file: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return {
			isLink: false		
		};
	},
	componentDidMount: function() {
		FileStore.on('GOT_URL', this.onReceptUrl);
	},
	generateUrl: function(event) {
		event.preventDefault();
		FileActions.getUrl(this.props.file);
	},
	onReceptUrl: function(file){
		if (file.ETag === this.props.file.ETag){
			this.setState({
				isLink: true
			});
		}
	},
	getFileName: function(keyName){
		var splitted = keyName.split('/');
		if (splitted !== undefined && splitted.length !== 0){
			return splitted[splitted.length - 1];
		} else {
			return keyName;
		}
	},
	getFileType: function(keyName){
		var fileTypeSplitted = keyName.split('.');
		if (fileTypeSplitted === undefined || fileTypeSplitted.length === 0){
			return keyName;
		}else{
			return fileTypeSplitted[fileTypeSplitted.length - 1];
		}
	},getFileSize: function(fileSize){
		if (fileSize){
			var fileSizeInMo = (fileSize / (1024*1024)).toFixed(2);
			return fileSizeInMo + ' Mo';
		} else {
			return '0.0 Mo';
		}
	},
	getFileModifiedDate: function(fileDate){
		if (fileDate) {
			return fileDate.toDateString();
		} else {
			return 'n/a';
		}
	},
	render: function() {
		// Type
		var fileType = this.getFileType(this.props.file.Key);
		
		var buttonElement;
		if (this.state.isLink){
			buttonElement = <a href={ this.props.file.url } className="pure-button-primary pure-button">Télécharger</a>;
		} else {
			buttonElement = <button onClick={ this.generateUrl } className="pure-button">Generer Url</button>;
		}

		return (
			<div className="pure-u-4-24">
				<div className="l-box">
					<div className="pure-u-1">
						<p className="l-iconic">{ fileType }</p>
					</div>
					<div className="pure-u-1">
						<p>
							{ this.getFileName(this.props.file.Key) }<br />
							<small>{ this.getFileModifiedDate(this.props.file.LastModified) } - { this.getFileSize(this.props.file.Size) }</small>
						</p>
					</div>
					<div className="pure-u-1">
						{ buttonElement }
					</div>
				</div>
			</div>
		);
	}
	
});

module.exports = LinkComponent;
