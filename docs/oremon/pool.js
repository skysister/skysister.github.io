var pool = {
    init: function () {
        console.log("pool.init()");
        OnClick.install("pool"); // attaches click handlers

        pool.data = pool.read("oremon-pool-data");
        if (pool.data) {
            pool.foundData();
        } else {
            pool.noData();
        }
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

        pool.show();
        return poolID;
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

    // ----- No Data -----

    noData: function () {
        console.log("pool.noData()");
        oremon.loadTemplate("#welcome", user.variables(user.current));
        oremon.loadTemplate("#new-pool", {}, false); // don't empty
    },

    // ----- Found Data -----

    foundData: function () {
        console.log("pool.foundData()");
        pool.show();
    },

    show: function () {
        oremon.loadTemplate("#welcome", user.variables(user.current));
        pool.list(false); // don't empty
        oremon.loadTemplate("#new-pool", {}, false); // don't empty
    },

    list: function (empty = true) {
        var list = [];
        for (l in pool.data.list) {
            var listItem = { poolID: l, ...pool.data.list[l] };
            listItem.name = listItem.poolName;
            if (listItem.name == "") {
                listItem.name = listItem.characterName;
            }
            if (listItem.name == "") {
                listItem.name = listItem.poolID;
            }
            list.push(listItem);
        }

        oremon.loadTemplate("#pool-list", { list }, empty);
    },

    onCreate: function () {
        console.log("pool.onCreate()");
        pool.add(pool.naieveFormValues("#new-pool-form"));
    },

    naieveFormValues: function (selector) {
        var result = {};
        $.each($(selector).serializeArray(), function () {
            result[this.name] = this.value;
        });

        return result;
    }
};
