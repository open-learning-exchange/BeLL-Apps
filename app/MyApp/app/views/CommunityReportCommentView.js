$(function () {

    App.Views.CommunityReportCommentView = Backbone.View.extend({

        tagName: "div",
        id: "comment-feedback",
        cId: null,
        initialize: function (e) {
            this.cId = e.CommunityReportId
            this.model = new App.Models.CommunityReportComment

        },

        events: {
            'click #submitFormButton': 'submit',
            'click #cancelFormButton': 'cancel'
        },
        cancel: function () {
            $('#debug').hide()
            this.remove()
        },
        submit: function () {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            var languageDictValue = languageDictValue;
            if (this.form.getValue("comment").length != 0) {
                var now = moment();
                //now.getDate();
                this.form.setValue({
                    CommunityReportId: this.cId
                })
                this.form.setValue({
                    commentNumber: (this.collection.length + 1)
                })
                this.form.setValue({
                    memberLogin: $.cookie('Member.login')
                })
                var day=moment().format('D');
                var monthToday=lookup(languageDictValue, "Months." + moment().format('MMMM'));
                var year=moment().format('YYYY');
                var time=moment().format('HH:mm:ss');
                this.form.setValue({
                    time:  day+' '+monthToday+' '+year+' '+time
                    //(new Date()).toString().split(' ').splice(1,4).join(' ')
                        //now.toLocaleString()
                })
                this.form.commit()
                this.model.save()
                this.form.setValue({
                    comment: ""
                })
                this.collection.fetch({
                    async: false
                })
                this.model.set({
                    "comment": ""
                })
                this.render()
            }
        },

        addOne: function (modl) {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            $('#comments').append('<div id=tile><b>'+languageDictValue.attributes.Login+':</b>' + modl.toJSON().memberLogin + '<br/><b>'+languageDictValue.attributes.Time+':</b>' + modl.toJSON().time + '<br/><b>'+languageDictValue.attributes.Comment+':</b>' + modl.toJSON().comment + '</div>')
        },

        render: function () {
            var languageDictValue;
            var clanguage = '';
            clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            $('#debug').show()
            this.$el.html('&nbsp;')
            $('#comments').html('&nbsp;')
            this.collection.forEach(this.addOne, this)
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            this.form.fields['CommunityReportId'].$el.hide()
            this.form.fields['commentNumber'].$el.hide()
            this.form.fields['memberLogin'].$el.hide()
            this.form.fields['time'].$el.hide()
            var $button = $('<div id="r-formButton"><button class="btn btn-primary" id="submitFormButton">'+languageDictValue.attributes.Add_Comment+'</button><button class="btn btn-info" id="cancelFormButton">'+languageDictValue.attributes.Close+'</button></div>')
            this.$el.append($button);
            applyCorrectStylingSheet(directionOfLang);

            // $("#comments").animate({ scrollTop: $('#comments')[0].scrollHeight}, 3000);
        }

    })

})