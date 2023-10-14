const nav = {
    onDocumentReady: function () {
        nav.loadPrimary();
    },

    loadPrimary: function (container = "#nav-primary") {
        $(container).load("/template/nav-primary.html");
    }
};

$(nav.onDocumentReady);
