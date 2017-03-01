$(function() {

    App.Views.VipLinksView = Backbone.View.extend({
        template: $('#template-viplink').html(),
        vars:{},

        events: {
            "click button.copy": function(e) {
                var a = $(e.target).parents('tr').find('a.copy').attr('href')
                $('#copyInput').val(a);
                $('#copyInput').select();
                document.execCommand('copy');
                $('#copyInput').blur();
                $('#copyInput').val('');
                alert(App.languageDictValue.attributes.Link_Coppied);
            },
            "click button.delete": function(e) {
                var a = $(e.target).attr('data-id')
                alert(a)
                var selectedModel = this.collection.at(a)
                var model = new App.Models.VipLink()
                model.id = selectedModel.get('data-id')
                model.fetch({
                    async: false
                })
                model.destroy()
                alert('delete');
            }
        },

        initialize: function() {
        },
        render: function() {
       	    this.vars.vips = [];
            this.vars.languageDict = App.languageDictValue;
            for(var i=0;i<this.collection.length;i++) {
            	if((this.collection.models[i].attributes.name != '' && this.collection.models[i].attributes.name != undefined && this.collection.models[i].attributes.name != null) ||
            	(this.collection.models[i].attributes.url != '' && this.collection.models[i].attributes.url != undefined && this.collection.models[i].attributes.url != null))
                    this.vars.vips.push(this.collection.models[i].attributes);
            }
            this.$el.html(_.template(this.template,this.vars))
        }
    })
})
