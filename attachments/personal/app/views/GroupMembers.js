$(function () {

    App.Views.GroupMembers = Backbone.View.extend({

        // tagName: "table",
        // className: "news-table",
        // authorName: null,
        vars: {},
        template: $('#template-sendMail-CourseMember').html(),
        initialize: function () {},
        events: {

        },
        render: function () {

            this.$el.html(_.template(this.template, this.vars))
            var courseModel = new App.Models.Group({
                _id: this.courseId
            })
            courseModel.fetch({
                async: false
            })
            var memberList = courseModel.get('members')

            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first().toJSON()
            var code = currentConfig.rows[0].doc.code

            this.$el.append('<h3 style="margin-left:5%">Course Members | ' + courseModel.get('name') + '</h3>')
            var viewtext = '<table class="table table-striped"><th>Photo</th><th>Name</th><th>Gender</th>'

            for (var i = 0; i < memberList.length; i++) {
                var mem = new App.Models.Member({
                    _id: memberList[i]
                })
                mem.fetch({
                    async: false
                })
                var mail = mem.get('login') + '.' + code + '@olebell.org'

                var src = "img/default.jpg"
                var attchmentURL = '/members/' + mem.id + '/'
                if (typeof mem.get('_attachments') !== 'undefined') {
                    attchmentURL = attchmentURL + _.keys(mem.get('_attachments'))[0]
                    src = attchmentURL
                }



                console.log(src)

                viewtext += '<tr><td><img width="45px" height="45px" src="' + src + '"/></td><td>' + mem.get('firstName') + ' ' + mem.get('lastName') + '</td><td>' + mem.get('Gender') + '</td><td><input type="checkbox" name="checkedMember" value="' + mail + '">Send mail</td></tr>'

            }
            viewtext += '<tr><td></td><td></td><td></td><td><button class="btn" onclick=showComposePopupMultiple("' + mail + '") id="sendMailButton">Send Mail</button></td></tr>'
            viewtext += '</table>'
            this.$el.append(viewtext)

        }

    })

})