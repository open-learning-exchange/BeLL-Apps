$(function() {

    App.Views.ReportsRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function(event) {
                var members = new App.Collections.Members()
                var member;
                var languageDictValue;
                members.login = $.cookie('Member.login');
                var clanguage = '';
                members.fetch({
                    success: function () {
                        if (members.length > 0) {
                            member = members.first();
                            clanguage = member.get('bellLanguage');
                            languageDictValue = getSpecificLanguage(clanguage);
                        }
                    },
                    async:false
                });
                if (confirm(languageDictValue.attributes.Confirm_Report)) {
                this.model.destroy()
                event.preventDefault();
                alert(languageDictValue.attributes.Reports_Deleted_Success);
                }
            },
            "click #open": function(event) {
                if (this.model.get("views") == undefined) {
                    this.model.set('views', 1)
                    this.model.save()
                } else {
                    this.model.set('views', this.model.get("views") + 1)
                    this.model.save()
                }

            },
            "click #commentButton": function(e) {
                var members = new App.Collections.Members()
                var member;
                var languageDictValue;
                members.login = $.cookie('Member.login');
                var clanguage = '';
                members.fetch({
                    success: function () {
                        if (members.length > 0) {
                            member = members.first();
                            clanguage = member.get('bellLanguage');
                            languageDictValue = getSpecificLanguage(clanguage);
                        }
                    },
                    async:false
                });
                App.languageDict = languageDictValue;
                var directionOfLang = App.languageDict.get('directionOfLang');
                var languageDictValue=languageDictValue;
                var coll = new App.Collections.CommunityReportComments()
                coll.CommunityReportId = e.target.attributes[0].nodeValue
                coll.fetch({
                    async: false
                })
                var viw = new App.Views.CommunityReportCommentView({
                    collection: coll,
                    CommunityReportId: e.target.attributes[0].nodeValue
                })
                viw.render();
                $('#debug').append(viw.el);
                $('#comment-feedback .bbf-form .field-comment label').html(App.languageDict.get('Comment'));

                if(languageDictValue.get('directionOfLang').toLowerCase()==="right")
                {
                    $('#comments').css('direction','rtl')
                    $('#comment-feedback').css('direction','rtl')
                    $('#r-formButton #submitFormButton').addClass('marginsOnMeetUp')
                    $('#r-formButton #cancelFormButton').addClass('marginsOnMeetUp')
                }
                else
                {
                    $('#comments').css('direction','ltr')
                    $('#comment-feedback').css('direction','ltr')
                    $('#r-formButton #submitFormButton').removeClass('marginsOnMeetUp');
                    $('#r-formButton #cancelFormButton').removeClass('marginsOnMeetUp')
                }
            }

        },

        vars: {},

        template: _.template($("#template-ReportRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            var members = new App.Collections.Members()
            var member;
            var languageDictValue;
            members.login = $.cookie('Member.login');
            var clanguage = '';
            members.fetch({
                success: function () {
                    if (members.length > 0) {
                        member = members.first();
                        clanguage = member.get('bellLanguage');
                        languageDictValue = getSpecificLanguage(clanguage);
                    }
                },
                async:false
            });
            App.languageDict = languageDictValue;
            //vars.avgRating = Math.round(parseFloat(vars.averageRating))
            var vars = this.model.toJSON()
            vars.languageDict=App.languageDict;
            if (vars.views == undefined) {
                vars.views = 0
            }

            vars.isManager = this.isManager
            var date = new Date(vars.Date)
            vars.Date = date.toUTCString()

            this.$el.append(this.template(vars))


        }


    })

})