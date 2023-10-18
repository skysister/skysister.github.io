var oremon = {
    data: {},
    path: {
        user: "/oremon/data/user.json",
        material: "/oremon/data/material.json"
    },

    onDocumentReady: function () {
        var allDataIsRead = oremon.readAllData();
        $.when(...allDataIsRead).done(function () {
            // all data is read
            user.init();
        });
    },

    readAllData: function () {
        var promises = [];
        for (var name in oremon.path) {
            promises.push(oremon.readData(name));
        }

        return promises;
    },

    readData: function (name) {
        return $.getJSON(oremon.path[name])
            .done(function (data) {
                oremon.data[name] = data;
            })
            .fail(function () {
                console.warn("Failed to read", oremon.path[name]);
            })
            .promise();
    },

    loadTemplate: function (template, vars, empty = true) {
        const container = $("#oremon");

        if (empty) {
            container.empty();
        }

        container.append(Mustache.render(
            $(template).html(), vars
        ));
    }
};

$(oremon.onDocumentReady);
