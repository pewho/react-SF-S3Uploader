var AppDispatcher = require('../dispatcher/AppDispatcher');
var StoreConstants = require('../config/StoreConstants');

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AWS = require('aws-sdk');
var AWSConstants = require('../config/constants');
var VFConf = require('../api/api');

var Files = [];

var FileStore = assign({}, EventEmitter.prototype, {
	getFiles: function() {
		return Files;
	},
	initStore: function(){
		refreshBucket();
	}
});

AWS.config.region = AWSConstants.aws_region;

if (VFConf.AWSCredentials) {
	AWS.config.credentials = new AWS.Credentials(VFConf.AWSCredentials);
	console.log('Use AWS Credentials...');
} else if (VFConf.openId) {
	AWS.config.credentials = new AWS.WebIdentityCredentials({
		RoleArn: AWSConstants.aws_arn,
		WebIdentityToken: VFConf.openId,
		DurationSeconds:3600
	});
	console.log('Use OpenId connect Credentials...');
}


var s3 = new AWS.S3({
	params: {
		Bucket: VFConf.bucketName,
	}
});

function refreshBucket() {
	console.log('Refresh...');
	s3.listObjects(
		{
			Prefix: 'record' + VFConf.recordName + '/'
		},
		function(err, data){
			if (err) {
				console.log(err);
				FileStore.emit('ERROR', err);
			} else {
				Files = data.Contents;
		    	FileStore.emit('CHANGE');
			}
		}
	);
}

function uploadFile(file) {
	var keyName = 'record' + VFConf.recordName + '/' + file.name;
	var params = {
		Key: keyName,
		ContentType: file.type,
		Body: file
	}
	var options = {partSize: 5 * 1024 * 1024, queueSize: 1};
	s3.upload(params, options).
		on(
			'httpUploadProgress',
			function(event) {
				FileStore.emit('PROGRESS_UPDATE', event);
			}
		).
		send(function(err, data){
			if (err){
				FileStore.emit('ERROR', err);
			} else {
				console.log('upload OK');
				refreshBucket();
			}
		}
	);

}

function getUrl(file) {
	var storeFile;

	for(var i = 0; i < Files.length; i++){
		if (Files[i].ETag === file.ETag){
			storeFile = Files[i];
			break;
		}
	}

	if (!storeFile){
		console.log('unknown file', file);
		return;
	}

	s3.getSignedUrl(
		'getObject',
		{ Key: file.Key },
		function(err, url) {
			if (err) {
				FileStore.emit('ERROR', err);
			} else {
				storeFile.url = url;
		    	FileStore.emit('GOT_URL', file);
			}
		}
	);
}

AppDispatcher.register(function(action) {
	switch(action.actionType) {
		case StoreConstants.REFRESH:
			refreshBucket();
			break;

		case StoreConstants.UPLOAD:
			uploadFile(action.file);
			break;

		case StoreConstants.GET_URL:
			getUrl(action.file);
			break;
	}
});

module.exports = FileStore;