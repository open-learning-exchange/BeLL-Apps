# BeLL Apps README.md

## About
The BeLL Apps consist of a number of media players that revolve around an LMS at the center. This is the third iteration of the BeLL software. It's a Backbone.js app that caches itself in the browser that is backed by CouchDB.  We are currently targeting Firefox Mobile v27 for Android as the client browser.  [Click here to download the installable APK of Firefox Mobile v27 for Android](https://ftp.mozilla.org/pub/mozilla.org/mobile/releases/27.0/android/en-US/fennec-27.0.en-US.android-arm.apk).


## Prerequisite for installing Bell-App
To successfully install BellApp, one would need 4 things in a flash-drive
    1. node-v0.10.26-x86.msi
    2. setup-couchdb-1.5.0_R16B02.exe
    3. Bell-Apps (node install_windows curl)
    4. Data-Builder (run the script, launch-app.bat)

## Installing the BellApp
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


## How to's for Nation BeLL Administrators

### @todo Create a new Nation BeLL

### Create a Windows Installer from latest BeLL-Apps tag
- Download the [Bell-Installer-for-Windows tag's release from Github] (https://github.com/open-learning-exchange/Bell-Installer-for-Windows/tags) onto a Windows machine. 
- Download the [Bell-Apps tag's release from Github] (https://github.com/open-learning-exchange/BeLL-Apps/tags) onto the same Windows machine. 
- Unzip both downloaded files.
- Copy contents of the BeLL-Apps folder and paste in the empty BeLL-Apps folder within the Bell-Installer-for-Windows folder.
- Run the `install.bat` file located in the Bell-Installer-for-Windows by double-clicking on the file.
- Follow the prompts to install node.js and couchDB.
- Wait until the installer has finished and a new tab in Firefox will be initiated with the BeLL-App launched in it. Note that once this Firefox tab is closed, the newly installed Community Bell can be accessed by double clicking the "My Bell" icon that was loaded onto the desktop as a result of this install.

### @todo Build a default content set using Data Builder
- 

### Set up new Community BeLL on specific Nation BeLL
- Login with admin credentials to the specific Nation BeLL that the Community BeLL is being paired with.
- Click "Manager" on the Dashboard, then "Click for more" underneath "Recently Added Communities", and then click "Add Community".
- Fill out the form in its entirety, but the following fields need to be filled out as specified:
	- Name (at very top): 	[insert Community name, i.e., Ifo]
	- Code:			[insert community name, i.e., ifo]
	- Url:			[insert community name, i.e., ifo]
	- ID (Bell Manager):	admin
	- Password:		[insert a password, i.e., the usual password for Administrators]
- Click "Save".

### Pair a Community BeLL with a specific Nation BeLL
- Open to the newly installed Community Bell by double clicking the "My Bell" icon located on the desktop.
- Login with admin credentials and system will route to Configurations window (this can also be found by clicking "Manager" on the Dashboard and then clicking "Configurations") that requires the following fields:
	- Name:			[insert Community name, i.e., Ifo]
	- Code:			[insert community name, i.e., ifo]
	- Type:			community
	- Region:		[insert Region name within the Nation, i.e., Dadaab]
	- Nation Name:		[insert nation name, i.e., somaliabell]
	- Nation Url:		[insert nation url, i.e., somaliabell.ole.org:5987]
	- Version:		(Leave it as it is)
	- Notes:		[insert brief description of community, i.e., Ifo Community BeLL]
	- Available Languages:	(Leave it as it is)
	- Current Language:	English
- Click "Submit Configurations".

### Send a BeLL Apps update to Community BeLLs through a Nation BeLL
At the moment, Community BeLL codebases and National BeLL codebases are the same.
 So, to push a new update to Community BeLLs, the National BeLL codebase needs to be updated first and then the Community BeLLs can receive it.

- Create a code tag in the BeLL-Apps repository by running (from Mac [terminal] or Linux probably)
`git clone git@github.com:open-learning-exchange/BeLL-Apps.git;`, then add a release note to `BeLL-Apps/app/CHANGELOG.txt`, then run ...
```
cd BeLL-Apps;
git add app/CHANGELOG.txt;
git commit -m "Added CHANGELOG message for v0.12.3";
git push;
git tag v0.12.3;
git push --tags;
```
- Download the [tag's release from GitHub](https://github.com/open-learning-exchange/BeLL-Apps/tags) onto a Windows machine that has Node.js installed
- Unzip, start the `Node command prompt`, `cd` into the directory you unzipped, `cd` into `update_nation` `update_nation_app.bat` with parameter of your target National BeLL's Couch URL. ex. `./update_nation_app.bat http://username:password@some-couchdb.ole.org:port` (replace username, password, some-couchdb, and port with correct info)
- Log into the BeLL Apps UI on the National BeLL and change the version number in configuration screen. Log in, click "Manager", click "Configurations", there you will find "Version" field. Increment that number, and then click "Submit Configurations".
- Log into BeLL Apps UI on Community BeLL with a user with role "super manager", this is probably your BeLL Admin user. On the Dashboard, look at the bottom and you will (hopefully) find a "System Update Available (v0.xx.xx)" button.
- Verify on the community bell that we see a new version number and a code change by checking for the `CHANGELOG.txt` file for a matching tag number. You can check this in your browser by going to `http://your-community-bell-url/apps/_design/bell/CHANGELOG.txt`.

### Publish an Issue from a Nation BeLL
- Login to the Nation BeLL with admin credentials and click "Manager" on the Dashboard, then click "Click for more" underneath "New Issues of Publications".
- Make note of the number for the last Issue No. and click "Add Issue".
- Fill out the fields and ensure that the "Issue No." is the next sequential number (do not use negative numbers or zero) and click "Save".
- Click "Add Resource", search for and then select the resource(s), and click "Add To Publication". The same can be done for courses by clicking "Add Course".
- Click "Send Publication" and select the community and click "Send". Multiple communities can be selected by using the "Control" button on your keyboard.

### Receive Published Issue on a Community BeLL
- When connected to the Internet, log in to the Community BeLL as Admin and scroll to the bottom of the Dashboard
- You should see a new button at the bottom of the Dashboard called "Publications (new 1)". This button can also be found by clicking on "Manager" and then "Publications". If more than one publication was sent to the community, the number 1 will be replaced by however many publications were sent.
- Click on the "Publications" button and the publications that have not been synced with the community will have the text "Not Synced" next to the "Sync publication" button. Things to keep in mind:
	- For now, the size of the publications being sent to communities with poor internet connectivity and slow laptop processing speed (i.e., Dadaab communities) should not exceed 100 MB (update this number after further QA).
	- Once the publication has been synced, the "Not Synced" text will remain until the page is refreshed.

### Inspect the new Issue on the Community BeLL by reading, watching, and rating resources
- If resources were included in the new Issue, navigate to the Library on the Community BeLL and open the new resources to ensure they are functioning properly.
- If courses were included in the new Issue, navigate to the Courses and work through the course steps and open resources to ensure they are functioning properly.
- Note that for now, there is no way for the Community to identify the items included in the new Issue so a list or screenshot of the Issue items should be provided by the Nation BeLL Manager sending the publication.

### @todo Community BeLL pushes activity data to Nation BeLL
