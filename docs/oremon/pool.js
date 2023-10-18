var pool = {
    init: function () {
        console.log("pool.init()");
        OnClick.install("pool"); // attaches click handlers

        pool.data = localStorage.getItem("oremon-pool-data");
        if (pool.data == null) {
            pool.noData();
        } else {
            pool.foundData();
        }
    },

    noData: function () {
        console.log("pool.noData()");
        oremon.loadTemplate("#welcome", user.variables(user.current));
        oremon.loadTemplate("#new-pool", {}, false); // don't empty
    },

    foundData: function () {
        console.log("pool.foundData()");
    },

    onCreate: function () {
        console.log("pool.onCreate()");
    }
};
