# About
This is the third iteration of the BeLL software. It's a Backbone.js app that caches itself in the browser that is backed by CouchDB when a server is available and PouchDB in the browser when a server is not available. Initial support for PDFs is currently implemented, support for Videos and single HTML5 Apps coming next.  We're tracking bugs and new features on the [GitHub Wiki](https://github.com/open-learning-exchange/BeLL-Apps/wiki/@todo's) at the moment.

![Screenshot of BeLL LMS, one of many BeLL Apps](docs/screenshot.png)

## Screencasts
- [Beta1 walk through](http://www.youtube.com/watch?v=NeGSljQMQ1M)
- [Beta2 walk through](http://youtu.be/czPf-nZ5A_M)
- [BeLL Apps 3.0 Sandbox Set Up from Command Line](http://youtu.be/_Yy3TOe3cps)


# Installing on a server

The following recipe is for Raspbian on Raspberry Pi.

```
# download, install, and ssh into Raspbian -> http://www.raspbian.org/
sudo apt-get update
sudo apt-get upgrade
sudo raspi-config
# run expand_fs in raspi-config
sudo apt-get install couchdb
# open /etc/couchdb/local.ini and change bind_address to 0.0.0.0 and add an admin, probably pi:raspberry
sudo dpkg-reconfigure tzdata
# set time to RasClock -> https://www.modmypi.com/blog/installing-the-rasclock-raspberry-pi-real-time-clock
wget https://github.com/open-learning-exchange/BeLL-Apps/archive/master.zip
unzip BeLL-Apps-master.zip
cd BeLL-Apps-master/build
./install.js --mapfile ./settings/settings.bell --hostname bell --ipaddress 127.0.0.1 --couchurl http://pi:raspberry@127.0.0.1:5984
```


# Installing on clients

The recommended client is the Firefox Beta for Android included in this repository.
