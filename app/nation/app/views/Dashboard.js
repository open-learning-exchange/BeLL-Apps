$(function() {

    App.Views.Dashboard = Backbone.View.extend({

        template: $('#template-Dashboard').html(),

        vars: {},
        render: function() {

            var config = new App.Collections.Configurations()
            config.fetch({
                async: false
            })
            var configuration = config.first()

            var dashboard = this
            this.vars.imgURL = "img/header_slice.png"
            var a = new App.Collections.MailUnopened({
                receiverId: $.cookie('Member._id')
            })
            a.fetch({
                async: false
            })
            this.vars.type = configuration.get("type")
            this.vars.mails = a.length

            this.$el.html(_.template(this.template, this.vars))
            $('.now').html(moment().format('dddd | DD MMMM, YYYY'))
            // Member Name
            var member = new App.Models.Member()
            member.id = $.cookie('Member._id')

            member.on('sync', function() {
                var attchmentURL = '/members/' + member.id + '/'
                if (typeof member.get('_attachments') !== 'undefined') {
                    attchmentURL = attchmentURL + _.keys(member.get('_attachments'))[0]
                    document.getElementById("imgurl").src = attchmentURL
                }
              //////////////////////////////////////////Code Changes for Issue No.73///////////////////////////////////
                var configuration;
                var config = new App.Collections.Configurations()
                config.fetch({
                    async: false,
                    success: function(){
                        configuration = config.first().attributes.name;
                    }
                })
                configuration=configuration.charAt(0).toUpperCase() + configuration.slice(1);
                var typeofBell=config.first().attributes.type;
                if (typeofBell === "nation") {
                    configuration = configuration + " Nation Bell"
                } else {
                    configuration = configuration + " Community Bell"
                }
                $('.bellLocation').html(configuration);
             
                //////////////////////////////////////////////////////////////////////////////////////////////////////
              /*  var temp = $.url().data.attr.host.split(".")
                temp = temp[0];
                if (temp.substring(0,3) == "127") {
                    temp = "local"
                }
                temp = temp.charAt(0).toUpperCase() + temp.slice(1) + " Nation Bell"*/
               // $('.bellLocation').html(bell_Name);
                if (!member.get('visits')) {
                    member.set('visits', 1)
                    member.save()
                }
                if (parseInt(member.get('visits')) == 0) {
                    temp = "Error!!"
                } else {
                    temp = member.get('visits') + " visits"
                }
                var roles = "&nbsp;-&nbsp;"
                var temp1 = 0
                if (member.get("roles").indexOf("Learner") != -1) {
                    roles = roles + "Learner"
                    temp1 = 1
                }
                if (member.get("roles").indexOf("Leader") != -1) {
                    if (temp1 == 1) {
                        roles = roles + ",&nbsp;"
                    }
                    roles = roles + "Leader"
                    temp1 = 1
                }
                if (member.get("roles").indexOf("Manager") != -1) {
                    if (temp1 == 1) {
                        roles = roles + ",&nbsp;"
                    }
                    roles = roles + "Manager"
                }
                $('.visits').html(temp)
                $('.name').html(member.get('firstName') + ' ' + member.get('lastName') + '<span style="font-size:15px;">' + roles + '</span>' + '&nbsp;<a href="../MyApp/index.html#member/edit/' + $.cookie('Member._id') + '"><i class="fui-gear"></i></a>')
            })
            member.fetch()

        }

    })

})