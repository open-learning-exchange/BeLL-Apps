$(function() {

  App.Views.CommunityRow = Backbone.View.extend({

    tagName: "tr",

    events: {
      "click .destroy": function(e) {
        e.preventDefault()
        this.model.destroy()
        this.remove()
      },
      "click .browse": function(e) {
        e.preventDefault()
        $('#modal').modal({
          show: true
        })
      }
    },

    //template : $("#template-CourseRow").html(),

    initialize: function() {

    },

    render: function() {

      var community = this.model;
      var row = "<td>" + community.get('Name') + "</td><td>45</td><td><a role='button' class='btn btn-info' href='#addCommunity/" + community.get('_id') + "'> <i class='icon-pencil icon-white'></i>Edit</a><a role='button' style='margin-left:20px' class='btn btn-inverse' href='#addCommunity/" + community.get('_id') + "'> <i class='icon-wrench icon-white'></i> Manage</a></td>";
      this.$el.append(row);

    }

  })

})