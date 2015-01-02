$(function () {

    App.Views.siteFeedback = Backbone.View.extend({

        tagName: "div",
        id: "site-feedback",
        authorName: null,

        initialize: function () {

        },

        events: {
            "click #formButton": "setForm",
            "click #CancelButton": "cancelform",
            "click #ViewAllButton": "gotoRoute"
        },
        gotoRoute: function () {
            var temp = Backbone.history.location.href
            temp = temp.split('#')
            var temp2 = temp[1].split('/')
            var ul = "LMS:" + temp2[0]
            for (var i = 1; i < temp2.length; i++) {
                if (temp2[i].length != 32) {
                    ul = ul + "/" + temp2[i]
                } else {
                    i = temp.length
                }
            }
            url = ul
            Backbone.history.navigate('siteFeedback', {
                trigger: true
            })
        },
        cancelform: function () {
            $('#site-feedback').animate({
                height: 'toggle'
            })
            this.unsetForm()
        },
        setForm: function () {
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
                    PageUrl: "Nation:" + temp[1],
                    Resolved: '0',
                    memberLogin: $.cookie('Member.login'),
                    time: now.toString()
                })
                this.model.save()
                alert("Feedback Successfully Sent")
                this.unsetForm()
            }
            $('#site-feedback').animate({
                height: 'toggle'
            })
        },
        unsetForm:function(){
            $('#comment', this.$el).val("")
            $('input[name="category"]').attr('checked',false)
            $("#priority").attr('checked', false)
        },
        render: function () {
            this.$el.append('<br/><br/><div class="form-field" ><input name="PageUrl" id="PageUrl" type="text"></div>')
            this.$el.append('<div class="form-field" style="margin-left:23px;"><input name="priority" value="urgent" id="priority" type="checkbox"><label for="priority">urgent</label></div>')
            this.$el.append('<div class="form-field" style="margin-top: -28px;margin-left: 115px;"> <input type="radio" name="category" value="Bug">&nbsp Bug &nbsp&nbsp&nbsp<input type="radio" name="category" value="Question">&nbsp Question &nbsp&nbsp&nbsp<input type="radio" name="category" value="Suggestion">&nbsp Suggestion &nbsp&nbsp&nbsp</div><br/><br/>')
            this.$el.append('<div class="form-field" style="margin-left:23px;"><textarea �rows="7" type="text" name="comment" id="comment"></textarea></div>')
            this.$el.append('<div class="form-field"><input name="Resolved" id="Resolved" type="text"></div>')
            this.$el.append('<div class="form-field"><input name="memberLogin" id="memberLogin" type="text"></div>')
            this.$el.append('<div class="form-field"><input name="time" id="time" type="text"></div>')
            $('#PageUrl', this.$el).hide()
            $('#Resolved', this.$el).hide()
            $('#memberLogin', this.$el).hide()
            $('#time', this.$el).hide()
            var $button = $('<br/><div id="f-formButton"><button class="btn btn-hg btn-danger" id="CancelButton">Cancel</button><button class="btn btn-hg btn-info" id="ViewAllButton">View</button><button class="btn btn-hg btn-primary" id="formButton">Submit</button></div>')
            this.$el.append($button)
        }
    })
})