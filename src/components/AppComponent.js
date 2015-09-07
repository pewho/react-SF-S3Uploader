var React = require('react');
var LinksComponent = require("./LinksComponent");
var UploadComponent = require("./UploadComponent");
var FileStore = require('../stores/FileStore');

var vfConf = require('../api/api');

var AppComponent = React.createClass({
	getInitialState: function() {
		return {
			errorMsg: null
		};
	},
	componentWillMount: function(){
		FileStore.on('ERROR', this.logError);
		FileStore.initStore();
	},
	logError: function(err){
		console.log(err);
		this.setState({
			errorMsg: err
		});
	},
	render: function() {
		var uploadElement = <span></span>;
		var mainElement = <span></span>;

		if (vfConf !== undefined && vfConf.appName !== 'NEURONAUTE'){
			uploadElement = <UploadComponent />;
		}

		if (this.state.errorMsg){
			mainElement = (
				<div className="app-component">
					<div className="pure-g l-box-error">
						<div className="pure-u-1">
							 { this.state.errorMsg.message }
						</div>
					</div>
				</div>
			);
			console.log(mainElement);
		} else {
			mainElement = (
				<div className="app-component">
					<div className="pure-g">
						<div className="pure-u-1 button-container">
							<button className="pure-button" id="return-to-record" onClick = {this.returnRecord}>&lt; Return to Record</button>
						</div>
					</div>

					<LinksComponent />

					{ uploadElement }
				</div>
			);
		}

		return (
			<div>
			{ mainElement }
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
