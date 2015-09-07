// Direct AWS Credentials .. (Could be negociated with AWS STS)

var vfConf = window.vfConf || {
	bucketName: 'BUCKET NAME',
	appName: 'APP NAME',
	recordName: 'SF RECORD ID',
	AWSCredentials : {
		 accessKeyId: 'ACCESS KEY ID', 
		 secretAccessKey: 'SECRET KEY ID', 
		 sessionToken: 'TOKEN SESSION'
	}
};

////////
//OR  //
////////

// Open Id Connect Credentials (FROM SF)
var vfConf = window.vfConf || {
	bucketName: 'BUCKET NAME',
	appName: 'APP NAME',
	recordName: 'SF RECORD ID',
	openId: 'OPEN ID TOKEN'
};

module.exports = vfConf;