# About
This is the third iteration of the BeLL software. It's a Backbone.js app that caches itself in the browser that is backed by CouchDB when a server is available and PouchDB in the browser when a server is not available. Initial support for PDFs is currently implemented, support for Videos and single HTML5 Apps coming next.  We're tracking bugs and new features on the [GitHub Wiki](https://github.com/open-learning-exchange/BeLL-Apps/wiki/@todo's) at the moment.

![Screenshot of BeLL LMS, one of many BeLL Apps](docs/screenshot.png)

## Screencasts
- [Beta1 walk through](http://www.youtube.com/watch?v=NeGSljQMQ1M)
- [Beta2 walk through](http://youtu.be/czPf-nZ5A_M)
- [BeLL Apps 3.0 Sandbox Set Up from Command Line](http://youtu.be/_Yy3TOe3cps)


# Installing on a server

## Install on a remote CouchDB

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


## 
ulimit -n 10056
./install --couchurl http://pi:raspberry@bell.local:5984;
./install --couchurl http://pi:raspberry@bell.local:5984;


## The following recipe is for Raspbian on Raspberry Pi.

```
# download, install, and ssh into Raspbian -> http://www.raspbian.org/
sudo apt-get update
sudo apt-get upgrade
sudo apt-get autoremove

# change the host name
```
sudo vim /etc/hosts # replace raspberrypi with desired hostname
sudo vim /etc/hostname # replace text with desired hostname
sudo /etc/init.d/hostname.sh
sudo reboot

# now following directions from https://www.modmypi.com/blog/installing-the-rasclock-raspberry-pi-real-time-clock
wget http://afterthoughtsoftware.com/files/linux-image-3.6.11-atsw-rtc_1.0_armhf.deb
sudo dpkg -i linux-image-3.6.11-atsw-rtc_1.0_armhf.deb
sudo cp /boot/vmlinuz-3.6.11-atsw-rtc+ /boot/kernel.img
# edit /etc/modules, add the following two lines, no pound signs
# i2c-bcm2708
# rtc-pcf2127a

# Edit /etc/rc.local, add the following lines before exit 0
# echo pcf2127a 0x51 > /sys/class/i2c-adapter/i2c-1/new_device
# ( sleep 2; hwclock -s ) &
sudo reboot
# install node.js according to instructions here -> http://www.raspberrypi.org/phpBB3/viewtopic.php?f=66&t=54817
# there is also a special arm pi build at http://nodejs.org/dist/v0.10.5/ but I think below is the same thing
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
# install couchdb and git
sudo apt-get install couchdb git
# open /etc/couchdb/local.ini and change bind_address to 0.0.0.0 and add an admin, probably pi:raspberry
git clone https://github.com/open-learning-exchange/BeLL-Apps.git


# --- Everything here on out can't make it into a distro
```
sudo raspi-config
# run expand_fs in raspi-config
# set the timezone
sudo dpkg-reconfigure tzdata
# set the date
sudo date --set 1998-11-02 
# set the time (local time)
sudo date --set 21:08:00
# update the hardware clock with settings
sudo hwclock -w
sudo reboot
cd BeLL-Apps/build
git pull
# install prompt for a messenger bell
# edit ./config/messenger.replicator beforehand if you need to.
./install --mapfile ./config/messenger.replicator --hostname messenger --couchurl http://pi:raspberry@127.0.0.1:5984
```


# Installing on clients

The recommended client is the Firefox Beta for Android included in this repository.


# Replication maps

The `install-map` utility can save you hours of entering items in the _replicator database as well as save you from some errors.  

Here are some examples:

Here's an example of a one time replication of oledemo.cloudant.com to another place.

```
./install-map --to http://oledemo:oleoleole@oledemo.cloudant.com/_replicate --mapfile ./map--send-oledemo-somewhere-else.csv --create_target
```

Here' an example of configuring a BeLL to replicate as a community BeLL from OLE Demo.
```
./install-map --to http://oledemo:oleoleole@oledemo.cloudant.com/replicator_database_for_sattelites --mapfile ./map--sattelite-to-oledemo.csv.csv --create_target --continuous
```

Sattelites would then just replicate `http://oledemo:oleoleole@oledemo.cloudant.com/replicator_database_for_sattelites` database to their _replicator database and they would have all the necessary settings.

# Installing on your local CouchDB from the BeLL Apps Source server

1. Go to `https://bellappssource.cloudant.com/apps/_design/bell/installer/get-bookmarklet-here.html` (username is bellappssource and password is installpass)
1. Drag the link to your bookmarks bar.
1. Go to your local CouchDB's Futon (probably `http://127.0.0.1:5984/_utils`)
1. Click on the `Install BeLL Apps` bookmarklet

