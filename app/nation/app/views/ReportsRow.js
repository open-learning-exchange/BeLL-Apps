$(function() {

    App.Views.ReportsRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function(event) {
                var loginOfMem = $.cookie('Member.login');
                var lang;
                $.ajax({
                    url: '/members/_design/bell/_view/MembersByLogin?_include_docs=true&key="' + loginOfMem + '"',
                    type: 'GET',
                    dataType: 'jsonp',
                    async:false,
                    success: function (surResult) {
                        console.log(surResult);
                        var id = surResult.rows[0].id;
                        $.ajax({
                            url: '/members/_design/bell/_view/MembersById?_include_docs=true&key="' + id + '"',
                            type: 'GET',
                            dataType: 'jsonp',
                            async:false,
                            success: function (resultByDoc) {
                                console.log(resultByDoc);
                                lang=resultByDoc.rows[0].value.bellLanguage;
                            },
                            error:function(err){
                                console.log(err);
                            }
                        });
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
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
                console.log(e)
                console.log(e.target.attributes[0].nodeValue)
                var coll = new App.Collections.NationReportComments()
                coll.NationReportId = e.target.attributes[0].nodeValue
                coll.fetch({
                    async: false
                })
                console.log(coll.toJSON())
                var viw = new App.Views.NationReportCommentView({
                    collection: coll,
                    NationReportId: e.target.attributes[0].nodeValue
                })
                viw.render()
                $('#debug').append(viw.el)
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
            var lang;
            $.ajax({
                url: '/members/_design/bell/_view/MembersByLogin?_include_docs=true&key="' + loginOfMem + '"',
                type: 'GET',
                dataType: 'jsonp',
                async:false,
                success: function (surResult) {
                    console.log(surResult);
                    var id = surResult.rows[0].id;
                    $.ajax({
                        url: '/members/_design/bell/_view/MembersById?_include_docs=true&key="' + id + '"',
                        type: 'GET',
                        dataType: 'jsonp',
                        async:false,
                        success: function (resultByDoc) {
                            console.log(resultByDoc);
                            lang=resultByDoc.rows[0].value.bellLanguage;
                        },
                        error:function(err){
                            console.log(err);
                        }
                    });
                },
                error:function(err){
                    console.log(err);
                }
            });
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