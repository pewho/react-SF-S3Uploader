var React = require('react');
var Constants = require('../config/constants');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var FileActions = require('../actions/FileActions');
var FileStore = require('../stores/FileStore');

var ProgressBarUploadComponent = React.createClass({
	mixins: [ PureRenderMixin ],
	propTypes: {
		progress: React.PropTypes.object
	},
	render: function() {
		var content;
		
		if (this.props.progress === null){
			content = <p>No Upload in progress.</p>;
		} else {
			content = (
				<div className='meter-container'>
				  <span>PROGRESS</span>
				  <div className='meter'>
				    <span style={{ width: this.getPercentUpload() + '%'}} />
				  </div>
				  <div className="meter-info">
				    { this.getNormalizedSize(this.props.progress.loaded) } / { this.getNormalizedSize(this.props.progress.total) } Mo
				  </div>
				</div>
			);
		}
		return (
			<div className='pure-g'>
				<div className='pure-u-1'>
					{content}
				</div>
			</div>
		);
	},
	getPercentUpload: function() {
		if (!this.props.progress)
			return 0;
		return (this.props.progress.loaded / this.props.progress.total)*100;

	},
	getNormalizedSize: function(rawSize){
		if (!rawSize)
			return 0.0;
		var normSize = rawSize / (1024*1024);
		return normSize.toFixed(2);
	}
});

module.exports = ProgressBarUploadComponent;
