To get started quickly with using the BeLL Apps, follow the direction over [here](http://open-learning-exchange.github.io/).

# About
This is the third iteration of the BeLL software. It's a Backbone.js app that caches itself in the browser that is backed by CouchDB when a server is available and PouchDB in the browser when a server is not available. Initial support for PDFs is currently implemented, support for Videos and single HTML5 Apps coming next.  

# Installing from source code
Let's say you have your own CouchDB on something like Iriscouch.com at http://mycouch.iriscouch.com.  In the following script we're going to download the source code to our local machine and then push it to that CouchDB of yours.  Prerequisites for your computer include having installed [Node.js](http://nodejs.com) and [Git](http://git-scm.com/). Before you begin, set up a default admin for your database. For example, we might go to [http://mycouch.iriscouch.com/_utils](http://mycouch.iriscouch.com/_utils) and set an admin with username pi and password raspberry.  

```
ulimit -n 10056
git clone https://github.com/open-learning-exchange/BeLL-Apps.git;
cd BeLL-Apps/build/;
npm install;
./install --couchurl http://pi:raspberry@mycouch.iriscouch.com;
./install --couchurl http://pi:raspberry@mycouch.iriscouch.com;
```
Yes, we are running that install script twice because it is prone to race conditions on the first run.

# Other docs

- [BeLL Apps Release Strategy](docs/BeLL-Apps-Release-Strategy)
