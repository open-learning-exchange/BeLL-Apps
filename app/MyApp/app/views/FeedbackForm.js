$(function() {

    App.Views.FeedbackForm = Backbone.View.extend({

        tagName: "form",
        user_rating: 'null',
        events: {
            "click #formButton": "setForm",
            //"click #AddToShelf": "setForm",
            "submit form": "setFormFromEnterKey"
        },

        render: function() {
            var that = this;
            this.user_rating = 0;
            console.log(this.model);
            this.form = new Backbone.Form({
                model: this.model
            });
            var model = this.model;
            this.$el.append(this.form.render().el);
            this.form.fields['rating'].$el.hide();
            this.form.fields['memberId'].$el.hide();
            this.form.fields['resourceId'].$el.hide();
            this.form.fields['communityCode'].$el.hide();
            var $button = $('<a class="btn btn-success" style="margin-left:10px" id="formButton">Save</a>');
            $btnAddToShelf = $('<button class="btn btn-success" id="AddToShelf" style="margin-left:10px">Save And Add To My Library</button>');
            this.$el.append($button);
            this.$el.append($btnAddToShelf);
            //Issue#61: Update buttons Add Feedback form when rating a resource
            $btnAddToShelf.click(function() {
                that.setForm();
                if (that.user_rating > 0) {
                    AddToShelfAndSaveFeedback(model.get('resourceId'), escape(that.rtitle));
                }
            });
            //////////////////////////////////////////////////////////////////////
        },
        setFormFromEnterKey: function(event) {
            event.preventDefault();
            this.setForm();
        },
        setUserRating: function(userRating) {
            this.user_rating = userRating;
        },
        setForm: function() {
            // Put the form's input into the model in memory
            if (this.user_rating == 0) {
                alert("Please rate the resource first");
            } else {
                // Put the form's input into the model in memory
                if (this.form.getValue('comment').length == 0) {
                    this.form.setValue('comment', 'No Comment');
                }
                this.form.setValue('rating', this.user_rating);
                this.form.setValue('communityCode', App.configuration.get('code'));

                this.form.commit();
                var that = this;

                var feedbackModel = that.model;
                var member = new App.Models.Member();
                member.set('_id', $.cookie('Member._id'));
                member.fetch({
                    success: function(upModel, upRev) {
                        that.logActivity(upModel, feedbackModel);
                    }
                })
                var FeedBackDb = new PouchDB('feedback');
                FeedBackDb.post(that.model.toJSON(), function(err, info) {
                    if (!err) {
                        var Resources = new PouchDB('resources');
                        var resId = that.model.get("resourceId");
                        console.log(resId);
                        Resources.get(resId, function(err, resdoc) {
                            console.log(err);
                            console.log(resdoc);
                            if (!err) {
                                var numRating = parseInt(resdoc.timesRated);
                                numRating++;
                                var sumRating = parseInt(resdoc.sum) + parseInt(that.user_rating);
                                Resources.put({
                                        sum: sumRating,
                                        timesRated: numRating
                                    },
                                    resdoc._id, resdoc._rev,
                                    function(error, info) {
                                        console.log(error);
                                        console.log(info);
                                    })
                            } else {
                                Resources.post({
                                        _id: resId,
                                        sum: parseInt(that.user_rating),
                                        timesRated: 1
                                    },
                                    function(error, info) {
                                        console.log(error);
                                        console.log(info);
                                    }
                                )
                            }
                            console.log('Rating is successfully saved')
                            Backbone.history.navigate('resources', {
                                trigger: true
                            });
                        });
                        console.log(info);
                    } else {
                        console.log(err);
                    }
                })
                $('#externalDiv').hide();
            }
        },

        logActivity: function(member, feedbackModel) {
            var that = this;
            var logdb = new PouchDB('activitylogs');
            var currentdate = new Date();
            var logdate = this.getFormattedDate(currentdate);

            logdb.get(logdate, function(err, logModel) {
                if (!err) {
                    that.UpdatejSONlog(member, logModel, logdb, feedbackModel, logdate);
                } else {
                    that.createJsonlog(member, logdate, logdb, feedbackModel);
                }
            });
        },

        createJsonlog: function(member, logdate, logdb, feedbackModel) {
            var that = this;
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
            };
            logdb.put(docJson, logdate, function(err, response) {
                if (!err) {
                    console.log("FeedbackForm:: createJsonlog:: created activity log in pouchdb for today..");
                    logdb.get(logdate, function(err, logModel) {
                        if (!err) {
                            that.UpdatejSONlog(member, logModel, logdb, feedbackModel, logdate);
                        } else {
                            console.log("FeedbackForm:: createJsonlog:: Error fetching activitylog doc from Pouch after creating it");
                        }
                    });
                } else {
                    console.log("FeedbackForm:: createJsonlog:: error creating/pushing activity log doc in pouchdb..");
                    console.log(err);
                }
            });
        },

        UpdatejSONlog: function(member, logModel, logdb, feedbackModel, logdate) {
            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            console.log(feedbackModel);
            memRating = parseInt(feedbackModel.get('rating'));
            var resId = feedbackModel.get('resourceId');
            var index = logModel.resourcesIds.indexOf(resId);
            if (index == -1) {
                logModel.resourcesIds.push(resId);
                if (member.get('Gender') == 'Male') {
                    if (superMgrIndex == -1) {
                        logModel.male_rating.push(memRating);
                        logModel.female_rating.push(0);
                        logModel.male_timesRated.push(1);
                        logModel.female_timesRated.push(0);
                    } else {
                        logModel.male_rating.push(0);
                        logModel.female_rating.push(0);
                        logModel.male_timesRated.push(0);
                        logModel.female_timesRated.push(0);
                    }
                } else {
                    if (superMgrIndex == -1) {
                        logModel.male_rating.push(0);
                        logModel.female_rating.push(memRating);
                        logModel.male_timesRated.push(0);
                        logModel.female_timesRated.push(1);
                    } else {
                        logModel.male_rating.push(0);
                        logModel.female_rating.push(0);
                        logModel.male_timesRated.push(0);
                        logModel.female_timesRated.push(0);
                    }
                }
            } else {
                if (member.get('Gender') == 'Male') {
                    if (superMgrIndex == -1) {
                        logModel.male_rating[index] = parseInt(logModel.male_rating[index]) + memRating;
                        logModel.male_timesRated[index] = (parseInt(logModel.male_timesRated[index])) + 1;
                    }
                } else {
                    if (superMgrIndex == -1) {
                        logModel.female_rating[index] = parseInt(logModel.female_rating[index]) + memRating;
                        logModel.female_timesRated[index] = (parseInt(logModel.female_timesRated[index])) + 1;
                    }
                }
            }

            logdb.put(logModel, logdate, logModel._rev, function(err, response) {
                if (!err) {
                    console.log("FeedbackForm:: UpdatejSONlog:: updated daily log from pouchdb for today..");
                } else {
                    console.log("FeedbackForm:: UpdatejSONlog:: err making update to record");
                    console.log(err);
                }
            });
        },

        getFormattedDate: function(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        }
    })
})