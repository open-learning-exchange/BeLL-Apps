$(function() {
     var levelID = 0;
    App.Views.SearchSpans = Backbone.View.extend({

        template: $("#template-Search-boxes").html(),
        vars: {},
        events: {
            "click #selectAllButton": function() {
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
            },
            "click #addIndividualResource": function(e){
                if(e.currentTarget.value != ""){
                    this.AddResources()
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
        },

        AddResources: function(){
            var cstep = new App.Models.CourseStep({
                "_id": levelID
            })
            cstep.fetch({
                async: false,
                success: function(response){
                }
            })
            var oldIds = cstep.get("resourceId")
            var oldTitles = cstep.get("resourceTitles")
            $("input[name='result']").each(function() {
                if ($(this).is(":checked") == true) {
                    var rId = $(this).val();
                    if (oldIds.indexOf(rId) == -1) {
                        rtitle.push($(this).attr('rTitle'))
                        rids.push(rId)
                    }
                }
            });
            if(rids != "" && rtitle != ""){
                cstep.set("resourceId", oldIds.concat(rids))
                cstep.set("resourceTitles", oldTitles.concat(rtitle))
                cstep.save(null, {
                    success: function(responseModel, responseRev) {
                        cstep.set("_rev", responseRev.rev)
                        alert(App.languageDict.attributes.Resource_Updated)
                        Backbone.history.navigate('level/view/' + responseRev.id + '/' + responseRev.rev, {
                            trigger: true
                        })
                        $("#cont").css('opacity', "")
                        $("#nav").css('opacity', "")
                        $("#invitationdiv").hide()
                    }
                })
                rids = []
                rtitle = []
            } else {
                alert(App.languageDict.attributes.Prompt_Reource_first)
            }
        },

    })

})
