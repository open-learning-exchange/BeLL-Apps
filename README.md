# About
This is the third iteration of the BeLL software. It's a Backbone.js app that caches itself in the browser that is backed by CouchDB when a server is available and PouchDB in the browser when a server is not available. Initial support for PDFs is currently implemented, support for Videos and single HTML5 Apps coming next.  We're tracking bugs and new features on the [GitHub Wiki](https://github.com/open-learning-exchange/BeLL-Apps/wiki/@todo's) at the moment.


# The Apps
## BeLL LMS
This app is for 
- Browse Resources on the server's "resources" CouchDB database.
- Create, edit, and remove Teams.  Teams are referred to as the Group entity on the code level.
- Manage Assignments for Teams.

## Personal BeLL
- View Teams and Teams Assignments
- "Update my assignments" syncs databases between the CouchDB databases on the server and the PouchDB datbases in your browser. This includes the associated files for Resources.
- Links to open an Assignment's associated PDF in the PDF.js Viewer for PouchDB.

## PDF.js Viewer for PouchDB
- A fork of the PDF.js Viewer app that will read PDFs in your browser's PouchDB databases. 

## BeLL LCMS
- Manage Collections of Resources that are CouchDB databases.
Warning: This App has a lot of loose ends, it was actually an earlier version of the LMS where we considered having Group Assignments as databases.


# Installing on server
- Make sure you have CouchDB running at http://127.0.0.1:5984 on the system you are installing on.
- Run /install.js using node, `node install.js`.  This will install the databases the BeLL Apps use.
- Install the BeLL Apps using the node CouchApp utility.  If you have npm installed you can...
```
npm install couchapp
couchapp push app.js http://127.0.0.1:5984/apps
```


# Installing on clients

The target browser at the moment is Firefox for Android and has been tested using the current Firefox for Android Beta. At the moment the PDF.js viewer doesn't work in Chrome.

Navigate to {your servers url}/apps/_design/bell/install.html. This will use your browser's AppCache to save the files necessary for browsing without a connection to the server.  When you have that installed you can now disconnect from the server and see that /apps/_design/bell/personal/index.html loads without the connection.  Connect back to the server and in the Personal BeLL app, click "Update my assignments" which will load the Resources, Teams (Groups), and Assignments from CouchDB into the PouchDB databases in your browser. Disconnect from the server again and you'll see that the Personal BeLL App still has everything. 


