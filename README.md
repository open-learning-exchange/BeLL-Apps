# About
This is the third iteration of the BeLL software. It's a Backbone.js app that caches itself in the browser that is backed by CouchDB when a server is available and PouchDB in the browser when a server is not available. Initial support for PDFs is currently implemented, support for Videos and single HTML5 Apps coming next.  We're tracking bugs and new features on the [GitHub Wiki](https://github.com/open-learning-exchange/BeLL-Apps/wiki/@todo's) at the moment.

![Screenshot of BeLL LMS, one of many BeLL Apps](docs/screenshot.png)

## Screencasts
- [Beta1](http://www.youtube.com/watch?v=NeGSljQMQ1M)
- [Beta2](http://youtu.be/czPf-nZ5A_M)


# Installing on server
- Make sure you have CouchDB running at http://127.0.0.1:5984 on the system you are installing on.
- Run /install.js using node, `node install.js`.  This will install the databases the BeLL Apps use.
- Install the BeLL Apps using the node CouchApp utility.  If you have npm installed you can...

```
npm install couchapp
couchapp push app.js http://127.0.0.1:5984/apps
```


# Installing on clients

The target browser at the moment is Firefox for Android and has been tested using a beta build of Firefox for Android. The APK for that is in the root directory of this repository. At the moment the PDF.js viewer doesn't work in Chrome, other things may not as well. Check out the Screencasts to get an idea of how the clients interact with the server.

