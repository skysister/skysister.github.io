var sov = {
    map: { names: [], alliance: {} },

    onDocumentReady: function () {
        console.log("sov.onDocumentReady()");
        OnClick.install("sov"); // attaches click handlers
        sov.log("Ready");
    },

    onRun: function () {
        sov.log("onRun()");

        sov.esiSovMap()
            .then(() => { sov.metrics(sov.map.original, "original:", "systems"); })
            .then(sov.filterSystems)
            .then(() => { sov.metrics(sov.map.withAlliance, "withAlliance:", "systems"); })
            .then(sov.systemNames)
            .then(() => { sov.metrics(sov.map.names, "name:", "systems"); })
            .then(sov.alliances)
            .then(() => { sov.metrics(Object.keys(sov.map.alliance), "alliance:", "alliances"); })
            .then(sov.combineMapData)
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

    /**
     * systemIDs
     * returns an array for getting system names
     */
    systemIDs: function () {
        sov.log("systemIDs()");
        return sov.map.withAlliance.map(system => system.system_id);
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
        const endpoint = "https://esi.evetech.net/latest/alliances/" + alliance_id + "/?datasource=tranquility";

        return fetch(endpoint)
            .then(response => response.json())
            .then(result => { sov.map.alliance[alliance_id] = result; });
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
