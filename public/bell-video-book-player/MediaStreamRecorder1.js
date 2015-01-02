// Last time updated at 15 Feb 2014, 16:32:23

// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.webrtc-experiment.com/licence
// Documentation - github.com/streamproc/MediaStreamRecorder
// ==========================================================
// MediaStreamRecorder.js

function MediaStreamRecorder(mediaStream) {
    if (!mediaStream) throw 'MediaStream is mandatory.';

    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function(timeSlice) {
        // Media Stream Recording API has not been implemented in chrome yet;
        // That's why using WebAudio API to record stereo audio in WAV format
        var Recorder = IsChrome ? window.StereoRecorder : window.MediaRecorderWrapper;

        // video recorder (in WebM format)
        if (this.mimeType.indexOf('video') != -1) {
            Recorder = IsChrome ? window.WhammyRecorder : window.MediaRecorderWrapper;
        }

        // video recorder (in GIF format)
        if (this.mimeType === 'image/gif') Recorder = window.GifRecorder;

        mediaRecorder = new Recorder(mediaStream);
        mediaRecorder.ondataavailable = this.ondataavailable;
        mediaRecorder.onstop = this.onstop;

        // Merge all data-types except "function"
        mediaRecorder = mergeProps(mediaRecorder, this);

        mediaRecorder.start(timeSlice);
    };

    this.stop = function() {
        if (mediaRecorder) 
        {
        	mediaRecorder.stop();
        }
    };

    this.ondataavailable = function(blob) {
        console.log('ondataavailable..', blob);
    };

    this.onstop = function(error) {
        console.warn('stopped..', error);
    };

    // Reference to "MediaRecorder.js"
    var mediaRecorder;
}

// ==========================
// Cross-Browser Declarations

// animation-frame used in WebM recording
requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
cancelAnimationFrame = window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame;

// WebAudio API representer
AudioContext = window.webkitAudioContext || window.mozAudioContext;

URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

IsChrome = !!navigator.webkitGetUserMedia;

// Merge all other data-types except "function"

function mergeProps(mergein, mergeto) {
    for (var t in mergeto) {
        if (typeof mergeto[t] !== 'function') {
            mergein[t] = mergeto[t];
        }
    }
    return mergein;
}


// Muaz Khan     - https://github.com/muaz-khan 
// neizerth      - https://github.com/neizerth
// MIT License   - https://www.webrtc-experiment.com/licence/
// Documentation - https://github.com/streamproc/MediaStreamRecorder
// ==========================================================
// MediaRecorder.js

/**
* Implementation of https://dvcs.w3.org/hg/dap/raw-file/default/media-stream-capture/MediaRecorder.html
* The MediaRecorder accepts a mediaStream as input source passed from UA. When recorder starts,
* a MediaEncoder will be created and accept the mediaStream as input source.
* Encoder will get the raw data by track data changes, encode it by selected MIME Type, then store the encoded in EncodedBufferCache object.
* The encoded data will be extracted on every timeslice passed from Start function call or by RequestData function.
* Thread model:
* When the recorder starts, it creates a "Media Encoder" thread to read data from MediaEncoder object and store buffer in EncodedBufferCache object.
* Also extract the encoded data and create blobs on every timeslice passed from start function or RequestData function called by UA.
*/

function MediaRecorderWrapper(mediaStream) {
    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"

    // starting a recording session; which will initiate "Reading Thread"
    // "Reading Thread" are used to prevent main-thread blocking scenarios
    this.start = function(mTimeSlice) {
        mTimeSlice = mTimeSlice || 1000;

        mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.ondataavailable = function(e) {
            console.log('ondataavailable', e.data.type, e.data);
            // mediaRecorder.state == 'recording' means that media recorder is associated with "session"
            // mediaRecorder.state == 'stopped' means that media recorder is detached from the "session" ... in this case; "session" will also be deleted.

            if (!e.data.size) {
                console.warn('Recording of', e.data.type, 'failed.');
                return;
            }

            if (mediaRecorder.state == 'recording') {
                // at this stage, Firefox MediaRecorder API doesn't allow to choose the output mimeType format!
                var blob = new window.Blob([e.data], {
                    type: e.data.type || self.mimeType || 'audio/wav' // It specifies the container format as well as the audio and video capture formats.
                });

                // Dispatching OnDataAvailable Handler
               // alert('first blob')
                self.ondataavailable(blob);
            }
        };

        mediaRecorder.onstop = function(error) {
            // for video recording on Firefox, it will be fired quickly.
            // because work on VideoFrameContainer is still in progress
            // https://wiki.mozilla.org/Gecko:MediaRecorder
            self.onstop(error);
        };

        // http://www.w3.org/TR/2012/WD-dom-20121206/#error-names-table
        // showBrowserSpecificIndicator: got neither video nor audio access
        // "VideoFrameContainer" can't be accessed directly; unable to find any wrapper using it.
        // that's why there is no video recording support on firefox

        // video recording fails because there is no encoder available there
        // http://dxr.mozilla.org/mozilla-central/source/content/media/MediaRecorder.cpp#317

        // Maybe "Read Thread" doesn't fire video-track read notification;
        // that's why shutdown notification is received; and "Read Thread" is stopped. 

        // https://dvcs.w3.org/hg/dap/raw-file/default/media-stream-capture/MediaRecorder.html#error-handling
        mediaRecorder.onerror = function(error) {
            console.warn(error);
            self.start(mTimeSlice);
        };

        mediaRecorder.onwarning = function(warning) {
            console.warn(warning);
        };

        // void start(optional long mTimeSlice)
        // The interval of passing encoded data from EncodedBufferCache to onDataAvailable
        // handler. "mTimeSlice < 0" means Session object does not push encoded data to
        // onDataAvailable, instead, it passive wait the client side pull encoded data
        // by calling requestData API.
        mediaRecorder.start(mTimeSlice);

        // Start recording. If timeSlice has been provided, mediaRecorder will
        // raise a dataavailable event containing the Blob of collected data on every timeSlice milliseconds.
        // If timeSlice isn't provided, UA should call the RequestData to obtain the Blob data, also set the mTimeSlice to zero.
    };

    this.stop = function() {
        if (mediaRecorder && mediaRecorder.state == 'recording') {
        	alert('stop')
            mediaRecorder.stop();
        }
    };

    this.ondataavailable = function() {
    };
    this.onstop = function() {
    };

    // Reference to itself
    var self = this;

    // Reference to "MediaRecorderWrapper" object
    var mediaRecorder;
}


