var sov = {
    map: { names: [] },

    onDocumentReady: function () {
        console.log("sov.onDocumentReady()");
        OnClick.install("sov"); // attaches click handlers
        sov.log("Ready");
    },

    onRun: function () {
        console.log("sov.run()");
        sov.getMap();
    },

    getMap: function () {
        sov.log("sov.getMap()");
        const endpoint = "https://esi.evetech.net/latest/sovereignty/map/?datasource=tranquility";
        sov.log(endpoint);

        fetch(endpoint)
            .then(response => response.json())
            .then(result => {
                sov.map.original = result;
                sov.log("Received " + sov.map.original.length + " systems.");
                sov.filterMap();
                // sov.getNames(sov.systemIDs());
                const systemIDs = sov.systemIDs();
                const maxEntries = 1000;
                for (i = 0; i < systemIDs.length; i += maxEntries) {
                    const maxSystemIDs = systemIDs.slice(i, i + maxEntries);
                    sov.getNames(maxSystemIDs);
                }
                sov.log("Names has " + sov.map.names.length + " systems.");
            });
    },

    getNames: function (systemIDs) {
        sov.log("sov.getNames() " + systemIDs.length);

        const endpoint = "https://esi.evetech.net/latest/universe/names/?datasource=tranquility";

        const body = JSON.stringify(systemIDs);
        const headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
        };
        const method = "post";

        fetch(endpoint, { body, headers, method })
            .then(response => response.json())
            .then(result => {
                sov.log("Received " + result.length + " names.");
                sov.map.names.push(...result);
            });
    },

    filterMap: function () {
        sov.log("sov.filterMap()");
        sov.map.withAlliance = sov.map.original.filter(
            s => Object.keys(s).includes("alliance_id")
        );
        sov.log("Filtered to " + sov.map.withAlliance.length + " systems.");
    },

    systemIDs: function () {
        sov.log("sov.systemIDs()");
        return sov.map.withAlliance.map(system => system.system_id);
    },

    log: function (message) {
        $("#log").append(message + "\n");
    },

    endOfObject: true
};

$(sov.onDocumentReady);
