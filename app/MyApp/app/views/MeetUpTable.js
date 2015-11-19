$(function() {
    App.Views.MeetUpTable = Backbone.View.extend({

        tagName: "table",

        className: "btable btable-striped",
        roles: null,
        addOne: function(model) {
            var meetupRow = new App.Views.MeetUpRow({
                model: model,
                roles: this.roles
            })
            meetupRow.render()
            this.$el.append(meetupRow.el)
        },
        events: {
            "click .pageNumber": function(e) {
                this.collection.startkey = ""
                this.collection.skip = e.currentTarget.attributes[0].value
                this.collection.fetch({
                    async: false
                })
                if (this.collection.length > 0) {
                    this.render()
                }
            }


        },
        changeDirection : function (){
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var con = config.first();
            var currentConfig = config.first().toJSON().rows[0].doc;
            var clanguage= currentConfig.currentLanguage;
            if (clanguage=="Urdu" || clanguage=="Arabic")
            {
                var library_page = $.url().data.attr.fragment;
                if(library_page=="meetups")
                {
                    //    alert("Hello")
                    $('#parentLibrary').addClass('addResource');
                }

                // $('.table-striped').css({direction:rtl});
            }
            else
            {
                $('#parentLibrary').removeClass('addResource');
            }
        },
        addAll: function() {
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var con = config.first();
            var currentConfig = config.first().toJSON().rows[0].doc;
            var clanguage= currentConfig.currentLanguage;
            var languages = new App.Collections.Languages();
            languages.fetch({
                async: false
            });
            var languageDict;
            for(var i=0;i<languages.length;i++)
            {
                if(languages.models[i].attributes.hasOwnProperty("nameOfLanguage"))
                {
                    if(languages.models[i].attributes.nameOfLanguage==clanguage)
                    {
                        languageDict=languages.models[i];
                    }
                }
            }
            App.languageDict = languageDict;

            this.$el.html("<tr><th>"+languageDict.attributes.Topic+"</th><th colspan='4'>"+languageDict.attributes.action+"</th></tr>")
            var manager = new App.Models.Member({
                _id: $.cookie('Member._id')
            })
            manager.fetch({
                async: false
            })
            this.roles = manager.get("roles")
            // @todo this does not work as expected, either of the lines
            // _.each(this.collection.models, this.addOne())
            this.collection.each(this.addOne, this)
            var groupLength;
            var context = this
            $.ajax({
                url: '/meetups/_design/bell/_view/count?group=false',
                type: 'GET',
                dataType: "json",
                success: function(json) {
                    meetupLength = json.rows[0].value
                    if (context.displayCollec_Resources != true) {
                        var pageBottom = "<tr><td colspan=7>"
                        var looplength = meetupLength / 20

                        for (var i = 0; i < looplength; i++) {
                            if (i == 0)
                                pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">'+languageDict.attributes.Home+'</a>&nbsp&nbsp'
                            else
                                pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">' + i + '</a>&nbsp&nbsp'
                        }
                        pageBottom += "</td></tr>"
                        context.$el.append(pageBottom)
                    }

                }
            })
        },

        render: function() {
            var clanguage
                = App.configuration.get("currentLanguage");
            if(clanguage=="Urdu" || clanguage=="Arabic")
            {
                $('link[rel=stylesheet][href~="app/Home.css"]').attr('disabled', 'false');
                $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').removeAttr('disabled');
            }
            else
            {
                $('link[rel=stylesheet][href~="app/Home.css"]').removeAttr('disabled');
                $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').attr('disabled', 'false');

            }
            this.addAll()
        }

    })

})