// Muaz Khan     - https://github.com/muaz-khan 
// neizerth      - https://github.com/neizerth
// MIT License   - https://www.webrtc-experiment.com/licence/
// Documentation - https://github.com/streamproc/MediaStreamRecorder
// ==========================================================
// StereoRecorder.js

function StereoRecorder(mediaStream) {
    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function(timeSlice) {
        timeSlice = timeSlice || 1000;

        mediaRecorder = new StereoAudioRecorder(mediaStream, this);

        (function looper() {
            mediaRecorder.record();

            setTimeout(function() {
                mediaRecorder.stop();
                looper();
            }, timeSlice);
        })();
    };

    this.stop = function() {
        if (mediaRecorder)
        {
        	alert('after stop')
        	 mediaRecorder.stop();
        }
    };

    this.ondataavailable = function() {
    };

    // Reference to "StereoAudioRecorder" object
    var mediaRecorder;
}

// source code from: http://typedarray.org/wp-content/projects/WebAudioRecorder/script.js

function StereoAudioRecorder(mediaStream, root) {
    // variables
    var leftchannel = [];
    var rightchannel = [];
    var recorder;
    var recording = false;
    var recordingLength = 0;
    var volume;
    var audioInput;
    var sampleRate = 44100;
    var audioContext;
    var context;

    this.record = function() {
        recording = true;
        // reset the buffers for the new recording
        leftchannel.length = rightchannel.length = 0;
        recordingLength = 0;
    };

    this.stop = function() {
    	alert('StereoAudioRecorder')
        // we stop recording
        recording = false;

        // we flat the left and right channels down
        var leftBuffer = mergeBuffers(leftchannel, recordingLength);
        var rightBuffer = mergeBuffers(rightchannel, recordingLength);
        // we interleave both channels together
        var interleaved = interleave(leftBuffer, rightBuffer);

        // we create our wav file
        var buffer = new ArrayBuffer(44 + interleaved.length * 2);
        var view = new DataView(buffer);

        // RIFF chunk descriptor
        writeUTFBytes(view, 0, 'RIFF');
        view.setUint32(4, 44 + interleaved.length * 2, true);
        writeUTFBytes(view, 8, 'WAVE');
        // FMT sub-chunk
        writeUTFBytes(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        // stereo (2 channels)
        view.setUint16(22, 2, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 4, true);
        view.setUint16(32, 4, true);
        view.setUint16(34, 16, true);
        // data sub-chunk
        writeUTFBytes(view, 36, 'data');
        view.setUint32(40, interleaved.length * 2, true);

        // write the PCM samples
        var lng = interleaved.length;
        var index = 44;
        var volume = 1;
        for (var i = 0; i < lng; i++) {
            view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
            index += 2;
        }

        // our final binary blob
        var blob = new Blob([view], { type: 'audio/wav' });
		alert('second blob')
        root.ondataavailable(blob);
    };

    function interleave(leftChannel, rightChannel) {
        var length = leftChannel.length + rightChannel.length;
        var result = new Float32Array(length);

        var inputIndex = 0;

        for (var index = 0; index < length;) {
            result[index++] = leftChannel[inputIndex];
            result[index++] = rightChannel[inputIndex];
            inputIndex++;
        }
        return result;
    }

    function mergeBuffers(channelBuffer, recordingLength) {
        var result = new Float32Array(recordingLength);
        var offset = 0;
        var lng = channelBuffer.length;
        for (var i = 0; i < lng; i++) {
            var buffer = channelBuffer[i];
            result.set(buffer, offset);
            offset += buffer.length;
        }
        return result;
    }

    function writeUTFBytes(view, offset, string) {
        var lng = string.length;
        for (var i = 0; i < lng; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    // creates the audio context
    audioContext = window.AudioContext || window.webkitAudioContext;
    context = new audioContext();

    // creates a gain node
    volume = context.createGain();

    // creates an audio node from the microphone incoming stream
    audioInput = context.createMediaStreamSource(mediaStream);
    
    // connect the stream to the gain node
    audioInput.connect(volume);

    /* From the spec: This value controls how frequently the audioprocess event is 
    dispatched and how many sample-frames need to be processed each call. 
    Lower values for buffer size will result in a lower (better) latency. 
    Higher values will be necessary to avoid audio breakup and glitches */
    var bufferSize = 2048;
    recorder = context.createJavaScriptNode(bufferSize, 2, 2);

    recorder.onaudioprocess = function(e) {
        if (!recording) return;
        var left = e.inputBuffer.getChannelData(0);
        var right = e.inputBuffer.getChannelData(1);
        // we clone the samples
        leftchannel.push(new Float32Array(left));
        rightchannel.push(new Float32Array(right));
        recordingLength += bufferSize;
    }; // we connect the recorder
    volume.connect(recorder);
    recorder.connect(context.destination);
}


// Muaz Khan     - https://github.com/muaz-khan 
// neizerth      - https://github.com/neizerth
// MIT License   - https://www.webrtc-experiment.com/licence/
// Documentation - https://github.com/streamproc/MediaStreamRecorder
// ==========================================================
// WhammyRecorder.js

function WhammyRecorder(mediaStream) {
    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function(timeSlice) {
        timeSlice = timeSlice || 1000;

        var imageWidth = this.videoWidth || 320;
        var imageHeight = this.videoHeight || 240;

        canvas.width = video.width = imageWidth;
        canvas.height = video.height = imageHeight;

        startTime = Date.now();

        function drawVideoFrame(time) {
            lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

            if (typeof lastFrameTime === undefined) {
                lastFrameTime = time;
            }

            // ~10 fps
            if (time - lastFrameTime < 90) return;

            context.drawImage(video, 0, 0, imageWidth, imageHeight);

            // whammy.add(canvas, time - lastFrameTime);
            whammy.add(canvas);

            // console.log('Recording...' + Math.round((Date.now() - startTime) / 1000) + 's');
            // console.log("fps: ", 1000 / (time - lastFrameTime));

            lastFrameTime = time;
        }

        lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

        (function getWebMBlob() {
            setTimeout(function() {
                endTime = Date.now();
                console.log('frames captured: ', whammy.frames.length, ' => ', ((endTime - startTime) / 1000), 's video');

                var WebM_Blob = whammy.compile();
                alert('second blob')
                self.ondataavailable(WebM_Blob);

                whammy.frames = [];
                getWebMBlob();
            }, timeSlice);
        })();
    };

    this.stop = function() {
    	alert('aasdfas')
        if (lastAnimationFrame)
            cancelAnimationFrame(lastAnimationFrame);
    };

    this.ondataavailable = function() {
    };
    this.onstop = function() {
    };

    // Reference to itself
    var self = this;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var video = document.createElement('video');
    video.muted = true;
    video.autoplay = false;
    video.src = URL.createObjectURL(mediaStream);
    video.play();

    var lastAnimationFrame = null;
    var startTime, endTime, lastFrameTime;
    var whammy = new Whammy.Video(10, 0.6);
}


// Muaz Khan     - https://github.com/muaz-khan 
// neizerth      - https://github.com/neizerth
// MIT License   - https://www.webrtc-experiment.com/licence/
// Documentation - https://github.com/streamproc/MediaStreamRecorder
// ==========================================================
// GifRecorder.js

function GifRecorder(mediaStream) {
    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function(timeSlice) {
        timeSlice = timeSlice || 1000;

        var imageWidth = this.videoWidth || 320;
        var imageHeight = this.videoHeight || 240;

        canvas.width = video.width = imageWidth;
        canvas.height = video.height = imageHeight;

        // external library to record as GIF images
        gifEncoder = new GIFEncoder();

        // void setRepeat(int iter) 
        // Sets the number of times the set of GIF frames should be played. 
        // Default is 1; 0 means play indefinitely.
        gifEncoder.setRepeat(0);

        // void setFrameRate(Number fps) 
        // Sets frame rate in frames per second. 
        // Equivalent to setDelay(1000/fps).
        // Using "setDelay" instead of "setFrameRate"
        gifEncoder.setDelay(this.frameRate || 200);

        // void setQuality(int quality) 
        // Sets quality of color quantization (conversion of images to the 
        // maximum 256 colors allowed by the GIF specification). 
        // Lower values (minimum = 1) produce better colors, 
        // but slow processing significantly. 10 is the default, 
        // and produces good color mapping at reasonable speeds. 
        // Values greater than 20 do not yield significant improvements in speed.
        gifEncoder.setQuality(this.quality || 10);

        // Boolean start() 
        // This writes the GIF Header and returns false if it fails.
        gifEncoder.start();

        startTime = Date.now();

        function drawVideoFrame(time) {
            lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

            if (typeof lastFrameTime === undefined) {
                lastFrameTime = time;
            }

            // ~10 fps
            if (time - lastFrameTime < 90) return;

            context.drawImage(video, 0, 0, imageWidth, imageHeight);

            gifEncoder.addFrame(context);

            // console.log('Recording...' + Math.round((Date.now() - startTime) / 1000) + 's');
            // console.log("fps: ", 1000 / (time - lastFrameTime));

            lastFrameTime = time;
        }

        lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

        (function getWebMBlob() {
            setTimeout(function() {
                endTime = Date.now();

                var gifBlob = new Blob([new Uint8Array(gifEncoder.stream().bin)], {
                    type: 'image/gif'
                });
                self.ondataavailable(gifBlob);

                // bug: find a way to clear old recorded blobs
                gifEncoder.stream().bin = [];

                getWebMBlob();
            }, timeSlice);
        })();
    };

    this.stop = function() {
    	alert('asdfaasdfasdf')
        if (lastAnimationFrame) cancelAnimationFrame(lastAnimationFrame);
    };

    this.ondataavailable = function() {
    };
    this.onstop = function() {
    };

    // Reference to itself
    var self = this;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var video = document.createElement('video');
    video.muted = true;
    video.autoplay = false;
    video.src = URL.createObjectURL(mediaStream);
    video.play();

    var lastAnimationFrame = null;
    var startTime, endTime, lastFrameTime;

    var gifEncoder;
}


// Muaz Khan     - https://github.com/muaz-khan 
// neizerth      - https://github.com/neizerth
// MIT License   - https://www.webrtc-experiment.com/licence/
// Documentation - https://github.com/streamproc/MediaStreamRecorder
// ==========================================================
// whammy.js

// ==========================================================

// Note:
// ==========================================================
// whammy.js is an "external library" 
// and has its own copyrights. Taken from "Whammy" project.

var Whammy = (function() {
    // in this case, frames has a very specific meaning, which will be 
    // detailed once i finish writing the code

    function toWebM(frames) {
        var info = checkFrames(frames);
        var counter = 0;
        var EBML = [
            {
                "id": 0x1a45dfa3, // EBML
                "data": [
                    {
                        "data": 1,
                        "id": 0x4286 // EBMLVersion
                    },
                    {
                        "data": 1,
                        "id": 0x42f7 // EBMLReadVersion
                    },
                    {
                        "data": 4,
                        "id": 0x42f2 // EBMLMaxIDLength
                    },
                    {
                        "data": 8,
                        "id": 0x42f3 // EBMLMaxSizeLength
                    },
                    {
                        "data": "webm",
                        "id": 0x4282 // DocType
                    },
                    {
                        "data": 2,
                        "id": 0x4287 // DocTypeVersion
                    },
                    {
                        "data": 2,
                        "id": 0x4285 // DocTypeReadVersion
                    }
                ]
            },
            {
                "id": 0x18538067, // Segment
                "data": [
                    {
                        "id": 0x1549a966, // Info
                        "data": [
                            {
                                "data": 1e6, //do things in millisecs (num of nanosecs for duration scale)
                                "id": 0x2ad7b1 // TimecodeScale
                            },
                            {
                                "data": "whammy",
                                "id": 0x4d80 // MuxingApp
                            },
                            {
                                "data": "whammy",
                                "id": 0x5741 // WritingApp
                            },
                            {
                                "data": doubleToString(info.duration),
                                "id": 0x4489 // Duration
                            }
                        ]
                    },
                    {
                        "id": 0x1654ae6b, // Tracks
                        "data": [
                            {
                                "id": 0xae, // TrackEntry
                                "data": [
                                    {
                                        "data": 1,
                                        "id": 0xd7 // TrackNumber
                                    },
                                    {
                                        "data": 1,
                                        "id": 0x63c5 // TrackUID
                                    },
                                    {
                                        "data": 0,
                                        "id": 0x9c // FlagLacing
                                    },
                                    {
                                        "data": "und",
                                        "id": 0x22b59c // Language
                                    },
                                    {
                                        "data": "V_VP8",
                                        "id": 0x86 // CodecID
                                    },
                                    {
                                        "data": "VP8",
                                        "id": 0x258688 // CodecName
                                    },
                                    {
                                        "data": 1,
                                        "id": 0x83 // TrackType
                                    },
                                    {
                                        "id": 0xe0,  // Video
                                        "data": [
                                            {
                                                "data": info.width,
                                                "id": 0xb0 // PixelWidth
                                            },
                                            {
                                                "data": info.height,
                                                "id": 0xba // PixelHeight
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "id": 0x1f43b675, // Cluster
                        "data": [
                            {
                                "data": 0,
                                "id": 0xe7 // Timecode
                            }
                        ].concat(frames.map(function(webp) {
                            var block = makeSimpleBlock({
                                discardable: 0,
                                frame: webp.data.slice(4),
                                invisible: 0,
                                keyframe: 1,
                                lacing: 0,
                                trackNum: 1,
                                timecode: Math.round(counter)
                            });
                            counter += webp.duration;
                            return {
                                data: block,
                                id: 0xa3
                            };
                        }))
                    }
                ]
            }
        ];
        return generateEBML(EBML);
    }

    // sums the lengths of all the frames and gets the duration, woo

    function checkFrames(frames) {
        if (!frames[0])
            return {
                duration: 0,
                width: 0,
                height: 0
            };

        var width = frames[0].width,
            height = frames[0].height,
            duration = frames[0].duration;
        for (var i = 1; i < frames.length; i++) {
            if (frames[i].width != width) throw "Frame " + (i + 1) + " has a different width";
            if (frames[i].height != height) throw "Frame " + (i + 1) + " has a different height";
            if (frames[i].duration < 0) throw "Frame " + (i + 1) + " has a weird duration";
            duration += frames[i].duration;
        }
        return {
            duration: duration,
            width: width,
            height: height
        };
    }


    function numToBuffer(num) {
        var parts = [];
        while (num > 0) {
            parts.push(num & 0xff);
            num = num >> 8;
        }
        return new Uint8Array(parts.reverse());
    }

    function strToBuffer(str) {
        // return new Blob([str]);

        var arr = new Uint8Array(str.length);
        for (var i = 0; i < str.length; i++) {
            arr[i] = str.charCodeAt(i);
        }
        return arr;

        // this is slower

        /*
        return new Uint8Array(str.split('').map(function(e){
        return e.charCodeAt(0)
        }))
        */
    }


    // sorry this is ugly, and sort of hard to understand exactly why this was done
    // at all really, but the reason is that there's some code below that i dont really
    // feel like understanding, and this is easier than using my brain.

    function bitsToBuffer(bits) {
        var data = [];
        var pad = (bits.length % 8) ? (new Array(1 + 8 - (bits.length % 8))).join('0') : '';
        bits = pad + bits;
        for (var i = 0; i < bits.length; i += 8) {
            data.push(parseInt(bits.substr(i, 8), 2));
        }
        return new Uint8Array(data);
    }

    function generateEBML(json) {
        var ebml = [];
        for (var i = 0; i < json.length; i++) {
            var data = json[i].data;

            // console.log(data);

            if (typeof data == 'object') data = generateEBML(data);
            if (typeof data == 'number') data = bitsToBuffer(data.toString(2));
            if (typeof data == 'string') data = strToBuffer(data);

            // console.log(data)

            var len = data.size || data.byteLength;
            var zeroes = Math.ceil(Math.ceil(Math.log(len) / Math.log(2)) / 8);
            var size_str = len.toString(2);
            var padded = (new Array((zeroes * 7 + 7 + 1) - size_str.length)).join('0') + size_str;
            var size = (new Array(zeroes)).join('0') + '1' + padded;

            // i actually dont quite understand what went on up there, so I'm not really
            // going to fix this, i'm probably just going to write some hacky thing which
            // converts that string into a buffer-esque thing

            ebml.push(numToBuffer(json[i].id));
            ebml.push(bitsToBuffer(size));
            ebml.push(data);
        }
        return new Blob(ebml, {
            type: "video/webm"
        });
    }

    // OKAY, so the following two functions are the string-based old stuff, the reason they're
    // still sort of in here, is that they're actually faster than the new blob stuff because
    // getAsFile isn't widely implemented, or at least, it doesn't work in chrome, which is the
    // only browser which supports get as webp

    // Converting between a string of 0010101001's and binary back and forth is probably inefficient
    // TODO: get rid of this function

    function toBinStr_old(bits) {
        var data = '';
        var pad = (bits.length % 8) ? (new Array(1 + 8 - (bits.length % 8))).join('0') : '';
        bits = pad + bits;
        for (var i = 0; i < bits.length; i += 8) {
            data += String.fromCharCode(parseInt(bits.substr(i, 8), 2));
        }
        return data;
    }

    function generateEBML_old(json) {
        var ebml = '';
        for (var i = 0; i < json.length; i++) {
            var data = json[i].data;
            if (typeof data == 'object') data = generateEBML_old(data);
            if (typeof data == 'number') data = toBinStr_old(data.toString(2));

            var len = data.length;
            var zeroes = Math.ceil(Math.ceil(Math.log(len) / Math.log(2)) / 8);
            var size_str = len.toString(2);
            var padded = (new Array((zeroes * 7 + 7 + 1) - size_str.length)).join('0') + size_str;
            var size = (new Array(zeroes)).join('0') + '1' + padded;

            ebml += toBinStr_old(json[i].id.toString(2)) + toBinStr_old(size) + data;

        }
        return ebml;
    }

    // woot, a function that's actually written for this project!
    // this parses some json markup and makes it into that binary magic
    // which can then get shoved into the matroska comtainer (peaceably)

    function makeSimpleBlock(data) {
        var flags = 0;
        if (data.keyframe) flags |= 128;
        if (data.invisible) flags |= 8;
        if (data.lacing) flags |= (data.lacing << 1);
        if (data.discardable) flags |= 1;
        if (data.trackNum > 127) {
            throw "TrackNumber > 127 not supported";
        }
        var out = [data.trackNum | 0x80, data.timecode >> 8, data.timecode & 0xff, flags].map(function(e) {
            return String.fromCharCode(e);
        }).join('') + data.frame;

        return out;
    }

    // here's something else taken verbatim from weppy, awesome rite?

    function parseWebP(riff) {
        var VP8 = riff.RIFF[0].WEBP[0];

        var frame_start = VP8.indexOf('\x9d\x01\x2a'); // A VP8 keyframe starts with the 0x9d012a header
        for (var i = 0, c = []; i < 4; i++) c[i] = VP8.charCodeAt(frame_start + 3 + i);

        var width, horizontal_scale, height, vertical_scale, tmp;

        //the code below is literally copied verbatim from the bitstream spec
        tmp = (c[1] << 8) | c[0];
        width = tmp & 0x3FFF;
        horizontal_scale = tmp >> 14;
        tmp = (c[3] << 8) | c[2];
        height = tmp & 0x3FFF;
        vertical_scale = tmp >> 14;
        return {
            width: width,
            height: height,
            data: VP8,
            riff: riff
        };
    }

    // i think i'm going off on a riff by pretending this is some known
    // idiom which i'm making a casual and brilliant pun about, but since
    // i can't find anything on google which conforms to this idiomatic
    // usage, I'm assuming this is just a consequence of some psychotic
    // break which makes me make up puns. well, enough riff-raff (aha a
    // rescue of sorts), this function was ripped wholesale from weppy

    function parseRIFF(string) {
        var offset = 0;
        var chunks = { };

        while (offset < string.length) {
            var id = string.substr(offset, 4);
            var len = parseInt(string.substr(offset + 4, 4).split('').map(function(i) {
                var unpadded = i.charCodeAt(0).toString(2);
                return (new Array(8 - unpadded.length + 1)).join('0') + unpadded;
            }).join(''), 2);
            var data = string.substr(offset + 4 + 4, len);
            offset += 4 + 4 + len;
            chunks[id] = chunks[id] || [];

            if (id == 'RIFF' || id == 'LIST') {
                chunks[id].push(parseRIFF(data));
            } else {
                chunks[id].push(data);
            }
        }
        return chunks;
    }

    // here's a little utility function that acts as a utility for other functions
    // basically, the only purpose is for encoding "Duration", which is encoded as
    // a double (considerably more difficult to encode than an integer)

    function doubleToString(num) {
        return [].slice.call(
            new Uint8Array(
                (
                    new Float64Array([num]) // create a float64 array
                    // extract the array buffer
                ).buffer), 0) // convert the Uint8Array into a regular array
            .map(function(e) { // since it's a regular array, we can now use map
                return String.fromCharCode(e); // encode all the bytes individually
            })
            .reverse() // correct the byte endianness (assume it's little endian for now)
            .join(''); // join the bytes in holy matrimony as a string
    }

    function WhammyVideo(speed, quality) { // a more abstract-ish API
        this.frames = [];
        this.duration = 1000 / speed;
        this.quality = quality || 0.8;
    }

    WhammyVideo.prototype.add = function(frame, duration) {
        if (typeof duration != 'undefined' && this.duration) throw "you can't pass a duration if the fps is set";
        if ('canvas' in frame) { //CanvasRenderingContext2D
            frame = frame.canvas;
        }
        if ('toDataURL' in frame) {
            frame = frame.toDataURL('image/webp', this.quality);
        } else if (typeof frame != "string") {
            throw "frame must be a a HTMLCanvasElement, a CanvasRenderingContext2D or a DataURI formatted string";
        }
        if (!( /^data:image\/webp;base64,/ig ).test(frame)) {
            throw "Input must be formatted properly as a base64 encoded DataURI of type image/webp";
        }
        this.frames.push({
            image: frame,
            duration: duration || this.duration
        });
    };
    WhammyVideo.prototype.compile = function() {
        return new toWebM(this.frames.map(function(frame) {
            var webp = parseWebP(parseRIFF(atob(frame.image.slice(23))));
            webp.duration = frame.duration;
            return webp;
        }));
    };
    return {
        Video: WhammyVideo,
        fromImageArray: function(images, fps) {
            return toWebM(images.map(function(image) {
                var webp = parseWebP(parseRIFF(atob(image.slice(23))));
                webp.duration = 1000 / fps;
                return webp;
            }));
        },
        toWebM: toWebM
    // expose methods of madness
    };
})();


// Muaz Khan     - https://github.com/muaz-khan 
// neizerth      - https://github.com/neizerth
// MIT License   - https://www.webrtc-experiment.com/licence/
// Documentation - https://github.com/streamproc/MediaStreamRecorder
// ==========================================================
// gif-encoder.js

// ==========================================================

// Note:
// ==========================================================
// All libraries listed in this file are "external libraries" 
// and has their own copyrights. Taken from "jsGif" project.

function encode64(n){for(var o="",f=0,l=n.length,u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",s,i,r,c,h,e,t;f<l;)s=n.charCodeAt(f++),i=n.charCodeAt(f++),r=n.charCodeAt(f++),c=s>>2,h=(s&3)<<4|i>>4,e=(i&15)<<2|r>>6,t=r&63,isNaN(i)?e=t=64:isNaN(r)&&(t=64),o=o+u.charAt(c)+u.charAt(h)+u.charAt(e)+u.charAt(t);return o}LZWEncoder=function(){var c={},it=-1,st,ht,rt,l,w,et,ut=12,ct=5003,t,ft=ut,o,ot=1<<ut,u=[],y=[],a=ct,s=0,h=!1,v,f,p,i=0,n=0,vt=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535],r,g=[],lt=c.LZWEncoder=function lt(n,t,i,r){st=n,ht=t,rt=i,l=Math.max(2,r)},nt=function(n,t){g[r++]=n,r>=254&&k(t)},at=function(n){tt(a),s=f+2,h=!0,e(f,n)},tt=function(n){for(var t=0;t<n;++t)u[t]=-1},yt=c.compress=function yt(n,i){var w,c,nt,l,rt,g,k;for(v=n,h=!1,t=v,o=b(t),f=1<<n-1,p=f+1,s=f+2,r=0,l=d(),k=0,w=a;w<65536;w*=2)++k;k=8-k,g=a,tt(g),e(f,i);n:while((nt=d())!=it){if(w=(nt<<ft)+l,c=nt<<k^l,u[c]==w){l=y[c];continue}else if(u[c]>=0){rt=g-c,c==0&&(rt=1);do if((c-=rt)<0&&(c+=g),u[c]==w){l=y[c];continue n}while(u[c]>=0)}e(l,i),l=nt,s<ot?(y[c]=s++,u[c]=w):at(i)}e(l,i),e(p,i)},pt=c.encode=function(n){n.writeByte(l),w=st*ht,et=0,yt(l+1,n),n.writeByte(0)},k=function(n){r>0&&(n.writeByte(r),n.writeBytes(g,0,r),r=0)},b=function(n){return(1<<n)-1},d=function(){if(w==0)return it;--w;var n=rt[et++];return n&255},e=function(r,u){for(i&=vt[n],n>0?i|=r<<n:i=r,n+=t;n>=8;)nt(i&255,u),i>>=8,n-=8;if((s>o||h)&&(h?(o=b(t=v),h=!1):(++t,o=t==ft?ot:b(t))),r==p){while(n>0)nt(i&255,u),i>>=8,n-=8;k(u)}};return lt.apply(this,arguments),c},NeuQuant=function(){var c={},t=256,tt=499,nt=491,rt=487,it=503,g=3*it,b=t-1,r=4,pt=100,ft=16,y=1<<ft,p=10,ii=1<<p,a=10,gt=y>>a,dt=y<<p-a,ni=t>>3,l=6,ti=1<<l,wt=ni*ti,kt=30,ut=10,e=1<<ut,et,k=8,d=1<<k,bt=ut+k,u=1<<bt,w,i,h,n,f=[],o=[],s=[],v=[],ht=c.NeuQuant=function ht(u,f,e){var c,l;for(w=u,i=f,h=e,n=new Array(t),c=0;c<t;c++)n[c]=new Array(4),l=n[c],l[0]=l[1]=l[2]=(c<<r+8)/t,s[c]=y/t,o[c]=0},ot=function(){for(var e=[],o=new Array(t),f,r,u,i=0;i<t;i++)o[n[i][3]]=i;for(f=0,r=0;r<t;r++)u=o[r],e[f++]=n[u][0],e[f++]=n[u][1],e[f++]=n[u][2];return e},ct=function(){var e,i,c,s,u,r,o,h;for(o=0,h=0,e=0;e<t;e++){for(u=n[e],c=e,s=u[1],i=e+1;i<t;i++)r=n[i],r[1]<s&&(c=i,s=r[1]);if(r=n[c],e!=c&&(i=r[0],r[0]=u[0],u[0]=i,i=r[1],r[1]=u[1],u[1]=i,i=r[2],r[2]=u[2],u[2]=i,i=r[3],r[3]=u[3],u[3]=i),s!=o){for(f[o]=h+e>>1,i=o+1;i<s;i++)f[i]=e;o=s,h=e}}for(f[o]=h+b>>1,i=o+1;i<256;i++)f[i]=b},vt=function(){var t,u,k,b,p,c,n,s,o,y,ut,a,f,ft;for(i<g&&(h=1),et=30+(h-1)/3,a=w,f=0,ft=i,ut=i/(3*h),y=ut/pt|0,s=e,c=wt,n=c>>l,n<=1&&(n=0),t=0;t<n;t++)v[t]=s*((n*n-t*t)*d/(n*n));for(o=i<g?3:i%tt!=0?3*tt:i%nt!=0?3*nt:i%rt!=0?3*rt:3*it,t=0;t<ut;)if(k=(a[f+0]&255)<<r,b=(a[f+1]&255)<<r,p=(a[f+2]&255)<<r,u=yt(k,b,p),at(s,u,k,b,p),n!=0&&lt(n,u,k,b,p),f+=o,f>=ft&&(f-=i),t++,y==0&&(y=1),t%y==0)for(s-=s/et,c-=c/kt,n=c>>l,n<=1&&(n=0),u=0;u<n;u++)v[u]=s*((n*n-u*u)*d/(n*n))},ri=c.map=function(i,r,u){var c,l,e,o,h,s,a;for(h=1e3,a=-1,c=f[r],l=c-1;c<t||l>=0;)c<t&&(s=n[c],e=s[1]-r,e>=h?c=t:(c++,e<0&&(e=-e),o=s[0]-i,o<0&&(o=-o),e+=o,e<h&&(o=s[2]-u,o<0&&(o=-o),e+=o,e<h&&(h=e,a=s[3])))),l>=0&&(s=n[l],e=r-s[1],e>=h?l=-1:(l--,e<0&&(e=-e),o=s[0]-i,o<0&&(o=-o),e+=o,e<h&&(o=s[2]-u,o<0&&(o=-o),e+=o,e<h&&(h=e,a=s[3]))));return a},ui=c.process=function(){return vt(),st(),ct(),ot()},st=function(){for(var u,i=0;i<t;i++)n[i][0]>>=r,n[i][1]>>=r,n[i][2]>>=r,n[i][3]=i},lt=function(i,r,f,e,o){var a,y,l,c,h,p,s;for(l=r-i,l<-1&&(l=-1),c=r+i,c>t&&(c=t),a=r+1,y=r-1,p=1;a<c||y>l;){if(h=v[p++],a<c){s=n[a++];try{s[0]-=h*(s[0]-f)/u,s[1]-=h*(s[1]-e)/u,s[2]-=h*(s[2]-o)/u}catch(w){}}if(y>l){s=n[y--];try{s[0]-=h*(s[0]-f)/u,s[1]-=h*(s[1]-e)/u,s[2]-=h*(s[2]-o)/u}catch(w){}}}},at=function(t,i,r,u,f){var o=n[i];o[0]-=t*(o[0]-r)/e,o[1]-=t*(o[1]-u)/e,o[2]-=t*(o[2]-f)/e},yt=function(i,u,f){var h,c,e,b,d,l,k,v,w,y;for(v=2147483647,w=v,l=-1,k=l,h=0;h<t;h++)y=n[h],c=y[0]-i,c<0&&(c=-c),e=y[1]-u,e<0&&(e=-e),c+=e,e=y[2]-f,e<0&&(e=-e),c+=e,c<v&&(v=c,l=h),b=c-(o[h]>>ft-r),b<w&&(w=b,k=h),d=s[h]>>a,s[h]-=d,o[h]+=d<<p;return s[l]+=gt,o[l]-=dt,k};return ht.apply(this,arguments),c},GIFEncoder=function(){function h(){this.bin=[]}for(var c=0,w={};c<256;c++)w[c]=String.fromCharCode(c);h.prototype.getData=function(){for(var t="",i=this.bin.length,n=0;n<i;n++)t+=w[this.bin[n]];return t},h.prototype.writeByte=function(n){this.bin.push(n)},h.prototype.writeUTFBytes=function(n){for(var i=n.length,t=0;t<i;t++)this.writeByte(n.charCodeAt(t))},h.prototype.writeBytes=function(n,t,i){for(var u=i||n.length,r=t||0;r<u;r++)this.writeByte(n[r])};var t={},o,s,v=null,g,k=-1,d=0,f=!1,n,a,i,l,rt,r,ut=[],p=7,y=-1,b=!1,e=!0,ft=!1,it=10,gt=t.setDelay=function(n){d=Math.round(n/10)},ni=t.setDispose=function(n){n>=0&&(y=n)},dt=t.setRepeat=function(n){n>=0&&(k=n)},bt=t.setTransparent=function(n){v=n},kt=t.addFrame=function(t,i){if(t==null||!f||n==null){throw new Error("Please call start method before calling addFrame");return!1}var r=!0;try{i?a=t:(a=t.getImageData(0,0,t.canvas.width,t.canvas.height).data,ft||et(t.canvas.width,t.canvas.height)),ct(),ht(),e&&(vt(),tt(),k>=0&&lt()),st(),ot(),e||tt(),at(),e=!1}catch(u){r=!1}return r},ui=t.finish=function(){if(!f)return!1;var t=!0;f=!1;try{n.writeByte(59)}catch(i){t=!1}return t},nt=function(){g=0,a=null,i=null,l=null,r=null,b=!1,e=!0},fi=t.setFrameRate=function(n){n!=15&&(d=Math.round(100/n))},ri=t.setQuality=function(n){n<1&&(n=1),it=n},et=t.setSize=function et(n,t){(!f||e)&&(o=n,s=t,o<1&&(o=320),s<1&&(s=240),ft=!0)},ti=t.start=function(){nt();var t=!0;b=!1,n=new h;try{n.writeUTFBytes("GIF89a")}catch(i){t=!1}return f=t},ii=t.cont=function(){nt();var t=!0;return b=!1,n=new h,f=t},ht=function(){var e=i.length,o=e/3,f,n,t,u;for(l=[],f=new NeuQuant(i,e,it),r=f.process(),n=0,t=0;t<o;t++)u=f.map(i[n++]&255,i[n++]&255,i[n++]&255),ut[u]=!0,l[t]=u;i=null,rt=8,p=7,v!=null&&(g=yt(v))},yt=function(n){var t;if(r==null)return-1;var c=(n&16711680)>>16,v=(n&65280)>>8,a=n&255,s=0,h=16777216,l=r.length;for(t=0;t<l;){var i=c-(r[t++]&255),e=v-(r[t++]&255),u=a-(r[t]&255),f=i*i+e*e+u*u,o=t/3;ut[o]&&f<h&&(h=f,s=o),t++}return s},ct=function(){var e=o,h=s,f,u,t,r,n;for(i=[],f=a,u=0,t=0;t<h;t++)for(r=0;r<e;r++)n=t*e*4+r*4,i[u++]=f[n],i[u++]=f[n+1],i[u++]=f[n+2]},st=function(){n.writeByte(33),n.writeByte(249),n.writeByte(4);var i,t;v==null?(i=0,t=0):(i=1,t=2),y>=0&&(t=y&7),t<<=2,n.writeByte(0|t|0|i),u(d),n.writeByte(g),n.writeByte(0)},ot=function(){n.writeByte(44),u(0),u(0),u(o),u(s),e?n.writeByte(0):n.writeByte(128|p)},vt=function(){u(o),u(s),n.writeByte(240|p),n.writeByte(0),n.writeByte(0)},lt=function(){n.writeByte(33),n.writeByte(255),n.writeByte(11),n.writeUTFBytes("NETSCAPE2.0"),n.writeByte(3),n.writeByte(1),u(k),n.writeByte(0)},tt=function(){var i,t;for(n.writeBytes(r),i=768-r.length,t=0;t<i;t++)n.writeByte(0)},u=function(t){n.writeByte(t&255),n.writeByte(t>>8&255)},at=function(){var t=new LZWEncoder(o,s,l,rt);t.encode(n)},wt=t.stream=function(){return n},pt=t.setProperties=function(n,t){f=n,e=t};return t}
