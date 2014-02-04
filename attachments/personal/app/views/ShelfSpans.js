$(function () {
    App.Views.ShelfSpans = Backbone.View.extend({

        tagName: "tr",

        render: function () {
            //Using the Existing Member Dictionary to Display the Records
            var empty = true;
            for (var key in App.ShelfItems) {
                empty = false;
                break;
            }
            if (!empty) {
                $.each(App.ShelfItems, function (key, value) {
                    var arr = value.toString().split("+")
                    if(arr[0]=='false')
                    {
                    	$('#ur').append('<td class="shelf-box"><a href="#resource/detail/' + key + '/' + arr[2] + '/' + arr[3] + '">' + arr[1] + '</a></td>')
                    }
                });
            } else {
                $('#ur').append('<td class="shelf-box">No Item In the Shelf</td>')
            }
        }

    })

})