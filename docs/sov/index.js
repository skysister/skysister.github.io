var sov = {
    map: { names: [], alliance: {} },

    onDocumentReady: function () {
        console.log("sov.onDocumentReady()");
        OnClick.install("sov"); // attaches click handlers
        sov.log("Ready");
    },

    onRun: function () {
        sov.log("onRun()");
        // sov.getMap();
        sov.esiSovMap()
            .then(() => { sov.metrics(sov.map.original, "original:", "systems"); })
            .then(sov.filterSystems)
            .then(() => { sov.metrics(sov.map.withAlliance, "withAlliance:", "systems"); })
            .then(sov.systemNames)
            .then(() => { sov.metrics(sov.map.names, "name:", "systems"); })
            .then(sov.alliances)
            .then(() => { sov.metrics(Object.keys(sov.map.alliance), "alliance:", "alliances"); })
    },

    metrics: function (theArray, name, items) {
        sov.log(["-", name, theArray.length, items].join(" "));
        return Promise.resolve();
    },

    esiSovMap: function () {
        sov.log("esiSovMap()")
        const endpoint = "https://esi.evetech.net/latest/sovereignty/map/?datasource=tranquility";

        return fetch(endpoint)
            .then(response => response.json())
            .then(result => { sov.map.original = result });
    },

    filterSystems: function () {
        sov.log("filterSystems()");
        sov.map.withAlliance = sov.map.original.filter(
            s => Object.keys(s).includes("alliance_id")
        );
        return Promise.resolve();
    },

    systemNames: function () {
        sov.log("systemNames()");
        // get system names 1,000 at a time
        const systemIDs = sov.systemIDs();
        const chunkSize = 1000;
        const requests = [];
        for (i = 0; i < systemIDs.length; i += chunkSize) {
            const chunk = systemIDs.slice(i, i + chunkSize);
            requests.push(sov.esiUniverseNames(chunk));
        }
        return Promise.all(requests);
    },

    esiUniverseNames: function (systemIDs) {
        sov.log("esiUniverseNames() " + systemIDs.length);

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

    alliances: function () {
        sov.log("alliances()");

        // deduplicate the alliances for non-redundant lookup
        sov.map.withAlliance.forEach(system => {
            sov.map.alliance[system.alliance_id] = {};
        });

        const requests = [];
        Object.keys(sov.map.alliance).forEach(alliance_id => {
            requests.push(sov.esiAlliance(alliance_id));
        });
        return Promise.all(requests);
    },

    esiAlliance: function (alliance_id) {
        console.log("sov.esiAlliance(" + alliance_id + ")");
        const endpoint = "https://esi.evetech.net/latest/alliances/" + alliance_id + "/?datasource=tranquility";

        return fetch(endpoint)
            .then(response => response.json())
            .then(result => { sov.map.alliance[alliance_id] = result; });
    },

    /**
     * getMap
     * populates sov.map.original from ESI /sovereignty/map/
     * 
     * calls sov.filterMap() to reduce map to those with alliances
     * calls sov.systemIDs() to construct array for getting system names
     * calls sov.getSystemNames()
     * calls sov.alliances()
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
                        sov.alliances();
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
        sov.log("systemIDs()");
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

    /**
     * combineMapData
     * assigns systems and alliances to sov.map.withAlliance
     */
    combineMapData: function () {
        sov.log("sov.combineMapData()");

        sov.map.withAlliance.forEach(system => {
            console.log(system);
        });
    },

    log: function (message) {
        $("#log").append(message + "\n");
    }
};

$(sov.onDocumentReady);
