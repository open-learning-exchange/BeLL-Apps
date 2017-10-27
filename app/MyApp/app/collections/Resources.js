$(function() {

    // We're getting _all_docs instead of a Resources view because we're not putting
    // views in Collection databases. We'll mapreduce client side.
    App.Collections.Resources = Backbone.Collection.extend({

        model: App.Models.Resource,
        url: function() {
            console.log("What ? :" ,this);
            /* For Search Part */
            if(this.search){
                if(this.pending == 0 && this.skip >=0) {
                    return App.Server + '/resources/_design/bell/_view/searchResources?key="'+this.search+'"&&include_docs=true&limit=20&skip=' + this.skip;
                }
            }
            if (this.collectionName) {
                //return App.Server + '/resources/_design/bell/_view/listCollection?include_docs=true&key="' + this.collectionName + '"'
                if (this.skip >= 0) {
                    console.log(1);
                    return App.Server + '/resources/_design/bell/_view/searchView?include_docs=true&limit=25&skip=' + this.skip + '&keys=' + this.collectionName
                } else {
                    console.log(2);
                    return App.Server + '/resources/_design/bell/_view/searchView?include_docs=true&keys=' + this.collectionName
                }
            } else if (this.skip >= 0 && this.pending >= 0) {
                if(this.pending == 0) {
                    if (this.startkey && this.startkey != "") {
                        console.log(3);
                        return App.Server + '/resources/_design/bell/_view/ResourcesWithoutPendingStatus?include_docs=true&startkey="' + this.startkey + '"&limit=20&skip=' + this.skip;
                    } else {
                        console.log(4);
                        return App.Server + '/resources/_design/bell/_view/ResourcesWithoutPendingStatus?include_docs=true&limit=20&skip=' + this.skip;
                    }
                }
                else if(this.pending == 1) {
                    if (this.startkey && this.startkey != "") {
                        console.log(5);
                        return App.Server + '/resources/_design/bell/_view/ResourcesAddedByCommunity?include_docs=true&startkey="' + this.startkey + '"&limit=20&skip=' + this.skip;
                    } else {
                        console.log(6);
                        return App.Server + '/resources/_design/bell/_view/ResourcesAddedByCommunity?include_docs=true&limit=20&skip=' + this.skip;
                    }
                }
                else if(this.pending == 2) {
                    if (this.startkey && this.startkey != "") {
                        console.log(7);
                        return App.Server + '/resources/_design/bell/_view/ResourcesWithPendingStatus?include_docs=true&startkey="' + this.startkey + '"&limit=20&skip=' + this.skip;
                    } else {
                        console.log(8);
                        return App.Server + '/resources/_design/bell/_view/ResourcesWithPendingStatus?include_docs=true&limit=20&skip=' + this.skip;
                    }
                }
                else if(this.pending == 3) {
                    if(this.loggedInName) {

                        if (this.startkey && this.startkey != "") {
                            console.log(9);
                            this.startkey = this.startkey.toLowerCase();
                            return App.Server + '/resources/_design/bell/_view/ResourcesWithPendingStatusAndOwnership?include_docs=true&startkey=["' + this.loggedInName + '","' + this.startkey + '"]&endkey=["' + this.loggedInName + '","\u0fff"]&limit=20&skip=' + this.skip;
                        } else {
                            console.log(10);
                            return App.Server + '/resources/_design/bell/_view/ResourcesWithPendingStatusAndOwnership?include_docs=true&startkey=["' + this.loggedInName + '"]&endkey=["' + this.loggedInName + '",{}]&limit=20&skip=' + this.skip;
                        }
                    }
                }
                //return App.Server + '/resources/_all_docs?include_docs=true&limit=20&skip='+this.skip
                /*if (this.startkey && this.startkey != "") {
                    return App.Server + '/resources/_design/bell/_view/sortresources?include_docs=true&startkey="' + this.startkey + '"&limit=20&skip=' + this.skip
                } else {
                    return App.Server + '/resources/_design/bell/_view/sortresources?include_docs=true&limit=20&skip=' + this.skip
                }*/
            }else if (this.skip >= 0) {
                //return App.Server + '/resources/_all_docs?include_docs=true&limit=20&skip='+this.skip
                if (this.startkey && this.startkey != "") {
                    console.log(11);
                    return App.Server + '/resources/_design/bell/_view/sortresources?include_docs=true&startkey="' + this.startkey + '"&limit=20&skip=' + this.skip
                } else {
                    console.log(12);
                    return App.Server + '/resources/_design/bell/_view/sortresources?include_docs=true&limit=20&skip=' + this.skip
                }
            } else if (this.title) {
                console.log(13);
                return App.Server + '/resources/_design/bell/_view/resourceOnTtile?include_docs=true&key="' + this.title + '"'
                //return App.Server + '/shelf/_design/bell/_view/getShelfItemWithResourceId?key="' +this.resourceId+ '"&include_docs=true'
            } else if (this.ides) {
                console.log(14);
                return App.Server + '/resources/_design/bell/_view/resourceName?include_docs=true&keys=' + this.resIds
            } else {
                console.log(15);
                return App.Server + '/resources/_all_docs?include_docs=true'
            }
        },
        initialize: function(a) {

            if (a && a.collectionName) {
                this.collectionName = a.collectionName
            } else if (a && a.skip >= 0) {
                this.skip = a.skip
            }
        },
        setUrl: function(newUrl) {
            this.url = newUrl;
        },

        parse: function(response) {
            var models = []
            _.each(response.rows, function(row) {
                if (row.doc) {
                    models.push(row.doc);
                } else {
                    models.push(row);
                }

            });
            return models
        },

        comparator: function(model) {
            var title = model.get('title')
            if (title) return title.toLowerCase()
        }

    })

})