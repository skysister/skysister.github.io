var sov = {
    alliance: {},
    claimed: {},
    contested: {},
    systemNames: [],

    onDocumentReady: function () {
        console.log("sov.onDocumentReady()");
        OnClick.install("sov"); // attaches click handlers
        sov.log("Ready");
    },

    onClaimed: function () {
        $("#sov-log").empty();
        sov.log("onClaimed()");

        sov.esiSovMap()
            .then(() => { sov.metrics(sov.claimed.esi, "from ESI:", "systems"); })
            .then(sov.filterClaimedSystems)
            .then(() => { sov.metrics(sov.claimed.output, "with alliance:", "systems"); })
            .then(sov.getClaimedSystemNames)
            .then(() => { sov.metrics(sov.systemNames, "name:", "systems"); })
            .then(sov.getClaimedAlliances)
            .then(() => { sov.metrics(Object.keys(sov.alliance), "alliance:", "alliances"); })
            .then(sov.combineClaimedData)
            .then(sov.outputClaimed)
    },

    onContested: function () {
        $("#sov-log").empty();
        sov.log("onClaimed()");

        sov.esiSovCampaigns()
            .then(() => { sov.metrics(sov.contested.output, "contested:", "systems"); })
            .then(sov.getContestedSystemNames)
            .then(() => { sov.metrics(sov.systemNames, "name:", "systems"); })
            .then(sov.getContestedAlliances)
            .then(() => { sov.metrics(Object.keys(sov.alliance), "alliance:", "alliances"); })
            .then(sov.combineContestedData)
            .then(sov.convertContestedDateTimes)
            .then(sov.outputContested)
    },

    onSwapTime: function () {
        console.log("sov.onSwapTime");
        $(".time").toggle();
    },

    metrics: function (theArray, name, items) {
        sov.log(["-", name, theArray.length, items].join(" "));
        return Promise.resolve();
    },

    esiSovCampaigns: function () {
        sov.log("esiSovCampaigns()")
        const endpoint = "https://esi.evetech.net/latest/sovereignty/campaigns/?datasource=tranquility";

        return fetch(endpoint)
            .then(response => response.json())
            .then(result => {
                sov.contested.esi = result;
                sov.contested.output = result;
            });
    },

    esiSovMap: function () {
        sov.log("esiSovMap()")
        const endpoint = "https://esi.evetech.net/latest/sovereignty/map/?datasource=tranquility";

        return fetch(endpoint)
            .then(response => response.json())
            .then(result => { sov.claimed.esi = result });
    },

    filterClaimedSystems: function () {
        sov.log("filterClaimedSystems()");
        sov.claimed.output = sov.claimed.esi.filter(
            s => Object.keys(s).includes("alliance_id")
        );
        return Promise.resolve();
    },

    getClaimedSystemNames: function () {
        sov.log("getClaimedSystemNames()");
        return sov.getSystemNamesByChunk(sov.systemIDs(sov.claimed.output), "claimed");
    },

    getContestedSystemNames: function () {
        sov.log("getContestedSystemNames()");
        return sov.getSystemNamesByChunk(sov.systemIDs(sov.contested.output, "solar_system_id"), "contested");
    },

    systemIDs: function (systems, member = "system_id") {
        sov.log("systemIDs()");
        return systems.map(system => system[member]);
    },

    getSystemNamesByChunk: function (systemIDs, dest) {
        sov.log("getSystemNamesByChunk()");
        // get system names 1,000 at a time
        const chunkSize = 1000;
        const requests = [];
        for (i = 0; i < systemIDs.length; i += chunkSize) {
            const chunk = systemIDs.slice(i, i + chunkSize);
            requests.push(sov.esiUniverseNames(chunk, dest));
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
                sov.systemNames.push(...result);
            });
    },

    getClaimedAlliances: function () {
        sov.log("getClaimedAlliances()");

        // deduplicate the alliances for non-redundant lookup
        sov.claimed.output.forEach(system => {
            // TODO check for existance first
            sov.alliance[system.alliance_id] = {};
        });

        // TODO send list of empty objects
        const requests = [];
        Object.keys(sov.alliance).forEach(alliance_id => {
            requests.push(sov.esiAlliance(alliance_id));
        });
        return Promise.all(requests);
    },

    getContestedAlliances: function () {
        sov.log("getContestedAlliances()");

        // deduplicate the alliances for non-redundant lookup
        sov.contested.output.forEach(system => {
            // TODO check for existance first
            sov.alliance[system.defender_id] = {};
        });

        // TODO send list of empty objects
        const requests = [];
        Object.keys(sov.alliance).forEach(alliance_id => {
            requests.push(sov.esiAlliance(alliance_id));
        });
        return Promise.all(requests);
    },

    esiAlliance: function (alliance_id) {
        const endpoint = "https://esi.evetech.net/latest/alliances/" + alliance_id + "/?datasource=tranquility";

        return fetch(endpoint)
            .then(response => response.json())
            .then(result => { sov.alliance[alliance_id] = result; });
    },

    combineClaimedData: function () {
        sov.log("sov.combineClaimedData()");

        sov.claimed.output.forEach((system, s) => {
            sov.claimed.output[s].alliance = sov.alliance[system.alliance_id];
            sov.claimed.output[s].system = sov.systemNames.filter(n => n.id == system.system_id)[0];
        });

        return Promise.resolve();
    },

    combineContestedData: function () {
        sov.log("sov.combineContestedData()");

        sov.contested.output.forEach((system, s) => {
            sov.contested.output[s].alliance = sov.alliance[system.defender_id];
            sov.contested.output[s].system = sov.systemNames.filter(n => n.id == system.solar_system_id)[0];
        });

        return Promise.resolve();
    },

    convertContestedDateTimes: function () {
        sov.contested.output.forEach((system, s) => {
            const eventTimeLocal = moment(system.start_time);
            const eventTimeEve = moment(eventTimeLocal).utc();
            sov.contested.output[s].time = {
                eve: eventTimeEve.format('MMM D, YYYY HH:mm'),
                local: eventTimeLocal.format('lll'),
            };
        })
    },

    outputClaimed: function () {
        sov.log("outputClaimed()");
        $("#sov-output").empty()
            .append(Mustache.render(
                $("#sov-claimed").html(), { systems: sov.claimed.output }
            ))
            .show();
    },

    outputContested: function () {
        sov.log("outputContested()");
        $("#sov-output").empty()
            .append(Mustache.render(
                $("#sov-contested").html(), { systems: sov.contested.output }
            ))
            .show();
    },

    log: function (message) {
        $("#sov-log").append(message + "\n");
    }
};

$(sov.onDocumentReady);
