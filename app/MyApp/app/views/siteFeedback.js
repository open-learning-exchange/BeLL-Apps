$(function() {

    App.Views.siteFeedback = Backbone.View.extend({

        tagName: "div",
        id: "site-feedback",
        authorName: null,

        initialize: function() {},

        events: {
            "click #formButton": "setForm",
            "click #CancelButton": "cancelform",
            "click #ViewAllButton": "gotoRoute"
        },
        gotoRoute: function() {
            Backbone.history.navigate('siteFeedback', {
                trigger: true
            })
        },
        cancelform: function() {
            $('#site-feedback').animate({
                height: 'toggle'
            })
            this.unsetForm()
        },
        setForm: function() {
            if ($('#comment').val().length != 0 && $('input[name="category"]:checked').val()) {
                var temp = Backbone.history.location.href
                var now = new Date();
                now.getDate()
                temp = temp.split('#')
                var peri = '';
                if ($("#priority").is(':checked')) {
                    peri = 'urgent'
                }
                this.model.set({
                    comment: $('#comment').val(),
                    category: $('input[name="category"]:checked').val(),
                    priority: peri,
                    PageUrl: "Personal:" + temp[1],
                    Resolved: '0',
                    memberLogin: $.cookie('Member.login'),
                    time: now.toString(),
                    communityCode: App.configuration.get('code')
                })
                this.model.save()
                alert(App.languageDict.attributes.FeedBack_Sent_success)
                this.unsetForm()
            }

            $('#site-feedback').animate({
                height: 'toggle'
            })
        },
        unsetForm: function() {
            $('#comment', this.$el).val("")
            $('input[name="category"]').attr('checked', false)
            $("#priority").attr('checked', false)
        },

        render: function() {
            this.$el.append('<br/><br/><div class="form-field" ><input name="PageUrl" id="PageUrl" type="text"></div>')
            this.$el.append('<div class="form-field" style="margin-left:23px;"><input name="priority" value="urgent" id="priority" type="checkbox"><label for="priority">'+App.languageDict.attributes.Urgent+'</label></div>')
            this.$el.append('<div class="form-field" style="margin-top: -19px;margin-left: 115px;"> <input type="radio" name="category" value="Bug">&nbsp '+App.languageDict.attributes.Bug+' &nbsp&nbsp&nbsp<input type="radio" name="category" value="Question">&nbsp '+App.languageDict.attributes.Question+' &nbsp&nbsp&nbsp<input type="radio" name="category" value="Suggestion">&nbsp '+App.languageDict.attributes.Suggestion+' &nbsp&nbsp&nbsp</div><br/><br/>')
            this.$el.append('<div class="form-field" style="margin-left:23px;"><textarea †rows="7" type="text" name="comment" placeholder="" id="comment"></textarea></div>')
            this.$el.append('<div class="form-field"><input name="Resolved" id="Resolved" type="text"></div>')
            this.$el.append('<div class="form-field"><input name="memberLogin" id="memberLogin" type="text"></div>')
            this.$el.append('<div class="form-field"><input name="time" id="time" type="text"></div>')
            $('#PageUrl', this.$el).hide()
            $('#Resolved', this.$el).hide()
            $('#memberLogin', this.$el).hide()
            $('#time', this.$el).hide()
            var $button = $('<br/><div id="f-formButton"><button class="btn btn-hg btn-danger" id="CancelButton">'+App.languageDict.attributes.Cancel+'</button><button class="btn btn-hg btn-info" id="ViewAllButton">'+App.languageDict.attributes.View+'</button><button class="btn btn-hg btn-primary" id="formButton">'+App.languageDict.attributes.Submit+'</button></div>')
            this.$el.append($button);

        }
    })
})