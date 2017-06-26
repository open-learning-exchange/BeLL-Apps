$(function() {
     var levelID = 0;
    App.Views.SearchSpans = Backbone.View.extend({

        template: $("#template-Search-boxes").html(),
        vars: {},
        events: {
            "click #selectAllButton": function(e) {
                var isChecked = $('#selectAllButton').prop('checked');
                if(isChecked){
                     $("input[name='result']").each(function() {
                        $(this).prop('checked', true);
                    })
                }else{
                    $("input[name='result']").each(function() {
                        $(this).prop('checked', false);
                    })
                }
            }
        },
        addOne: function(model) {
            if (this.resourceids) {
                if ($.inArray(model.get("id"), this.resourceids) == -1) {
                    this.renderView(model)
                }
            } else {
                this.renderView(model)
            }
        },
        renderView: function(model) {
            var modelView = new App.Views.SearchSpan({
                model: model
            })
            modelView.render()
            this.$el.append(modelView.el)
            //$('#srch').append(modelView.el)
        },
        addAll: function() {
            console.log(this.collection);
            var data = [];
            if(this.collection.length > 0 ){
                for(var i = 0 ;i < this.collection.length; i++){
                    data.push(this.collection.models[i]);
                }
                this.vars.data = data;
                this.$el.append(_.template(this.template,this.vars))
            }
        },

        render: function() {
            levelID = this.attributes.LevelID;
            this.addAll()
        }

    })

})