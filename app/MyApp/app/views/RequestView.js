$(function() {

    App.Views.RequestView = Backbone.View.extend({

        tagName: "div",
        id: "site-request",
        type: null,
        events: {
            "click #formButton": "setForm",
            "click #CancelButton": "cancelform",
            "click #ViewAllButton": "gotoRoute"
        },
        gotoRoute: function() {
            document.getElementById('nav').style.visibility = "visible"
            Backbone.history.navigate('AllRequests', {
                trigger: true
            })
        },
        cancelform: function() {
            $('#site-request').animate({
                height: 'toggle'
            })
            this.form.setValue({
                request: ""
            })
            var that = this
            setTimeout(function() {
                that.remove()
            }, 1000)
            document.getElementById('nav').style.visibility = "visible"
        },
        setForm: function() {
            var configurations = Backbone.Collection.extend({

                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first()
            var cofigINJSON = currentConfig.toJSON()
            var date1 = new Date()
            console.log(date1)
            var datestring = ("0" + (date1.getMonth() + 1).toString()).substr(-2) + "/" + ("0" + date1.getDate().toString()).substr(-2) + "/" + (date1.getFullYear().toString()).substr(2)
            if (this.form.getValue("request").length != 0) {
                this.form.setValue({
                    status: '0'
                })
                this.form.setValue({
                    senderId: ($.cookie('Member._id'))
                })
                this.form.setValue({
                    date: datestring
                })
                this.form.setValue({
                    sendFrom: cofigINJSON.rows[0].doc.type
                })
                this.form.setValue({
                    sendFromName: cofigINJSON.rows[0].doc.name
                })
                this.form.setValue({
                    response: ""
                })
                this.form.setValue({
                    type: this.type
                })
                this.form.commit()
                this.model.save()
                console.log(this.model.toJSON())
                alert(App.languageDict.attributes.Request_Sent_Success)
                this.form.setValue({
                    request: ""
                })
            }
            $('#site-request').animate({
                height: 'toggle'
            })
            var that = this
            setTimeout(function() {
                that.remove()
            }, 1000)
            document.getElementById('nav').style.visibility = "visible"
        },

        render: function() {
            document.getElementById('nav').style.visibility = "hidden"
            var modl = new App.Models.request()
            this.model = modl
            this.form = new Backbone.Form({
                model: modl
            })
            if (this.type == "Course") {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">'+App.languageDict.attributes.Request_Course_Title+'</span>')
            } else if (this.type == "Resource") {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">'+App.languageDict.attributes.Request_Resource_Title+'</span>')
            } else if (this.type == "Meetup") {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">'+App.languageDict.attributes.Request_Meetup_Title+'</span>')
            } else {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">'+App.languageDict.attributes.Error+'</span>')
            }
            this.$el.append(this.form.render().el)
            this.form.fields['senderId'].$el.hide()
            this.form.fields['status'].$el.hide()
            this.form.fields['response'].$el.hide()
            this.form.fields['type'].$el.hide()
            this.form.fields['sendFrom'].$el.hide()
            this.form.fields['sendFromName'].$el.hide()
            this.form.fields['date'].$el.hide()
            var $button = $('<br/><div id="f-formButton"><button class="btn btn-hg btn-danger" id="CancelButton">'+App.languageDict.attributes.Cancel+'</button><button class="btn btn-hg btn-info" id="ViewAllButton">'+App.languageDict.attributes.View_All+'</button><button class="btn btn-hg btn-primary" id="formButton">'+App.languageDict.attributes.Submit+'</button></div>')
            this.$el.append($button);

        }


    })
})