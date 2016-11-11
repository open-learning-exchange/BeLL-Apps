$(function() {

    App.Views.PendingResourceRow = Backbone.View.extend({

        tagName: "tr",
        id: null,
        admn: null,
        events: {
            "click #acceptButton": function(event) {
                this.model.set("status", "accepted");
                this.model.save();
                var clanguage = getLanguage($.cookie('Member._id'));
                languageDictValue = getSpecificLanguage(clanguage);
                App.languageDict = languageDictValue;
                alert(App.languageDict.attributes.Resource_Success_Added);
                location.reload();

            },
            "click .destroy": function(event) {
                var languageDictValue;
                var clanguage = getLanguage($.cookie('Member._id'));
                languageDictValue = getSpecificLanguage(clanguage);
                App.languageDict = languageDictValue;
                if (confirm(App.languageDict.attributes.Confirm_Decline)) {
                    var that = this

                    this.model.destroy()
                    alert(App.languageDict.attributes.Resource_Deleted_success)
                    event.preventDefault()
                }
            },
            "click .trigger-modal": function() {
                $('#myModal').modal({

                    show: true
                })
            }
        },

        vars: {},

        template: _.template($("#template-PendingResourceRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this);
        },
        render: function() {
            var vars = this.model.toJSON()
            var Details = ""

            if (vars.author != undefined && vars.author != "") {
                Details = Details + "<b>"+App.languageDict.attributes.author+"</b>&nbsp;" + vars.author + ' , '
            }

            if (vars.Year != undefined && vars.Year != "") {
                Details = Details + "<b>"+App.languageDict.attributes.year+" </b>&nbsp;" + vars.Year + ' , '
            }

            if (vars.openWith != undefined) {
                Details = Details + "<b>"+App.languageDict.attributes.media+" </b>&nbsp;"
                Details = Details + vars.openWith + ' , '

            }

            if (vars.language != undefined) {
                if (vars.language.length > 0) {
                    Details = Details + '<b>'+App.languageDict.attributes.language+'</b>&nbsp;' + vars.language + " , "
                }
            }

            if (vars.subject != undefined) {
                Details = Details + "<b>"+App.languageDict.attributes.subject+" </b>&nbsp;"
                if ($.isArray(vars.subject)) {
                    for (var i = 0; i < vars.subject.length; i++) {
                        Details = Details + vars.subject[i] + ' / '
                    }

                } else {
                    Details = Details + vars.subject + ' / '

                }
                Details = Details.substring(0, Details.length - 3)
                Details = Details + ' , '
            }

            if (vars.Level != undefined) {
                Details = Details + "<b>"+App.languageDict.attributes.level+" </b>&nbsp;"
                if ($.isArray(vars.Level)) {
                    for (var i = 0; i < vars.Level.length; i++) {
                        Details = Details + vars.Level[i] + ' / '
                    }

                } else {
                    Details = Details + vars.Level + ' / '

                }

                Details = Details.substring(0, Details.length - 3)
                Details = Details + ' , '

            }

            if (vars.Publisher != undefined && vars.Publisher != "") {
                Details = Details + "<b>"+App.languageDict.attributes.publisher_attribution+"</b>&nbsp;" + vars.Publisher + ' , '
            }

            if (vars.linkToLicense != undefined && vars.linkToLicense != "") {
                Details = Details + "<b>"+App.languageDict.attributes.link_to_license+" </b>&nbsp;" + vars.linkToLicense + ' , '
            }

            if (vars.resourceFor != undefined && vars.resourceFor != "") {
                Details = Details + "<b>"+App.languageDict.attributes.resource_for+"</b>&nbsp;" + vars.resourceFor + ' , '
            }
            ////////////////////////////////////////////////Code for Issue No 60 Adding a drop-down////////////////////////////////
            if (vars.resourceType != undefined && vars.resourceType != "") {
                Details = Details + "<b>"+App.languageDict.attributes.resource_type+"</b>&nbsp;" + vars.resourceType + ' , '
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (vars.Tag != undefined) {
                if ($.isArray(vars.Tag)) {
                    if (vars.Tag.length > 0)
                        Details = Details + "<b>"+App.languageDict.attributes.Collection+"</b>&nbsp;"

                    for (var i = 0; i < vars.Tag.length; i++) {
                        if (this.collections.get(vars.Tag[i]) != undefined)
                            Details = Details + this.collections.get(vars.Tag[i]).toJSON().CollectionName + " / "
                    }
                } else {
                    if (vars.Tag != 'Add New')
                        Details = Details + "<b>"+App.languageDict.attributes.Collection+"</b>&nbsp;" + vars.Tag + ' / '
                }
            }
            Details = Details.substring(0, Details.length - 3)
            Details = Details + ' , '

            Details = Details.substring(0, Details.length - 3)

            vars.Details = Details;
            vars.open=App.languageDict.attributes.Open;
            vars.viewDetails=App.languageDict.attributes.View_Details;
            vars.accept=App.languageDict.attributes.Accept;
            vars.decline=App.languageDict.attributes.Decline;
            var that = this;

            if (that.model.get("sum") != 0) {
                vars.totalRatings = that.model.get("timesRated")
                vars.averageRating = (parseInt(that.model.get("sum")) / parseInt(vars.totalRatings))
            } else {
                vars.averageRating = "Sum not found"
                vars.totalRatings = 0
            }

            that.$el.append(that.template(vars))
        }


    })

})