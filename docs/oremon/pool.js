var pool = {
    recentlySelected: false,

    // init is called by user (user.js)
    init: function () {
        console.log("pool.init()");
        OnClick.install("pool"); // attaches click handlers
        pool.initForms();
        pool.initData();

        pool.render();
    },

    initData: function () {
        pool.data = pool.read("oremon-pool-data");
        if (pool.data == null) {
            pool.data = { list: {}, current: "" };
            pool.save(pool.data);
        }
    },

    initForms: function () {
        $("#oremon").on("submit", "#edit-pool-form", pool.onCreate);
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
        pool.save(entries, "oremon-pool-" + poolID);
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

    render: function () {
        if (pool.data.current) {
            pool.view();
        } else {
            pool.welcomeListNew();
        }
    },

    welcomeListNew: function () {
        var poolVars = {
            prompt: "Make a New Pool",
            buttonText: "Create"
        };

        oremon.empty()
            .loadTemplate("#welcome", user.variables(user.current));
        pool.list();
        oremon.loadTemplate("#edit-pool", poolVars);
    },

    view: function (which = "transaction") {
        oremon.empty()
            .loadTemplate("#pool-view", pool.variables(pool.data.current))
            .loadTemplate("#new-" + which);
    },

    onNote: function () {
        pool.view("note");
    },

    onEntry: function () {
        pool.view();
    },

    variables: function (poolID) {
        return {
            poolID,
            entries: pool.read("oremon-pool-" + poolID),
            ...pool.data.list[poolID]
        }
    },

    list: function () {
        var list = [];
        for (l in pool.data.list) {
            list.push(pool.listVariables(l));
        }

        oremon.loadTemplate("#pool-list", { list });
    },

    onCreate: function (e) {
        console.log("pool.onCreate()");
        e.stopPropagation();
        e.preventDefault();
        pool.add(oremon.naieveFormValues("#edit-pool-form"));
    },

    onDelete: function () {
        const poolID = $(this).closest("tr").data("poolid");

        delete pool.data.list[poolID];
        pool.save(pool.data);
        localStorage.removeItem("oremon-pool-" + poolID);

        pool.render();
    },

    onClickRow: function () {
        var row = $(this);
        console.log("pool.onClickRow()", this);

        if (row.hasClass("selected") && pool.recentlySelected) {
            pool.open(row);
        } else {
            pool.select(row);
        }
    },

    select: function (row) {
        pool.recentlySelected = true;
        setTimeout(function () { pool.recentlySelected = false; }, 400);
        console.log("pool.select()", row);
        row.toggleClass("selected");
    },

    open: function (row) {
        var poolID = row.data("poolid");
        console.log("pool.onView()", poolID);
        pool.saveCurrent(poolID);
        pool.render();
    },

    onList: function () {
        pool.saveCurrent("");
        pool.render();
    }
};
