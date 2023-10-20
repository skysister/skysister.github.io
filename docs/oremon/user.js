var user = {
    // init is called by oremon (index.js)
    init: function () {
        console.log("user.init()");
        OnClick.install("user"); // attaches click handlers

        user.current = localStorage.getItem("oremon-user");
        if (user.current == null) {
            user.notFound();
        } else {
            user.found();
        }
    },

    variables: function (userID) {
        var theUser = oremon.data.user[userID];
        var portraitSrc = user.getPortraitSrc(theUser.eveID);
        return { portraitSrc, userID, ...theUser };
    },

    getPortraitSrc: function (eveID, size = 128) {
        const host = "https://images.evetech.net";
        const path = "characters";
        const type = "portrait?size=" + size;

        return [host, path, eveID, type].join("/");
    },

    // ----- Not Found -----

    notFound: function () {
        console.log("user.notFound()");
        var users = user.list();
        oremon.empty().loadTemplate("#user-list", { users });
    },

    list: function () {
        var list = [];
        for (var u in oremon.data.user) {
            list.push(user.variables(u));
        }

        return list;
    },
    
    onSelect: function () {
        user.select($(this).data("userid"));
    },

    select: function (userID) {
        user.current = user.variables(userID);
        localStorage.setItem("oremon-user", userID);
        user.found();
    },

    // ----- Found -----

    found: function () {
        console.log("user.found()");
        pool.init();
    },
};
