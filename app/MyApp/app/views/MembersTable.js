$(function() {

    var page_no = 0;

    App.Views.MembersTable = Backbone.View.extend({

        tagName: "table",

        className: "btable btable-striped",

        addOne: function(model) {
            var memberRow = new App.Views.MemberRow({
                model: model
            })
            memberRow.isadmin = this.isadmin
            memberRow.community_code = this.community_code;
            memberRow.render()
            this.$el.append(memberRow.el)
        },
        events: {
            "click .pageNumber": function(e) {
                page_no = e.currentTarget.id;
                this.collection.startkey = ""
                this.collection.skip = e.currentTarget.id         //attributes[0].value
                this.collection.fetch({
                    async: false
                })
                if (this.collection.length > 0) {
                    this.render()
                }
            }

        },

        addAll: function() {
            this.$el.html("<tr><th>"+App.languageDict.attributes.Photo+"</th><th>"+App.languageDict.attributes.Last_Name+"</th><th>"+App.languageDict.attributes.First_Name+"</th><th>"+App.languageDict.attributes.Visits+"</th><th>"+App.languageDict.attributes.Email+"</th><th>"+App.languageDict.attributes.Bell_Email+"</th><th>"+App.languageDict.attributes.action+"</th></tr>")
            // @todo this does not work as expected, either of the lines
            // _.each(this.collection.models, this.addOne())
            this.collection.each(this.addOne, this)
            var courseLength;
            var context = this
            $.ajax({
                url: '/members/_design/bell/_view/count?course=false',
                type: 'GET',
                dataType: "json",
                success: function(json) {
                    memberLength = json.rows[0].value
                    if (context.displayCollec_Resources != true) {
                        var pageBottom = "<tr><td colspan=7>"
                        var looplength = memberLength / 20

                        for (var i = 0; i < looplength; i++) {
                            if (i == 0)
                                pageBottom += '<a  class="pageNumber" value="' + i * 20 + '" id="0" style="cursor:pointer;">'+App.languageDict.attributes.Home+'</a>&nbsp&nbsp'
                            else
                                pageBottom += '<a  class="pageNumber" value="' + i * 20 + '" id="' + i * 20 + '" style="cursor:pointer;">' + i + '</a>&nbsp&nbsp'
                        }
                        pageBottom += "</td></tr>"
                        context.$el.append(pageBottom)
                        if(page_no != "")
                            $('#'+page_no).css({'text-decoration':'underline'});
                    }

                }
            })
        },

        render: function() {
            this.addAll()
        }

    })

})