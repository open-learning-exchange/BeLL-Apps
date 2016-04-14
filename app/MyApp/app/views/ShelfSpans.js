$(function() {
    App.Views.ShelfSpans = Backbone.View.extend({

        tagName: "tr",

        render: function() {
            //Using the Existing Member Dictionary to Display the Records
            var that =this;
            var empty = true;
            var allhidden = true;
            for (var key in App.ShelfItems) {
                empty = false;
                break;
            }
            if (!empty) {
                $.each(App.ShelfItems, function(key, value) {

                    var arr = value.toString().split("+")
                    if (arr[0] != 'true') {
                        var resource = new App.Models.Resource({
                            _id: key
                        });
                        resource.fetch({
                            async: false
                        });
                        var vars = resource.toJSON();
                        var cancelButton = '';
                        if(App.languageDict.get('directionOfLang').toLowerCase() === "right")
                        {
                            cancelButton = '<tr style="height: 37%">' +
                                '<td align="left" valign="top"><a href="#" onclick="deleteResource(\'' + key + '\')"><img src="img/DeleteRed.png" ></a></td>' +
                                '</tr>';
                        }
                        else
                        {
                            cancelButton = '<tr style="height: 37%">' +
                                '<td align="right" valign="top"><a href="#" onclick="deleteResource(\'' + key + '\')"><img src="img/DeleteRed.png" ></a></td>' +
                                '</tr>';
                        }
                        var resourceUrlRow = '';
                        if (vars._attachments)
                        {
                            var hrefUrl = '/apps/_design/bell/bell-resource-router/index.html#open/' + vars._id + '/'+ vars.title;
                            resourceUrlRow = '<tr>' +
                                '<td colspan="2" style="text-align:center;vertical-align: text-bottom;" onclick="openResourceDetail(\'' + key + '\')"><a style="color:white;" target="_blank" href="' + hrefUrl + '">' + vars.title + '</a></td>' +
                                '</tr>';
                        }
                        else
                        {
                            resourceUrlRow = '<tr>' +
                                '<td colspan="2" style="text-align:center;vertical-align: text-bottom;"><a style="color:white;">' + vars.title + '</a></td>' +
                                '</tr>';
                        }
                        $('#ur').append('<td class="shelf-box">' +
                            '<table style="width: 100%;height: 100%">' +
                            cancelButton +
                            resourceUrlRow +
                            '</table>' +
                            '</td>');

                        //$('#ur').append('<td class="shelf-box"><a href="#resource/detail/' + key + '/' + arr[2] + '/' + arr[3] + '">' + arr[1] + '</a></td>')
                    }
                });
                $.each(App.ShelfItems, function(key, value) {

                    var arr = value.toString().split("+")
                    if (arr[0] != 'true')
                        allhidden = false
                });

            }
            if (allhidden) {
                $('.scrollable-shelf .inner .inner-table-shelf').attr('class', 'inner-table');
                $('#ur').append('<td class="shelf-box">'+App.languageDict.attributes.Empty_Shelf+'</td>')
            }
        }

    })

})