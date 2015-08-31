React.js Fragment - S3 Uploader 
===============================


Description
-----------

File Manager AWS S3 basique en React.js pour Salesforce.

Permet de gerer des fichiers liés à un record SF, à la manière des Attachments SF, hébérgés sur Amazon AWS S3. 

Authentification SSO via le support d'OpenId Connect de Salesforce.


Prérequis 
---------

Necessite ```Node.js > 0.12``` et ```npm > 2.13```


Installation
------------

```
> cd react-s3Uploader/
> npm install
```


Build
-----

Dossier d'asset de build ```react-s3Uploader/dist```

- Build

```
> cd react-s3Uploader/
> npm run build
```

- Watch (Build continu)

```
> cd react-s3Uploader/
> npm run watch
```

- Build for Production (Minimify + uglify, compilation Assets)

```
> cd react-s3Uploader/
> npm run buildProd
```


Configuration Salesforce
------------------------
- Creer une Visualforce.

- Creation d'une Connected Application :

	- Créer une Connected Application (Create > App)
	- Activer ```Enable OAuth Settings```
	- ```Callback Url``` : Url vers la VF page.
	- Selected OAuth Scopes : ```OpenId```

- Conserver le ```ClientId``` donné par SF.


Configuration AWS S3 / IAM
--------------------------

- Se connecter à la console AWS
- Creer le bucket sur la console S3
- Configurer les CORS sur le bucket créé.
	- Cliquer sur le bucket
	- Cliquer sur le bouton ```Properties```, en haut à droite
	- Ouvrir la pop-up d'édition des CORS: ```Permissions``` > ```Edit CORS```.

```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>[DOMAINE SF]</AllowedOrigin>
        <AllowedMethod>HEAD</AllowedMethod>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <ExposeHeader>ETag</ExposeHeader>
        <ExposeHeader>x-amz-meta-custom-header</ExposeHeader>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```

- Aller sur le service IAM

- Creer un provider 
	- ```provider Url```:
		- https://test.salesforce.com (SBX)
		- https://login.salesforce.com (Production)
	- ```Audience```: le clientId de la connected App SF précédement créée

- Creer une policy d'access au bucket S3
	- La policy doit posseder les autorisations suivantes :
		- Sur le bucket:
			- ```s3:ListBucket```
		- Sur les sous-éléments du bucket:
			- ```s3:PutObject```
            - ```s3:GetObject```
            - ```s3:ListBucket```

Exemple:

```
{
"Version": "2012-10-17",
"Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "s3:ListBucket"
        ],
        "Resource": [
            "arn:aws:s3:::[BUCKET_NAME]"
        ]
    },
    {
        "Effect": "Allow",
        "Action": [
            "s3:PutObject",
            "s3:GetObject",
            "s3:ListBucket"
        ],
        "Resource": [
            "arn:aws:s3::[BUCKET_NAME]/*"
        ]
    }
]
}
```

- Creer un nouveau Role IAM
	- Donner un nom au role
	- Selectionner le ```Role Type```: ```Role for Identity Provider Access``` > ```Grant access to web identity providers```
	- Selectionner le ```provider IAM``` précédement créé.
	- Configurer le role ```Trust policy``` (Par défaut fonctionnel, voir la doc pour plus de renseignement).
	- Selectionner la ```policy``` S3 précédement créée, pour l'associer au role IAM.
	- Valider le role.

- Conserver l'```ARN``` du role, qui permet d'identifier le jeu d'autorisation de l'user connecté via SF.

Configuration Application JS, avant compilation
-----------------------------------------------

Modifier le fichier config/constants.js

- ```aws_region``` : Correspond à la région AWS du (des) buckets.
- ```aws_arn``` : Correspond à l'arn généré du Role préalablement configuré.

Intégration à Salesforce
------------------------

Ajouter en ressource statique le zip du dossier dist/
Génération du zip: 

```
>>> cd react-s3Uploader/
>>> npm run buildProd
>>> zip -r bundle.zip dist/
```

et inclure dans la page VF les lignes suivantes

	<apex:stylesheet value="{!URLFOR($Resource.[RESOURCE NAME], 'dist/css/pure-min.css')}" />
	<apex:stylesheet value="{!URLFOR($Resource.[RESOURCE NAME], 'dist/css/grids-responsive-min.css')}" />
	<apex:stylesheet value="{!URLFOR($Resource.[RESOURCE NAME], 'dist/css/app.css')}" />

Le script attend un objet JS global de confguration (attaché à window), ```vfConf```.

Cet objet contient 3 paramètres : 

- ```bucketName```: le nom du bucket à utiliser.
- ```recordName```: Un id de record SF, auquel sera attaché les fichiers.
- ```openId```: Le token OpenId Connect, généré par SF.

[Exemple de script d'init](https://gist.github.com/bc0beb5142cb5e3a84b5)

[Exemple de script d'autorisation OpenId (Client Side)](https://gist.github.com/a0356cf64a937fad7ac1)

Libs
----

- [pureCSS](http://purecss.io/)
- [React.js](http://facebook.github.io/react/)
- [Flux](https://facebook.github.io/flux/)
- [Amazon AWS Toolkit for Javascript - S3 (npm)](https://www.npmjs.com/package/aws-sdk) 