var user = {
    // init is called by oremon (index.js)
    init: function () {
        console.log("user.init()");
        if (localStorage.getItem("oremon-user") == null) {
            user.notFound();
        } else {
            user.found();
        }
    },

    notFound: function () {
        console.log("user.notFound()");
    },

    found: function () {
        console.log("user.found()");
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
    }
};
