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

    /**
     * getMap
     * populates sov.map.original from ESI /sovereignty/map/
     * 
     * calls sov.filterMap() to reduce map to those with alliances
     * calls sov.systemIDs() to construct array for getting system names
     * calls sov.getSystemNames()
     */
    getMap: function () {
        sov.log("sov.getMap()");
        const endpoint = "https://esi.evetech.net/latest/sovereignty/map/?datasource=tranquility";

        // call ESI /sovereignty/map/
        fetch(endpoint)
            .then(response => response.json())
            .then(result => {
                sov.map.original = result;
                sov.log("- sov.map.original has " + sov.map.original.length + " systems.");
                sov.filterMap();

                // get system names 1,000 at a time
                const systemIDs = sov.systemIDs();
                const maxEntries = 1000;
                const requests = [];
                for (i = 0; i < systemIDs.length; i += maxEntries) {
                    const maxSystemIDs = systemIDs.slice(i, i + maxEntries);
                    requests.push(sov.getSystemNames(maxSystemIDs));
                }

                // continue once all the requests are complete
                Promise.all(requests)
                    .then(() => {
                        sov.log("- sov.map.names has " + sov.map.names.length + " systems.");
                        sov.mapNames();
                    });
            });
    },

    /**
     * filterMap
     * populates sov.map.withAlliance with systems that have an alliance_id
     */
    filterMap: function () {
        sov.log("sov.filterMap()");
        sov.map.withAlliance = sov.map.original.filter(
            s => Object.keys(s).includes("alliance_id")
        );
        sov.log("- sov.map.withAlliance has " + sov.map.withAlliance.length + " systems.");
    },

    /**
     * systemIDs
     * returns an array for getting system names
     */
    systemIDs: function () {
        sov.log("sov.systemIDs()");
        return sov.map.withAlliance.map(system => system.system_id);
    },

    /**
     * getSystemNames
     * calls ESI /universe/names/ to retrieve system names in bulk
     */
    getSystemNames: function (systemIDs) {
        sov.log("sov.getSystemNames() " + systemIDs.length);

        const endpoint = "https://esi.evetech.net/latest/universe/names/?datasource=tranquility";

        const body = JSON.stringify(systemIDs);
        const headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
        };
        const method = "post";

        return fetch(endpoint, { body, headers, method })
            .then(response => response.json())
            .then(result => {
                sov.log("Received " + result.length + " names.");
                sov.map.names.push(...result);
            });
    },

    mapNames: function() {
        sov.log("sov.mapNames()");
    },

    log: function (message) {
        $("#log").append(message + "\n");
    }
};

$(sov.onDocumentReady);
