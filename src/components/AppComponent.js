var React = require('react');
var LinksComponent = require("./LinksComponent");
var UploadComponent = require("./UploadComponent");
var FileStore = require('../stores/FileStore');

var vfConf = require('../api/api');

var AppComponent = React.createClass({
	componentWillMount: function(){
		FileStore.initStore();
		FileStore.on('ERROR', this.logError);
	},
	logError: function(err){
		console.log(err);
	},
	render: function() {
		return (
			<div className="app-component">
				<div className="pure-g">
					<div className="pure-u-1 button-container">
						<button className="pure-button" id="return-to-record" onClick = {this.returnRecord}>&lt; Return to Record</button>
					</div>
				</div>
				<LinksComponent />
				<UploadComponent />
			</div>
		);
	},
	returnRecord: function(event) {
		event.preventDefault();
		if (vfConf.recordName)
			window.location.href = '/' + vfConf.recordName;
	}
});

module.exports = AppComponent;
