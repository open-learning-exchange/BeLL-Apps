$(function() {

    App.Views.listCommunityView = Backbone.View.extend({

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
            var $button = $('<h6>'+App.languageDictValue.get('select_communities')+'</h6><select multiple id="comselect" size ="15" style="width: 380px;"></select><br><br><a class="btn btn-success" id="formButton">'+App.languageDictValue.get('Send')+'</button>')
            this.$el.append($button)
            this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
            this.$el.append('<a class="btn btn-warning" id="cancelButton">'+App.languageDictValue.get('Cancel')+'</button>')
        },
        syncData: function() {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            var languageDictValue=App.Router.loadLanguageDocs(lang);
            var selectedValues = $('#comselect').val();
            if (!selectedValues) {
                alert(languageDictValue.attributes.Prompt_Community_First)
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
                var selectedComms = [];
                for (i = 0; i < selectedValues.length; i++) {
                    sendPub.splice(0, sendPub.length);
                    var cUrl = selectedValues[i]
                    var cName = $("#comselect option[value='" + selectedValues[i] + "']").text()

                    var x = p_id;
                    //***********************************************************
                    //extra code for  #100
                    $.ajax({
                        url: '/publications/_design/bell/_view/publicationById?include_docs=true&key="' + x + '"',
                        type: 'GET',
                        dataType: 'json',
                        success: function(resResult) {
                            pubResult = resResult.rows[0];
                            if (pubResult.doc.communityNames != [] && pubResult.doc.communityNames.length > 0 && pubResult.doc.communityNames.indexOf(cName) > -1) {
                                alert( languageDictValue.attributes.Already_Pub_Sent+' '+ cName);
                            } else {
                                selectedComms.push(cName);
                                sendPub.push({
                                    communityUrl: cUrl,
                                    communityName: cName,
                                    publicationId: p_id,
                                    Viewed: false
                                })
                                $.couch.db("publicationdistribution").bulkSave({
                                    "docs": sendPub
                                }, {
                                    success: function(data) {
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
                if(i == selectedValues.length && selectedComms && selectedComms.length > 0) {
                    for(var j = 0 ; j < selectedComms.length ; j++) {
                        pubResult.doc.communityNames.push(selectedComms[j]);
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

        synchResCommunityWithURL: function(communityurl, communityname, res) {
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                    "source": "resources",
                    "target": 'http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/pubresources',
                    "doc_ids": res
                }),
                success: function(response) {
                },
                async: false
            })
        },
        synchPubCommunityWithURL: function(communityurl, communityname, pId) {
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                    "source": "publications",
                    "target": 'http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/recpublication',
                    "doc_ids": pId
                }),
                success: function(response) {
                },
                async: false
            })
        }
    })

})
