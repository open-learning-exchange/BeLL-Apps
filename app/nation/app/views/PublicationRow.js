$(function() {

    App.Views.PublicationRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function (event) {
                var languageDictValue=App.Router.loadLanguageDocs();
                if (confirm(languageDictValue.attributes.Confirm_Publication)) {
                    var that = this;
                    var pubId = that.model.attributes._id;
                    console.log(that.model.attributes._id);
                    //   if (!(this.model.hasOwnProperty(communityNames))) {
                    //  if(this.model.attributes.communityNames != [] || this.model.attributes.communityNames.length != 0 ) {
                    //**************************************************************************************************
                    $.ajax({
                        url: '/publicationdistribution/_design/bell/_view/pubdistributionByPubId?key="' + that.model.attributes._id + '"',
                        type: 'GET',
                        dataType: "json",
                        async: false,
                        success: function (pubDist) {
                            if (pubDist.rows.length > 0) {

                                _.each(pubDist.rows, function (row) {
                                    //  if (pubDist.rows[0]) {
                                    //   var pubDistModel = pubDist.rows[0];
                                    var pubDistModel = row.value;
                                    var doc = {
                                        _id: pubDistModel._id,
                                        _rev: pubDistModel._rev
                                    };
                                    $.couch.db("publicationdistribution").removeDoc(doc, {
                                        success: function (data) {
                                            that.model.destroy();
                                            alert(languageDictValue.attributes.PubsDistDb_Delete_Success)
                                            console.log(that.model.attributes._id)
                                            console.log(data);
                                        },
                                        error: function (status) {
                                            console.log(status);
                                        }
                                    });
                                    //  }
                                })
                            }
                            else {
                                alert(languageDictValue.attributes.Model_fetch_Pubs_Success)
                                console.log(that.model.attributes._id)
                                that.model.destroy()
                                event.preventDefault()
                            }
                        }
                    })
                }
                    // }
             //   }
                //**************************************************************************************************
                //else {
                //    alert("model is accessed publication")
                //    console.log(this.model.attributes._id)
                //    // that.model.destroy()
                //    event.preventDefault()
                //}
            },

        "click #a": function (id) {
            alert(id)
        }

        },

        vars: {},

        template: _.template($("#template-PublicationRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            //vars.avgRating = Math.round(parseFloat(vars.averageRating))
            var vars = this.model.toJSON()

            vars.isManager = this.isManager
            var date = new Date(vars.Date)
            vars.Date = date.toUTCString()
            this.$el.append(this.template(vars))


        }

    })

})