var pool = {
    init: function () {
        console.log("pool.init()");
        OnClick.install("pool"); // attaches click handlers
        pool.initForms();

        pool.data = pool.read("oremon-pool-data");
        if (pool.data) {
            pool.foundData();
        } else {
            pool.noData();
        }
    },

    initForms: function () {
        $("#oremon").on("submit", "#new-pool-form", pool.onCreate);
    },

    add: function (newPool) {
        var data = pool.read("oremon-pool-data");
        const poolID = crypto.randomUUID();
        newPool.dateTimeCreated = moment().unix();

        // if data is falsey, set it to an empty object
        if (!data) {
            data = { list: {} };
        }

        // add to the pool data
        data.list[poolID] = newPool;
        pool.save(data);
        pool.data = data;

        // add empty array
        pool.saveEntries([], poolID)

        pool.welcomeListNew();
        return poolID;
    },

    saveCurrent: function (poolID) {
        var data = pool.read("oremon-pool-data");
        data.current = poolID;
        pool.data = data;
        pool.save(data);
    },

    save: function (data, key = "oremon-pool-data") {
        localStorage.setItem(key, JSON.stringify(data));
    },

    read: function (key) {
        return JSON.parse(localStorage.getItem(key));
    },

    saveEntries: function (entries, poolID) {
        const poolKey = "oremon-pool-" + poolID;
        pool.save(entries, poolKey);
        pool.data[poolKey] = entries;
    },

    listVariables: function (l) {
        var listItem = { poolID: l, ...pool.data.list[l] };

        // determine the name
        listItem.name = listItem.poolName;
        if (listItem.name == "") {
            listItem.name = listItem.characterName;
        }
        if (listItem.name == "") {
            listItem.name = listItem.poolID;
        }

        // add created date time
        listItem.created = moment.unix(listItem.dateTimeCreated)
            .format(site.dateFormat);

        return listItem;
    },

    // ----- No Data -----

    noData: function () {
        console.log("pool.noData()");
        oremon.loadTemplate("#welcome", user.variables(user.current));
        oremon.loadTemplate("#new-pool", {}, false); // don't empty
    },

    // ----- Found Data -----

    foundData: function () {
        console.log("pool.foundData()");
        if (pool.data.current) {
            pool.view(pool.data.current);
        } else {
            pool.welcomeListNew();
        }
    },

    welcomeListNew: function () {
        oremon.loadTemplate("#welcome", user.variables(user.current));
        pool.list(false); // don't empty
        oremon.loadTemplate("#new-pool", {}, false); // don't empty
    },

    view: function () {
        const current = pool.data.current;
        console.log("pool.view()", current);

        $("#oremon").html("<hr><p>Pool View<br>Pool ID: " + current + "</p>")
    },

    list: function (empty = true) {
        var list = [];
        for (l in pool.data.list) {
            list.push(pool.listVariables(l));
        }

        oremon.loadTemplate("#pool-list", { list }, empty);
    },

    onCreate: function (e) {
        console.log("pool.onCreate()");
        e.stopPropagation();
        e.preventDefault();
        pool.add(pool.naieveFormValues("#new-pool-form"));
    },

    onView: function () {
        var poolID = $(this).data("poolid");
        console.log("pool.onView()", poolID);
        pool.saveCurrent(poolID);
        pool.foundData();
    },

    onList: function () {
        pool.saveCurrent("");
        pool.foundData();
    },

    naieveFormValues: function (selector) {
        var result = {};
        $.each($(selector).serializeArray(), function () {
            result[this.name] = this.value;
        });

        return result;
    }
};
