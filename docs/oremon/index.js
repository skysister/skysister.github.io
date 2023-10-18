var oremon = {
    data: {},
    path: {
        material: "/oremon/data/material.json",
    },

    onDocumentReady: function () {
        console.log("oremon.onDocumentReady()");
        var dataIsAllRead = oremon.readData();
        $.when(...dataIsAllRead).done(function () {
            console.log("All data is read.");
        });
    },

    readData: function () {
        var promises = [];
        for (var name in oremon.path) {
            console.log(name, oremon.path[name]);
            var dataRead = $.getJSON(oremon.path[name])
                .done(function(data) {
                    oremon.data[name] = data;
                })
                .fail(function() {
                    console.log("Failed to read", oremon.path[name]);
                });
            promises.push(dataRead.promise());
        }

        return promises;
    }
};

$(oremon.onDocumentReady);
