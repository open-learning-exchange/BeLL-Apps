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
sudo apt-get autoremove

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

sudo apt-get install couchdb git
# open /etc/couchdb/local.ini and change bind_address to 0.0.0.0 and add an admin, probably pi:raspberry
wget https://github.com/open-learning-exchange/BeLL-Apps/archive/master.zip
unzip BeLL-Apps-master.zip


# --- Everything here on out can't make it into a distro

sudo raspi-config
# run expand_fs in raspi-config
sudo dpkg-reconfigure tzdata
hwclock -w
sudo reboot
cd BeLL-Apps-master/build
git pull
./install.js --mapfile ./settings/settings.bell --hostname bell --ipaddress 127.0.0.1 --couchurl http://pi:raspberry@127.0.0.1:5984

```


# Installing on clients

The recommended client is the Firefox Beta for Android included in this repository.
