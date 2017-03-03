$(function() {

    App.Views.VipLinksView = Backbone.View.extend({

        template: $('#template-viplink').html(),
        vars:{},
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
