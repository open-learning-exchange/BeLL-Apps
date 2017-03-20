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
                alert(App.languageDictValue.attributes.Link_Copied);
            },
            "click button.destroy": function(e) {
                var a = $(e.target).attr('data-id')
                var vpmodel = new App.Models.VipLink({
                    _id: a
                }) 
                vpmodel.fetch({
                        async: false
                })
                vpmodel.destroy()
                alert(App.languageDictValue.attributes.viplink_delete);
                $(e.target).parents('tr').remove();
                location.reload('#viplink')
            },
            "click button.create": function(){
                var value = $('#domain-name').val()
                if(value == ""){
                    alert(App.languageDictValue.attributes.fill_all_fields);
                    return false;
                } else {
                    var nationUrl = $.url().data.attr.authority;
                    var create = new App.Models.VipLink()
                    create.set('name', value)
                    create.set('url', 'http://'+nationUrl+'/apps/_design/bell/nation/index.html#listCommunityPage')
                    create.set('visits', 0)
                    create.save();
                    alert(App.languageDictValue.attributes.link_created);
                    location.reload('#viplink')
                    return true;
                }
            },
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