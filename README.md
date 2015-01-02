  # About
The BeLL Apps consist of a number of media players that revolve around an LMS at the center. This is the third iteration of the BeLL software. It's a Backbone.js app that caches itself in the browser that is backed by CouchDB.  We are currently targeting Firefox Mobile v27 for Android as the client browser.  [Click here to download the installable APK of Firefox Mobile v27 for Android](https://ftp.mozilla.org/pub/mozilla.org/mobile/releases/27.0/android/en-US/fennec-27.0.en-US.android-arm.apk).

  # Quick start
To get started quickly with using the BeLL Apps, follow the direction over [here](http://open-learning-exchange.github.io/).

  # About
The BeLL Apps consist of a number of media players that revolve around an LMS at the center. This is the third iteration of the BeLL software. It's a Backbone.js app that caches itself in the browser that is backed by CouchDB.

  # Prerequisite for installing Bell-App 
To successfully install BellApp, one would need 4 things in a flash-drive
    1) node-v0.10.26-x86.msi
    2) setup-couchdb-1.5.0_R16B02.exe
    3) Bell-Apps (node install_windows curl)
    4) Data-Builder (run the script, launch-app.bat)

  # Installing the BellApp 
The build tool is created to install BeLLApp on all operating systems. The build tool sits inside the BellApp and assumes that the nodejs and the couchDB are installed prior to installing BellApp

	1) Ensure the nodejs and couchDB are installed and running. Go into BellApp folder and excecute the command,
			node install_windows http://X.X.X.X:5984/
			This should install the BellApp remotely to the CouchDB URL passed as the parameter.

	2) Open the firefox browser and verify the installation by launching the app at,
			http://X.X.X.X:5984/apps/_design/bell/MyApp/index.html

  	3) Load data into the BellApp (starter data)
			Go into the Data-Builder folder and run the script,
			launch-app.bat
			This opens starter data builder toolkit running at , http://localhost:3000/prepare-starter-data
			Select the BeLL servers you want to load resouces from and then select only necessary courses/resouces. Hit 'Prepare Starter Data' button below,
			This will copy the couch database files from seleted remote servers onto the location StarterDataLocation of your Bell-App, move these resources over to the next folder 'StarterData'
			This will create content for the installed Bell-App.
