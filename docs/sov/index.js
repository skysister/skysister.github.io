var sov = {
    alliance: {},
    campaign: { names: [] },
    map: { names: [] },

    onDocumentReady: function () {
        console.log("sov.onDocumentReady()");
        OnClick.install("sov"); // attaches click handlers
        sov.log("Ready");
    },

    onClaimed: function () {
        $("#sov-log").empty();
        sov.log("onClaimed()");

        sov.esiSovMap()
            .then(() => { sov.metrics(sov.map.esi, "map:", "systems"); })
            .then(sov.filterMapSystems)
            .then(() => { sov.metrics(sov.map.withAlliance, "withAlliance:", "systems"); })
            .then(sov.getMapSystemNames)
            .then(() => { sov.metrics(sov.map.names, "name:", "systems"); })
            .then(sov.getMapAlliances)
            .then(() => { sov.metrics(Object.keys(sov.alliance), "alliance:", "alliances"); })
            .then(sov.combineMapData)
            .then(sov.outputClaimed)
    },

    onContested: function () {
        $("#sov-log").empty();
        sov.log("onClaimed()");

        sov.esiSovCampaigns()
            .then(() => { sov.metrics(sov.campaign.esi, "campaign:", "systems"); })
            .then(sov.getCampaignSystemNames)
            .then(() => { sov.metrics(sov.campaign.names, "name:", "systems"); })
            .then(sov.getCampaignAlliances)
            .then(() => { sov.metrics(Object.keys(sov.alliance), "alliance:", "alliances"); })
            .then(sov.combineCampaignData)
            .then(sov.convertCampaignDateTimes)
            .then(sov.outputCampaign)
    },

    onSwapTime: function() {
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
            .then(result => { sov.campaign.esi = result });
    },

    esiSovMap: function () {
        sov.log("esiSovMap()")
        const endpoint = "https://esi.evetech.net/latest/sovereignty/map/?datasource=tranquility";

        return fetch(endpoint)
            .then(response => response.json())
            .then(result => { sov.map.esi = result });
    },

    filterMapSystems: function () {
        sov.log("filterMapSystems()");
        sov.map.withAlliance = sov.map.esi.filter(
            s => Object.keys(s).includes("alliance_id")
        );
        return Promise.resolve();
    },

    getMapSystemNames: function () {
        sov.log("getMapSystemNames()");
        return sov.getSystemNamesByChunk(sov.systemIDs(sov.map.withAlliance), "map");
    },

    getCampaignSystemNames: function () {
        sov.log("getCampaignSystemNames()");
        return sov.getSystemNamesByChunk(sov.systemIDs(sov.campaign.esi, "solar_system_id"), "campaign");
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

    esiUniverseNames: function (systemIDs, dest) {
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
                sov[dest].names.push(...result);
            });
    },

    getMapAlliances: function () {
        sov.log("getMapAlliances()");

        // deduplicate the alliances for non-redundant lookup
        sov.map.withAlliance.forEach(system => {
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

    getCampaignAlliances: function () {
        sov.log("getMapAlliances()");

        // deduplicate the alliances for non-redundant lookup
        sov.campaign.esi.forEach(system => {
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

    combineMapData: function () {
        sov.log("sov.combineMapData()");

        sov.map.withAlliance.forEach((system, s) => {
            sov.map.withAlliance[s].alliance = sov.alliance[system.alliance_id];
            sov.map.withAlliance[s].system = sov.map.names.filter(n => n.id == system.system_id)[0];
        });

        return Promise.resolve();
    },

    combineCampaignData: function () {
        sov.log("sov.combineCampaignData()");

        sov.campaign.esi.forEach((system, s) => {
            sov.campaign.esi[s].alliance = sov.alliance[system.defender_id];
            sov.campaign.esi[s].system = sov.campaign.names.filter(n => n.id == system.solar_system_id)[0];
        });

        return Promise.resolve();
    },

    convertCampaignDateTimes: function() {
        sov.campaign.esi.forEach((system, s) => {
            const eventTimeLocal = moment(system.start_time);
            const eventTimeEve = moment(eventTimeLocal).utc();
            sov.campaign.esi[s].time = {
                eve: eventTimeEve.format('MMM D, YYYY HH:mm'),
                local: eventTimeLocal.format('MMM D, YYYY h:mm a'),
            };
        })
    },

    outputClaimed: function () {
        sov.log("outputClaimed()");
        $("#sov-output").empty()
            .append(Mustache.render(
                $("#sov-claimed").html(), { systems: sov.map.withAlliance }
            ))
            .show();
    },

    outputCampaign: function () {
        sov.log("outputCampaign()");
        $("#sov-output").empty()
            .append(Mustache.render(
                $("#sov-campaign").html(), { systems: sov.campaign.esi }
            ))
            .show();
    },

    log: function (message) {
        $("#sov-log").append(message + "\n");
    }
};

$(sov.onDocumentReady);
