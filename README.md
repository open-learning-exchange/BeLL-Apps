# About
This is the third iteration of the BeLL software. It's a Backbone.js app that caches itself in the browser that is backed by CouchDB when a server is available and PouchDB in the browser when a server is not available. Initial support for PDFs is currently implemented, support for Videos and single HTML5 Apps coming next.  We're tracking bugs and new features on the [GitHub Wiki](https://github.com/open-learning-exchange/BeLL-Apps/wiki/@todo's) at the moment.

![Screenshot of BeLL LMS, one of many BeLL Apps](docs/screenshot.png)

## Screencasts
- [Beta1 walk through](http://www.youtube.com/watch?v=NeGSljQMQ1M)
- [Beta2 walk through](http://youtu.be/czPf-nZ5A_M)
- [Installation](http://www.youtube.com/watch?v=ZFAnAmv48BQ)


# Installing on server
These Apps are entirely Couch Apps but there are a number of things to push to CouchDB (databases, views, apps, default docs, default admin user with login of admin and password of password) so we use node.js to push all of the dependencies to the CouchDB that you specify. If you don't have node.js installed, check out the instructions for your system at [nodejs.org](http://nodejs.org).

Warning: Max files open on Mac OS is 256, this app surpasses that during installation. Increase your limit by doing `launchctl limit maxfiles 2048 2048` and `ulimit -n 2048`. If you're still seeing issues with getting all the files uploaded, see [this issue in the node.couchapp.js issue queue](https://github.com/mikeal/node.couchapp.js/issues/59).

- Define the location of your CouchDB server in install.js. Default is http://127.0.0.1:5984.
- On the command line from the repository's root, run `npm install; node install.js;`
- There's a race condition with the creating fo a database and the creating of a document, run `node install.js` twice just to be certain.


# Installing on clients

The target browser at the moment is Firefox for Android and has been tested using a beta build of Firefox for Android. The APK for that is in the root directory of this repository. At the moment the PDF.js viewer doesn't work in Chrome, other things may not as well. Check out the Screencasts to get an idea of how the clients interact with the server.

