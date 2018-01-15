$(function() {

    App.Views.ReportsRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function(event) {
                var loginOfMem = $.cookie('Member.login');
                var lang = App.Router.getLanguage(loginOfMem);
                var languageDictValue=App.Router.loadLanguageDocs(lang);
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
                var coll = new App.Collections.NationReportComments()
                coll.NationReportId = e.target.attributes[0].nodeValue
                coll.fetch({
                    async: false
                })
                var viw = new App.Views.NationReportCommentView({
                    collection: coll,
                    NationReportId: e.target.attributes[0].nodeValue
                })
                viw.render()
                $('#debug').append(viw.el);
                App.Router.markdownEditor("comment","report","50")
                $('#report_comment').find('label').html(App.languageDictValue.get('Comment'));
                $('#comment-feedback .bbf-form .field-comment label').html(App.languageDictValue.get('Comment'));
                if(App.languageDictValue.get('directionOfLang').toLowerCase()==="right")
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
            //vars.avgRating = Math.round(parseFloat(vars.averageRating))
            var vars = this.model.toJSON()

            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            if (vars.views == undefined) {
                vars.views = 0
            }

            vars.isManager = this.isManager
            var date = new Date(vars.Date)
            vars.Date = date.toUTCString()
            vars.languageDict=App.languageDictValue;
            this.$el.append(this.template(vars))

        }


    })

})