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

            var $button = $('<h6>Select Community(\'ies)</h6><select multiple id="comselect"></select><br><br><a class="btn btn-success" id="formButton">Send</button>')
            this.$el.append($button)
            this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
            this.$el.append('<a class="btn btn-warning" id="cancelButton">Cancel</button>')
        },
        syncData: function() {
            var selectedValues = $('#comselect').val();
            if (!selectedValues) {
                alert('Please select Community first')
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
            App.startActivityIndicator()
            var sendPub = new Array()
            //******if starts********************************************
            if (selectedValues.length > 0) {
                //******for loop start*************
                for (var i = 0; i < selectedValues.length; i++) {
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
                            var pubResult = resResult.rows[0];
                            if (pubResult.doc.communityNames != [] && pubResult.doc.communityNames.length > 0 && pubResult.doc.communityNames.indexOf(cName) > -1) {
                                alert("This Publication is already sent to the selected community")
                            } else {
                                sendPub.push({
                                    communityUrl: cUrl,
                                    communityName: cName,
                                    publicationId: p_id,
                                    Viewed: false
                                })
                                var tempComm = pubResult.doc.communityNames;
                                tempComm.push(cName)
                                pubResult.doc.communityNames = tempComm;
                                $.couch.db("publications").saveDoc(pubResult.doc, {
                                    success: function(data) {
                                        console.log(data);
                                    },
                                    error: function(status) {
                                        console.log(status);
                                    },
                                    async: false
                                });
                                $.couch.db("publicationdistribution").bulkSave({
                                    "docs": sendPub
                                }, {
                                    success: function(data) {
                                        console.log(data);
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

            console.log('http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/pubresources')
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
                    console.log(response)
                },
                async: false
            })
        },
        synchPubCommunityWithURL: function(communityurl, communityname, pId) {


            console.log('http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/recpublication')
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
                    console.log(response)
                },
                async: false
            })
        },
    })

})