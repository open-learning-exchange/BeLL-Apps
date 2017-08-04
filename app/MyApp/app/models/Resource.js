$(function() {
    
    // Reference object of file extension to MIME types used for HTMLapp upload
    var mimeTypeObj = {"323":"text/h323","acx":"application/internet-property-stream","ai":"application/postscript","aif":"audio/x-aiff","aifc":"audio/x-aiff","aiff":"audio/x-aiff","asf":"video/x-ms-asf","asr":"video/x-ms-asf","asx":"video/x-ms-asf","au":"audio/basic","avi":"video/x-msvideo","axs":"application/olescript","bas":"text/plain","bcpio":"application/x-bcpio","bin":"application/octet-stream","bmp":"image/bmp","c":"text/plain","cat":"application/vnd.ms-pkiseccat","cdf":"application/x-cdf","cdf":"application/x-netcdf","cer":"application/x-x509-ca-cert","class":"application/octet-stream","clp":"application/x-msclip","cmx":"image/x-cmx","cod":"image/cis-cod","cpio":"application/x-cpio","crd":"application/x-mscardfile","crl":"application/pkix-crl","crt":"application/x-x509-ca-cert","csh":"application/x-csh","css":"text/css","dcr":"application/x-director","der":"application/x-x509-ca-cert","dir":"application/x-director","dll":"application/x-msdownload","dms":"application/octet-stream","doc":"application/msword","dot":"application/msword","dvi":"application/x-dvi","dxr":"application/x-director","eps":"application/postscript","etx":"text/x-setext","evy":"application/envoy","exe":"application/octet-stream","fif":"application/fractals","flr":"x-world/x-vrml","gif":"image/gif","gtar":"application/x-gtar","gz":"application/x-gzip","h":"text/plain","hdf":"application/x-hdf","hlp":"application/winhlp","hqx":"application/mac-binhex40","hta":"application/hta","htc":"text/x-component","htm":"text/html","html":"text/html","htt":"text/webviewhtml","ico":"image/x-icon","ief":"image/ief","iii":"application/x-iphone","ins":"application/x-internet-signup","isp":"application/x-internet-signup","jfif":"image/pipeg","jpe":"image/jpeg","jpeg":"image/jpeg","jpg":"image/jpeg","js":"application/x-javascript","latex":"application/x-latex","lha":"application/octet-stream","lsf":"video/x-la-asf","lsx":"video/x-la-asf","lzh":"application/octet-stream","m13":"application/x-msmediaview","m14":"application/x-msmediaview","m3u":"audio/x-mpegurl","man":"application/x-troff-man","mdb":"application/x-msaccess","me":"application/x-troff-me","mht":"message/rfc822","mhtml":"message/rfc822","mid":"audio/mid","mny":"application/x-msmoney","mov":"video/quicktime","movie":"video/x-sgi-movie","mp2":"video/mpeg","mp3":"audio/mpeg","mpa":"video/mpeg","mpe":"video/mpeg","mpeg":"video/mpeg","mpg":"video/mpeg","mpp":"application/vnd.ms-project","mpv2":"video/mpeg","ms":"application/x-troff-ms","msg":"application/vnd.ms-outlook","mvb":"application/x-msmediaview","nc":"application/x-netcdf","nws":"message/rfc822","oda":"application/oda","p10":"application/pkcs10","p12":"application/x-pkcs12","p7b":"application/x-pkcs7-certificates","p7c":"application/x-pkcs7-mime","p7m":"application/x-pkcs7-mime","p7r":"application/x-pkcs7-certreqresp","p7s":"application/x-pkcs7-signature","pbm":"image/x-portable-bitmap","pdf":"application/pdf","pfx":"application/x-pkcs12","pgm":"image/x-portable-graymap","pko":"application/ynd.ms-pkipko","pma":"application/x-perfmon","pmc":"application/x-perfmon","pml":"application/x-perfmon","pmr":"application/x-perfmon","pmw":"application/x-perfmon","pnm":"image/x-portable-anymap","pot":"application/vnd.ms-powerpoint","ppm":"image/x-portable-pixmap","pps":"application/vnd.ms-powerpoint","ppt":"application/vnd.ms-powerpoint","prf":"application/pics-rules","ps":"application/postscript","pub":"application/x-mspublisher","qt":"video/quicktime","ra":"audio/x-pn-realaudio","ram":"audio/x-pn-realaudio","ras":"image/x-cmu-raster","rgb":"image/x-rgb","rmi":"audio/mid","roff":"application/x-troff","rtf":"application/rtf","rtx":"text/richtext","scd":"application/x-msschedule","sct":"text/scriptlet","setpay":"application/set-payment-initiation","setreg":"application/set-registration-initiation","sh":"application/x-sh","shar":"application/x-shar","sit":"application/x-stuffit","snd":"audio/basic","spc":"application/x-pkcs7-certificates","spl":"application/futuresplash","src":"application/x-wais-source","sst":"application/vnd.ms-pkicertstore","stl":"application/vnd.ms-pkistl","stm":"text/html","sv4cpio":"application/x-sv4cpio","sv4crc":"application/x-sv4crc","svg":"image/svg+xml","swf":"application/x-shockwave-flash","t":"application/x-troff","tar":"application/x-tar","tcl":"application/x-tcl","tex":"application/x-tex","texi":"application/x-texinfo","texinfo":"application/x-texinfo","tgz":"application/x-compressed","tif":"image/tiff","tiff":"image/tiff","tr":"application/x-troff","trm":"application/x-msterminal","tsv":"text/tab-separated-values","txt":"text/plain","uls":"text/iuls","ustar":"application/x-ustar","vcf":"text/x-vcard","vrml":"x-world/x-vrml","wav":"audio/x-wav","wcm":"application/vnd.ms-works","wdb":"application/vnd.ms-works","wks":"application/vnd.ms-works","wmf":"application/x-msmetafile","wps":"application/vnd.ms-works","wri":"application/x-mswrite","wrl":"x-world/x-vrml","wrz":"x-world/x-vrml","xaf":"x-world/x-vrml","xbm":"image/x-xbitmap","xla":"application/vnd.ms-excel","xlc":"application/vnd.ms-excel","xlm":"application/vnd.ms-excel","xls":"application/vnd.ms-excel","xlt":"application/vnd.ms-excel","xlw":"application/vnd.ms-excel","xof":"x-world/x-vrml","xpm":"image/x-xpixmap","xwd":"image/x-xwindowdump","z":"application/x-compress","zip":"application/zip"}

    App.Models.Resource = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (this.pubResource == true) {

                if (_.has(this, 'id')) {
                    var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/pubresources/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                        : App.Server + '/pubresources/' + this.id // For READ
                } else {
                    var url = App.Server + '/pubresources' // for CREATE
                }

            } else {
                if (_.has(this, 'id')) {
                    var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/resources/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                        : App.Server + '/resources/' + this.id // For READ
                } else {
                    var url = App.Server + '/resources' // for CREATE
                }

            }
            return url
        },

        defaults: {
            kind: 'Resource', //Saves kind of document according to corresponding db's.Mostly used in couch db views.
            status: ''
        },

        schema: {
            title: 'Text', //Saves title of a resource
            author: { //Saves author's name of a resource
                title: 'Author/Editor',
                type: 'Text'
            }, // Author Field is required when adding the resource with tag news else no need for that.
            Publisher: { //Saves publisher's name of a resource
                title: 'Publisher/Attribution',
                type: 'Text'
            },
            language: { //Saves language of a resource
                type: 'Select',
                options: []
            },

            Year: 'Text', //Year in which resource has been added

            linkToLicense: { //Saves web link of license to that resource if any
                title: 'Link To License',
                type: 'Text'
            },

            subject: { //Subject name for which resource is added
                title: 'Subjects',
                type: 'Select',
                options: ['Agriculture', 'Arts', 'Business and Finance', 'Environment', 'Food and Nutrition', 'Geography', 'Health and Medicine', 'History', 'Human Development', 'Languages', 'Law', 'Learning', 'Literature', 'Math', 'Music', 'Politics and Government', 'Reference', 'Religion', 'Science', 'Social Sciences', 'Sports', 'Technology']
            },
            Level: { //Grade/Class level for which resource is added
                title: 'Levels',
                type: 'Select',
                options: ['Early Education', 'Lower Primary', 'Upper Primary', 'Lower Secondary', 'Upper Secondary', 'Undergraduate', 'Graduate', 'Professional']
            },
            Tag: { //Id(s) of collection doc in which resource has been added. These ids are actually coming from collectionlist db.
                title: 'Collection',
                type: 'Select',
                options: []
            },
            Medium: { //Saves type/medium of resource e.g: video, audio of PDF etc.
                type: 'Select',
                options: ['Text', 'Graphic/Pictures', 'Audio/Music/Book ', 'Video']
            },
            openWith: { //Its value decides(provides information) in which way we want to open this resource, e.g: Bell-Reader, PDF, Video Player etc.
                type: 'Select',
                options: [{
                    val: 'Just download',
                    label: 'Just download'
                }, {
                    val: 'HTML',
                    label: 'HTML'
                }, {
                    val: 'PDF.js',
                    label: 'PDF'
                }, {
                    val: 'Bell-Reader',
                    label: 'Bell-Reader'
                }, {
                    val: 'MP3',
                    label: 'Audio (MP3)'
                }, {
                    val: 'Flow Video Player',
                    label: 'Video (MP4, FLV)'
                }, {
                    val: 'BeLL Video Book Player',
                    label: 'Video Book (webm+json)'
                }, {
                    val: 'Native Video',
                    label: 'Native Video'
                }]
            },
            resourceFor: { //For whom we are adding resource, either is it for Learner or Leader.
                type: 'Select',
                options: [{
                    val: 'Default',
                    label: 'Default'
                }, {
                    val: 'Leader',
                    label: 'Leader'
                }, {
                    val: 'Learner',
                    label: 'Learner'
                }]
            },
            resourceType: { // Which type of resource it is, whether is it a simple book or is it a book containing questions to discuss.
                type: 'Select',
                options: [{
                    val: 'Textbook',
                    label: 'Textbook'
                }, {
                    val: 'Lesson Plan',
                    label: 'Lesson Plan'
                }, {
                    val: 'Activities',
                    label: 'Activities'
                }, {
                        val: 'Exercises',
                        label: 'Exercises'
                    },
                    {
                        val: 'Discussion Questions',
                        label: 'Discussion Questions'
                    }]
            },
            uploadDate: 'Date', //Date of uploading resource
            averageRating: 'Text', //Total average rating of a resource
            articleDate: { //Date when a resource was added to library, mostly its same as uploadDate
                title: 'Date Added to Library',
                type: 'Date'
            },
            addedBy: 'Text', //Name of person/manager who is adding resource
            openUrl: [], //URL link if it is an HTML resource,
            openWhichFile: 'Text'
        },
        saveAttachment: function(formEl, fileEl, revEl) {

            // Work with this doc in the files database
            var server = App.Server
            var input_db = "resources"
            var input_id = (this.get('_id')) ? this.get('_id') : this.get('id')
            var model = this
            
            function fileExt(fileName) {
                var extMatch = fileName.match(/\.[a-z0-9]+$/i);
                // If the extension isn't in a format of only letters and numbers after the dot, assume it's a text file
                if(extMatch === null) {
                    return 'txt';
                }
                return fileName.match(/\.[a-z0-9]+$/i)[0].slice(1);
            }
            
            function mimeType(fileName) {
                return mimeTypeObj[fileExt(fileName)] || 'text/plain';
            }
            
            // Reads the data from each zip file in base64 for upload to couchDB (returns a promise since files are loaded async)
            var preProcessZip = function(zip) {
                return function(fileName) {
                    return new Promise(function(resolve,reject) {
                        // When file was not read error block wasn't called from async so added try...catch block
                        try {
                            zip.file(fileName).async('base64').then(function success(data) {
                                resolve({name:fileName,data:data});
                            },function error(e) {
                                reject(e);
                            });
                        } catch(e) {
                            console.log(fileName + ' has caused error.');
                            reject(e);
                        }
                    });
                };
            };
            

            // Start by trying to open a Couch Doc at the _id and _db specified
            $.couch.db(input_db).openDoc(input_id, {
                // If found, then set the revision in the form and save
                success: function(couchDoc) {
                    
                    // Check if attachment is zip file based on MIME type and extension
                    var file = $(fileEl)[0].files[0],
                        zipTypes = ['application/x-zip-compressed','application/zip','application/zip-compressed', 'multipart/x-zip','application/octet-stream'],
                        isZip = zipTypes.indexOf(file.type) > -1 && fileExt(file.name) === 'zip';
                    
                    if(isZip) {
                        var zip = new JSZip();
                        // This loads an object with file information from the zip, but not the data of the files
                        zip.loadAsync(file).then(function(data) {
                            var fileNames = [];
                            // Add file names to array for mapping
                            for(var path in data.files) {
                                if(!data.files[path].dir && path.indexOf('DS_Store') === -1) {
                                    fileNames.push(path);
                                }
                            }
                            // Since files are loaded async, use Promise all to ensure all data from the files are loaded before attempting upload
                            Promise.all(fileNames.map(preProcessZip(zip))).then(function(filesArray) {
                                // Create object in format for multiple attachment upload to CouchDB
                                var filesObj = filesArray.reduce(function(filesObj,file) {
                                    filesObj[file.name] = { data:file.data, content_type:mimeType(file.name) };
                                    return filesObj;
                                },{});
                                var newDoc = Object.assign({},couchDoc,{'_attachments':filesObj});
                                $.couch.db(input_db).saveDoc(newDoc,{
                                    success: function(response) {
                                        model.trigger('savedAttachment')
                                        alert(App.languageDict.attributes.Resource_Added_Success)
                                        App.stopActivityIndicator()
                                    },
                                    error: function(response) {
                                        alert(App.languageDict.attributes.Error)
                                        App.stopActivityIndicator()
                                    }
                                });
                            // If one file fails, everything fails so adding error function
                            },function(error) {
                                console.log(error);
                                alert(App.languageDict.attributes.Error);
                                App.stopActivityIndicator();
                            });
                            
                        });
                    } else {
                    
                        // If the current doc has an attachment we need to clear it for the new attachment
                        if (_.has(couchDoc, '_attachments')) {
                            $.ajax({
                                url: '/resources/' + couchDoc._id + '/' + _.keys(couchDoc._attachments)[0] + '?rev=' + couchDoc._rev,
                                type: 'DELETE',
                                success: function(response, status, jqXHR) {
                                    // Defining a revision on saving over a Couch Doc that exists is required.
                                    // This puts the last revision of the Couch Doc into the input#rev field
                                    // so that it will be submitted using ajaxSubmit.
                                    response = JSON.parse(response)
                                    $(revEl).val(response.rev);
                                    // Submit the form with the attachment
                                    $(formEl).ajaxSubmit({
                                        url: server + "/" + input_db + "/" + input_id,
                                        success: function(response) {
                                            model.trigger('savedAttachment')
                                        }
                                    })
                                }
                            })
                        }
                        // The doc does not already have attachment, ready to go
                        else {
                            $(revEl).val(model.get('rev'));
                            // Submit the form with the attachment
                            $(formEl).ajaxSubmit({
                                url: server + "/" + input_db + "/" + input_id,
                                success: function(response) {
                                    model.trigger('savedAttachment')
                                    alert(App.languageDict.attributes.Resource_Added_Success)
                                    App.stopActivityIndicator()
                                },
                                error: function(response) {
                                    alert(App.languageDict.attributes.Error)
                                    App.stopActivityIndicator()
                                }
                            })
                        }
                    }
                }, // End success, we have a Doc
                handleError: function(s, xhr, status, e) {
                    // If a local callback was specified, fire it
                    if (s.error) {
                        s.error.call(s.context || window, xhr, status, e);
                    }
                    // Fire the global callback
                    if (s.global) {
                        (s.context ? jQuery(s.context) : jQuery.event).trigger("ajaxError", [xhr, s, e]);
                    }
                },
                // @todo I don't think this code will ever be run.
                // If there is no CouchDB document with that ID then we'll need to create it before we can attach a file to it.
                error: function(status) {
                    $.couch.db(input_db).saveDoc({
                        "_id": input_id
                    }, {
                        success: function(couchDoc) {
                            // Now that the Couch Doc exists, we can submit the attachment,
                            // but before submitting we have to define the revision of the Couch
                            // Doc so that it gets passed along in the form submit.
                            $(revEl).val(couchDoc.rev);
                            // @todo This file submit stopped working. Couch setting coming from different origin?
                            $(formEl).ajaxSubmit({
                                // Submit the form with the attachment
                                url: "/" + input_db + "/" + input_id,
                                success: function(response) {
                                    model.trigger('savedAttachment')
                                }
                            })
                        }
                    })
                } // End error, no Doc

            }) // End openDoc()
        }

    })

})