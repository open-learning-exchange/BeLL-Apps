$(function() {

    App.Views.NationReportCommentView = Backbone.View.extend({

        tagName: "div",
        id: "comment-feedback",
        cId: null,
        initialize: function(e) {
            this.cId = e.NationReportId
            this.model = new App.Models.NationReportComment

        },

        events: {
            'click #submitFormButton': 'submit',
            'click #cancelFormButton': 'cancel'
        },
        cancel: function() {
            $('#debug').hide()
            this.remove()
        },
        submit: function() {
            if (this.form.getValue("comment").length != 0) {
                var now = moment();
                this.form.setValue({
                    NationReportId: this.cId
                })
                this.form.setValue({
                    commentNumber: (this.collection.length + 1)
                })
                this.form.setValue({
                    memberLogin: $.cookie('Member.login')
                })
                var day=moment().format('D');
                var monthToday=App.Router.lookup(App.languageDictValue, "Months." + moment().format('MMMM'));
                var year=moment().format('YYYY');
                var time=moment().format('HH:mm:ss');
                this.form.setValue({
                    time:  day+' '+monthToday+' '+year+' '+time
                })
                this.form.commit()
                this.model.unset("commentOutput", { silent: true })
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
                App.Router.markdownEditor("comment","report","50")
                $('#report_comment').find('label').html(App.languageDictValue.get('Comment'));
            }
        },

        addOne: function(modl) {
            $('#comments').append('<div id=tile><b>'+App.languageDictValue.attributes.Login+':</b>' + modl.toJSON().memberLogin + '<br/><b>'+App.languageDictValue.attributes.Time+':</b>' + modl.toJSON().time + '<br/><b>'+App.languageDictValue.attributes.Comment+':</b><div id="markdown_comment_'+modl.toJSON()._id+'"><textarea name="'+modl.toJSON()._id+'">' + modl.toJSON().comment + '</textarea></div></div>')
            App.Router.previewModeEditor(modl.toJSON()._id,'comment')
            $("textarea[name='"+modl.toJSON()._id+"']").hide();
        },

        render: function() {
            $('#debug').show()
            this.$el.html('&nbsp;')
            $('#comments').html('&nbsp;')
            this.collection.forEach(this.addOne, this)
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            this.form.fields['NationReportId'].$el.hide()
            this.form.fields['commentNumber'].$el.hide()
            this.form.fields['memberLogin'].$el.hide()
            this.form.fields['time'].$el.hide()
            var $button = $('<div id="r-formButton"><button class="btn btn-primary" id="submitFormButton">'+App.languageDictValue.attributes.Add_Comment+'</button><button class="btn btn-info" id="cancelFormButton">'+App.languageDictValue.attributes.Close+'</button></div>')
            this.$el.append($button);
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
        }

    })

})