$(function () {

    App.Views.Configurations = Backbone.View.extend({
    
        initialize: function () {
            this.$el.html('<h3>Set Configurations<h3>')
        },
        events: {
            "click #formButton": "setForm"
        },

        render: function () {
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el);
            this.$el.append('<a style="margin-left:2px" class="btn btn-success" id="formButton">Submit Configurations </a>');
        },
        setForm:function(){
            this.form.commit();
            if (this.form.validate() != null) {
                return
            }
            var Config=this.form.model;
            var config = new App.Collections.Configurations();
            config.fetch({async:false});
            var con=config.first();
            con.set('name',Config.get('name'));
            con.set('nationName',Config.get('nationName'));
            con.set('nationUrl',Config.get('nationUrl'));
            con.set('code',Config.get('code'));
            con.set('type',Config.get('type'));
            con.set('notes',Config.get('notes'));
            con.set('region', Config.get('region'));
            con.set('version', Config.get('version'));
            con.save(null,{ success: function(doc,rev){

                App.configuration = con;

                // Get Current Date
                var currentdate = new Date();
                var year = currentdate.getFullYear();
                var month = (1 + currentdate.getMonth()).toString();
                month = month.length > 1 ? month : '0' + month;
                var day = currentdate.getDate().toString();
                day = day.length > 1 ? day : '0' + day;
                var logcurrentdate = year + '/' + month + '/' + day;

                $.ajax({
                    type: 'GET',
                    url: '/activitylog/_design/bell/_view/getDocumentByDate?key="'+ logcurrentdate +'"',
                    dataType: 'json',
                    success: function (response) {
                        var logModel = response.rows[0].value;
                        logModel.community = App.configuration.get("code");

                        //Now Posting the Updated Activitylog Model
                        $.ajax({
                            type: 'PUT',
                            url: '/activitylog/'+ logModel._id +'/?rev=' + logModel._rev,
                            data: JSON.stringify(logModel),
                            async: false,
                            dataType: 'json',
                            success: function (response) {
                                console.log(response);
                            }
                        });
                    }
                });

                alert('Configurations are Successfully Added');
                Backbone.history.navigate('dashboard', {trigger: true});
            }});
        }

    })

})