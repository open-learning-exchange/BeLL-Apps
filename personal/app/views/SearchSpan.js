$(function () {

    App.Views.SearchSpan = Backbone.View.extend({

        tagName: "tr",

        className: 'search-box',

        template: $("#template-Search-box ").html(),

        render: function () {
            var vars = this.model.toJSON()
            var url = "/apps/_design/bell/bell-resource-router/index.html#open/" + vars._id
            var text = ""
            var btnClass = ""
            var link = ""
            if (App.ShelfItems[vars._id]) {
                text = "Added"
                btnClass = "btn-disabled'"
            } else {
                text = "Add"
                btnClass = "btn-success addtoshelf' "
                link = "onclick =\"document.location.href='#addResource/" + vars._id + "/" + vars.title + "/" + vars._rev + "'\""
            }
            var addToShelfLink = "<td><button class='btn btn-open " + btnClass + link + ">" + text + "</button></td>"
            if (vars.Tag == "News") {
                if (this.model.get("_attachments")) {
                    vars.title = '<a  class="search-href" href="/apps/_design/bell/bell-resource-router/index.html#open/' + vars._id + '" target="_blank"><i class="icon-list"></i>' + vars.title;
                    var ul = "/apps/_design/bell/bell-resource-router/index.html#open/" + vars._id;
                }
            }
            this.$el.append(_.template(this.template, vars))
            this.$el.append(addToShelfLink)
        }
    })
})