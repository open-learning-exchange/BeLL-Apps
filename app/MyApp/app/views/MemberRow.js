$(function() {

    App.Views.MemberRow = Backbone.View.extend({

        tagName: "tr",

        getFormattedDate: function(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        },

        createJsonlog: function(logdb, logdate, gender) {
            var docJson = {
                logDate: logdate,
                resourcesIds: [],
                male_visits: 0,
                female_visits: 0,
                male_timesRated: [],
                female_timesRated: [],
                male_rating: [],
                community: App.configuration.get('code'),
                female_rating: [],
                resources_names: [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            }
            if (gender == 'Male') {
                docJson.male_deleted_count = parseInt(((docJson.male_deleted_count) ? docJson.male_deleted_count : 0)) + 1;
                docJson.female_deleted_count = parseInt(((docJson.female_deleted_count) ? docJson.female_deleted_count : 0)) + 0;
            } else {
                docJson.female_deleted_count = parseInt(((docJson.female_deleted_count) ? docJson.female_deleted_count : 0)) + 1;
                docJson.male_deleted_count = parseInt(((docJson.male_deleted_count) ? docJson.male_deleted_count : 0)) + 0;
            }
            docJson.community = App.configuration.get('code'),
                logdb.put(docJson, logdate, function(err, response) {
                    if (!err) {
                        console.log("Deleted members successfully saved.");
                    } else {
                        console.log("Deleted members count failed to save.");
                        console.log(err);
                    }
                });
        },

        UpdatejSONlog: function(logdb, logdate, logModel, gender) {
            if (gender == 'Male') {
                logModel.male_deleted_count = parseInt(((logModel.male_deleted_count) ? logModel.male_deleted_count : 0)) + 1;
                logModel.female_deleted_count = parseInt(((logModel.female_deleted_count) ? logModel.female_deleted_count : 0)) + 0;
            } else {
                logModel.female_deleted_count = parseInt(((logModel.female_deleted_count) ? logModel.female_deleted_count : 0)) + 1;
                logModel.male_deleted_count = parseInt(((logModel.male_deleted_count) ? logModel.male_deleted_count : 0)) + 0;
            }
            logModel.community = App.configuration.get("code");

            logdb.put(logModel, logdate, logModel._rev, function(err, response) { // _id: logdate, _rev: logModel._rev
                if (!err) {
                    console.log("updated daily log from pouchdb for today..");
                } else {
                    console.log("UpdatejSONlog:: err making update to record");
                    console.log(err);
                }
            });
        },

        events: {
            "click .destroy": function(e) {
                var that = this;
                var logdb = new PouchDB('activitylogs');
                var currentdate = new Date();
                var logdate = that.getFormattedDate(currentdate);
                var gender = this.model.get("Gender");
                logdb.get(logdate, function(err, logModel) {
                    if (!err) {
                        that.UpdatejSONlog(logdb, logdate, logModel, gender);
                    } else {
                        that.createJsonlog(logdb, logdate, gender);
                    }
                });
                e.preventDefault()
                this.model.destroy()
                this.remove()
            },

            "click #deactive": function(e) {

                e.preventDefault()

                var that = this
                this.model.on('sync', function() {
                    // rerender this view

                    //that.render()
                    location.reload();
                })

                this.model.save({
                    status: "deactive"
                }, {
                    success: function() {}
                });

                //  this.model.fetch({async:false})
            },
            "click #active": function(e) {

                e.preventDefault()
                var that = this
                this.model.on('sync', function() {
                    // rerender this view

                    //that.render()
                    location.reload();
                })
                this.model.save({
                    status: "active"
                }, {
                    success: function() { /*this.model.fetch({async:false})*/ }
                });

            },
            "click .browse": function(e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        template: $("#template-MemberRow").html(),

        initialize: function() {
            //this.model.on('destroy', this.remove, this)
        },

        render: function() {
            if (!this.model.get("visits")) {
                this.model.set("visits")
            }
            var vars = this.model.toJSON()
            vars.community_code = this.community_code

            if ((this.model.get("_id") == $.cookie('Member._id')) && !this.isadmin) {
                vars.languageDict=App.languageDict;
                vars.showdelete = false
                vars.showedit = true
            } else if (!this.isadmin) {
                vars.languageDict=App.languageDict;
                vars.showdelete = false
                vars.showedit = false
            } else {
                vars.languageDict=App.languageDict;
                vars.showdelete = true
                vars.showedit = true
            }
            vars.src = "img/default.jpg"
            var attchmentURL = '/members/' + this.model.id + '/'
            if (typeof this.model.get('_attachments') !== 'undefined') {
                vars.languageDict=App.languageDict;
                attchmentURL = attchmentURL + _.keys(this.model.get('_attachments'))[0]
                vars.src = attchmentURL
            }
            vars.languageDict=App.languageDict;
            this.$el.html(_.template(this.template, vars))
        }


    })

})