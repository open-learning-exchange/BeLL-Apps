$(function() {

    App.Views.listNationView = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #cancelButton": "hidediv",
            "click #formButton": "syncData"
        },
        hidediv: function() {
            $('#invitationdiv').fadeOut(1000)

            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);
            $('#addQuestion').css('pointer-events','auto');
        },
        render: function() {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            var $button = $('<h6>'+App.languageDictValue.get('Select_Nations')+'</h6><select multiple id="nationSelect" size ="15" style="width: 380px;"></select><br><br><a class="btn btn-success" id="formButton">'+App.languageDictValue.get('Send')+'</button>')
            this.$el.append($button)
            this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
            this.$el.append('<a class="btn btn-warning" id="cancelButton">'+App.languageDictValue.get('Cancel')+'</button>')
        },
        syncData: function() {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            var languageDictValue=App.Router.loadLanguageDocs(lang);
            var selectedValues = $('#nationSelect').val();
            if (!selectedValues) {
                alert(languageDictValue.attributes.Prompt_Nation_First)
                return
            }
            var that = this;
            if (that.pId != undefined && that.pId != null) {
                if (that.pId) {
                    that.syncPublicationsData(that.pId, selectedValues);
                }
            }
        },
        syncPublicationsData: function(p_id, selectedValues) {
            var that = this
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            var languageDictValue=App.Router.loadLanguageDocs(lang);
            App.startActivityIndicator()
            var sendPub = new Array()
            //******if starts********************************************
            if (selectedValues.length > 0) {
                //******for loop start*************
                var pubResult;
                var i;
                var selectedNations = [];
                for (i = 0; i < selectedValues.length; i++) {
                    sendPub.splice(0, sendPub.length);
                    var nName = $("#nationSelect option[value='" + selectedValues[i] + "']").text()
                    var x = p_id;
                    //***********************************************************
                    //extra code for  #100
                    $.ajax({
                        url: '/publications/_design/bell/_view/publicationById?include_docs=true&key="' + x + '"',
                        type: 'GET',
                        dataType: 'json',
                        success: function(resResult) {
                            pubResult = resResult.rows[0];
                            if(pubResult.doc.nationNames == undefined){
                                pubResult.doc.nationNames = []
                            }
                            if (pubResult.doc.nationNames != [] && pubResult.doc.nationNames.length > 0 && pubResult.doc.nationNames.indexOf(nName) > -1) {
                                alert( languageDictValue.attributes.Already_Pub_Sent+' '+ nName);
                            } else {
                                selectedNations.push(nName);
                                sendPub.push({
                                    nationName: nName,
                                    publicationId: p_id,
                                    Viewed: false,
                                    createrNationUrl: App.configuration.get('nationUrl'),
                                    createrNationName: App.configuration.get('nationName')
                                })
                                $.couch.db("publicationdistribution").bulkSave({
                                    "docs": sendPub
                                }, {
                                    success: function(data) {
                                        var centralNationUrl = App.Router.getCentralNationUrl();
                                        that.synchPubNationWithCenter(centralNationUrl);
                                    },
                                    error: function(status) {
                                        console.log(status);
                                    },
                                    async: false
                                });
                            }

                        },
                        async: false
                    });
                }
                if(i == selectedValues.length && selectedNations && selectedNations.length > 0) {
                    pubResult.doc["downloadedByNation"] = [];
                    pubResult.doc["createrNationUrl"] = App.configuration.get('nationUrl');
                    pubResult.doc["createrNationName"] = App.configuration.get('nationName');
                    for(var j = 0 ; j < selectedNations.length ; j++) {
                        pubResult.doc.nationNames.push(selectedNations[j]);
                    }
                    $.couch.db("publications").saveDoc(pubResult.doc, {
                        success: function(data) {
                            
                        },
                        error: function(status) {
                            console.log(status);
                        },
                        async: false
                    });
                }

                //******for loop ends******************************
                $("#list option[value='2']").text()
                $('#invitationdiv').fadeOut(1000)
                setTimeout(function() {
                    $('#invitationdiv').hide()
                }, 1000);
                App.stopActivityIndicator()
            }
        },
        
        synchPubNationWithCenter: function(centralNationUrl) {
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                    "source": "publicationdistribution",
                    "target": 'http://' + centralNationUrl + '/publicationdistribution'
                }),
                success: function(response) {
                },
                async: false
            })
        }
    })

})
