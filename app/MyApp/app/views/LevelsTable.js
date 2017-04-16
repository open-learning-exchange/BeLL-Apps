$(function() {
    App.Views.LevelsTable = Backbone.View.extend({

        tagName: "table",

        changedSteps: null,

        className: "btable btable-striped",

        events: {
            "click #Rearrange": function(e) {
                if ($("input[type = 'radio']").is(":visible")) {
                    $("#Rearrange").text(App.languageDict.attributes.Rearrange);
                    for (var i = 0; i < this.changedSteps.length; i++) {
                        this.collection.models[this.changedSteps[i]].save()
                    }
                    this.changedSteps.remove
                    $("input[type = 'radio']").hide()
                    $("#moveup").hide()
                    $("#movedown").hide()
                } else {
                    $("#Rearrange").text(App.languageDict.attributes.Save);
                    $("input[type='radio']").show()
                    $("#moveup").show()
                    $("#movedown").show()
                }
            },

            "click #moveup": function(e) {
                var radio;
                var i = 0;
                var radioLevels = document.getElementsByName('stepRow');
                for (var j = 0; j < radioLevels.length; j++) {
                    if (radioLevels[j].checked) {
                        radio = radioLevels[j].parentNode.parentNode;
                        if (j > 0) {
                            this.collection.models[j].set('step', j)
                            this.collection.models[j - 1].set('step', j + 1)
                            this.changeColumnHtml(this.collection.models[j].get('step'), this.collection.models[j].get('title'), radioLevels[j].parentNode, true)
                            this.changeColumnHtml(this.collection.models[j - 1].get('step'), this.collection.models[j - 1].get('title'), radioLevels[j - 1].parentNode, false)
                            var tempModel = this.collection.models[j]
                            this.collection.models[j] = this.collection.models[j - 1]
                            this.collection.models[j - 1] = tempModel
                            if (this.changedSteps.indexOf(j) == -1) {
                                this.changedSteps.push(j)
                            }
                            if (this.changedSteps.indexOf(j - 1) == -1) {
                                this.changedSteps.push(j - 1)
                            }
                        }
                        break;
                    }
                }

                var prev = radio.previousSibling;
                var par = radio.parentNode;
                if (prev) {
                    par.removeChild(radio);
                    par.insertBefore(radio, prev);
                }
            },

            "click #movedown": function(e) {
                var radio;
                var i = 0;
                var radioLevels = document.getElementsByName('stepRow');
                for (var j = 0; j < radioLevels.length; j++) {
                    if (radioLevels[j].checked) {
                        radio = radioLevels[j].parentNode.parentNode;
                        if (j < radioLevels.length - 1) {
                            this.collection.models[j].set('step', j + 2)
                            this.collection.models[j + 1].set('step', j + 1)
                            this.changeColumnHtml(this.collection.models[j].get('step'), this.collection.models[j].get('title'), radioLevels[j].parentNode, true)
                            this.changeColumnHtml(this.collection.models[j + 1].get('step'), this.collection.models[j + 1].get('title'), radioLevels[j + 1].parentNode, false)
                            var tempModel = this.collection.models[j]
                            this.collection.models[j] = this.collection.models[j + 1]
                            this.collection.models[j + 1] = tempModel
                            if (this.changedSteps.indexOf(j) == -1) {
                                this.changedSteps.push(j)
                            }
                            if (this.changedSteps.indexOf(j + 1) == -1) {
                                this.changedSteps.push(j + 1)
                            }
                        }
                        break;
                    }
                }

                var next = radio.nextSibling;
                var par = radio.parentNode;
                if (next.nextSibling) {
                    par.removeChild(radio);
                    par.insertBefore(radio, next.nextSibling);
                } else {
                    par.removeChild(radio);
                    par.appendChild(radio);
                }
            }
        },

        changeColumnHtml: function(stepNo, title, td, check) {
            if (check) {
                $(td).html('<input type = "radio" name = "stepRow" checked = "checked" />&nbsp;&nbsp;'+App.languageDict.attributes.Step+' ' + stepNo + ' : ' + title)
            } else {
                $(td).html('<input type = "radio" name = "stepRow" />&nbsp;&nbsp;'+App.languageDict.attributes.Step+' ' + stepNo + ' : ' + title)
            }
        },

        addOne: function(model) {
            var that = this
            var lrow = new App.Views.LevelRow({
                model: model
            })
            lrow.on('levelDeleted', function() {
                var stepNo = lrow.model.get("step")
                for (var i = stepNo; i < that.collection.models.length; i++) {
                    that.collection.models[i].set('step', i)
                    that.updateModel(that.collection.models[i])
                }
                alert(App.languageDict.attributes.Step_deleted_Success)
                that.collection.models.splice(stepNo - 1, 1)
                if (that.collection.models.length == 0) {
                    $('#moveup').hide()
                    $('#movedown').hide()
                    $('#Rearrange').hide()
                }
                location.reload()
            })
            lrow.render()
            this.$el.append(lrow.el)
        },

        updateModel: function(model) {
            model.save({
                success: function() {}
            })
        },

        addAll: function() {
            // @todo this does not work as expected, either of the lines
            // _.each(this.collection.models, this.addOne())
            this.collection.each(this.addOne, this)
        },
        initialize: function() {
            this.changedSteps = new Array()
        },
        render: function() {
            if (this.collection.models.length > 0) {
                this.$el.append('&nbsp;&nbsp;&nbsp;<button class = "btn btn-success" id="Rearrange" >'+App.languageDict.attributes.Rearrange+'</button><br/><br/>')
            }
            this.$el.append('<button class = "btn btn-success" id = "moveup" >'+App.languageDict.attributes.Up+'</button>&nbsp;&nbsp;&nbsp;')
            this.$el.append('<button class = "btn btn-success" id = "movedown" >'+App.languageDict.attributes.Down+'</button>')
            this.addAll()
        }
    })
})