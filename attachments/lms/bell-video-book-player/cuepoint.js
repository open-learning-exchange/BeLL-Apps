(function() {
	/* Cuepoint Coffee. A simple library for HTML5 Video Subtitles and Cuepoints */
	
	/**
	 * @class Utils 
	*/
	
	var Cuepoint, Utils, utils;
	Utils = (function() {
		function Utils() {}
		Utils.prototype.log = function(args) {
			this.args = args;
			if (window.console) {
				return console.log(Array.prototype.slice.call(this, arguments));
			}
		};
		return Utils;
	})();
	
	/**
	 * @class Cuepoint
	 */
	
	Cuepoint = (function() {
		function Cuepoint() {
			this.nativeKeys = Object.keys;
		}
		Cuepoint.prototype.init = function(slides) {
			var key, value, _results;
			//this.slides = slides;
			//this.subtitles = document.getElementById("subtitles");
			this.video = document.getElementById("video");
//			_results = [];
//			for (key in slides) {
//				value = slides[key];
//				this.addSlide(key, value);
//				_results.push(this.events.call);
//			}
//			return _results;
		};
		Cuepoint.prototype.events = function() {};
		Cuepoint.prototype.currentTime = function() {
			return this.video.currentTime;
		};
		Cuepoint.prototype.update = function(html) {
			this.html = html;
			return this.subtitles.innerHTML = this.html;
		};
		Cuepoint.prototype.setTime = function(time) {
			this.time = time;
			this.video.currentTime = time;
			return this.video.play();
		};
		Cuepoint.prototype.nextPage = function(data) {
			var index = 0;
			//alert(this.video.currentTime)
			for(var i=0; i<data.length; i++)
			{
				if(data[i]>=this.video.currentTime)
				{
					this.video.currentTime = data[i]
					return //this.video.play();
				}
			}
			
		};
		Cuepoint.prototype.previousPage = function(data) {
			var index = 0;
			//alert(this.video.currentTime)
			for(var i=data.length-1; i>=0; i--)
			{
				if(data[i]<=this.video.currentTime)
				{
					if(i-1>=0)
					{
						this.video.currentTime = data[i-1]
						return this.video.play();
					}
				}
			}
			
		};
		Cuepoint.prototype.addSlide = function(time, html) {
			var self;
			this.time = time;
			this.html = html;
			self = this;
			return this.video.addEventListener("timeupdate", function() {
				if (this.currentTime >= time && this.currentTime <= time + 0.3) {
					return self.update(html);
				}
			},
			false);
		};
		Cuepoint.prototype.play = function() {
			return this.video.play();
		};
		Cuepoint.prototype.pause = function() {
			if (!this.video.paused) {
				return this.video.pause();
			}
		};
		return Cuepoint;
	})();
	utils = new Utils;
	window.cuepoint = new Cuepoint;
}).call(this);
