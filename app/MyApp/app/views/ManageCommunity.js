$(function() {

    App.Views.ManageCommunity = Backbone.View.extend({

        events: {
            "click .SyncDbSelect": 'SyncDbSelect',
            //"click #configuration": 'Configuration',
            "click .back": function(e) {
                alert(App.languageDict.attributes.Back)
            }

        },
        initialize: function() {
            this.$el.append('<th colspan="2"><h6>Meetup Detail</h6></th>')

        },

        processJsonp: function() {
        },
        render: function() {

            // here we willn check the any new updated 
            this.$el.html('')
            nName = App.configuration.get('nationName')
            pass = App.password
            nUrl = App.configuration.get('nationUrl')
            currentBellName = App.configuration.get('name')
            var htmlreferance = this.$el

            this.$el.append('<div style="padding: 20px 20px 0px 20px; float: left;"> <a id="configuration" href="#configurationsForm"><button class="btn btn-primary" id="configbutton">' + App.languageDict.get('Configurations') + '</button></a> </div>')
            this.$el.append('<div style="padding: 20px 20px 0px 0px; float: left;"> <button id="sync" class="SyncDbSelect btn btn-primary">' + App.languageDict.get('Sync_With_Nation') + '</button>  </div>')
            this.$el.append('<div style="padding: 20px 20px 0px 0px; float: left;"> <a id="publication" class="btn btn-primary" href="#publications/for-' + App.configuration.get('name') + '">' + App.languageDict.get('Publications') + '</a>  </div>')
            this.$el.append('<div style="padding: 20px 20px 0px 0px; float: left;"> <a id="survey" class="btn btn-primary" href="#surveys/for-' + App.configuration.get('name') + '">' + App.languageDict.get('Surveys') + '</a>  </div>')
            // /****************************************************************************************************************************************************
            //   this.$el.append('<div style="padding: 20px 20px 0px 0px; float: left;"> <button class="SyncMembersDb btn btn-primary" id="syncmembers">Sync Members Db With Nation</button>  </div>')
            //  ****************************************************************************************************************************************************/
            var directionOfLang = App.languageDict.get('directionOfLang');
            if(directionOfLang.toLowerCase()==="right") {
                this.$el.find('#configuration').parent().css({"float":"right", "padding":"20px 20px 0px 20px"});
                this.$el.find('#sync').parent().css({"float":"right", "padding":"20px 0px 0px 20px"});
                this.$el.find('#publication').parent().css({"float":"right", "padding":"20px 0px 0px 20px"});
                this.$el.find('#survey').parent().css({"float":"right", "padding":"20px 0px 0px 20px"});
            }
            else
            {
                this.$el.find('#configuration').parent().css({"float":"left", "padding":"20px 20px 0px 20px"});
                this.$el.find('#sync').parent().css({"float":"left", "padding":"20px 20px 0px 0px"});
                this.$el.find('#publication').parent().css({"float":"left", "padding":"20px 20px 0px 0px"});
                this.$el.find('#survey').parent().css({"float":"left", "padding":"20px 20px 0px 0px"});
            }
            applyCorrectStylingSheet(directionOfLang);
        },

        syncDbs: function(e) {
        },
        SyncDbSelect: function() {
            $('#invitationdiv').fadeIn(1000)
            var inviteForm = new App.Views.listSyncDbView()

            inviteForm.render()
            $('#invitationdiv').html('&nbsp')
            $('#invitationdiv').append(inviteForm.el)
        },
        Configuration: function() {
            var configCollection = new App.Collections.Configurations();
            configCollection.fetch({
                async: false
            });
            var configModel = configCollection.first();
            var configForm = new App.Views.Configurations({
                model: configModel
            })
            configForm.render();

            this.$el.html(configForm.el);
            if(App.languageDict.get('directionOfLang').toLowerCase()==="right"){
                $('#configTable div div h3').css('margin-right','0%');
            }
        }

    })

})