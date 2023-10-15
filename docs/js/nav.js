const nav = {
    onDocumentReady: function () {
        nav.loadPrimary();
        nav.loadFooter();
    },

    loadPrimary: function (container = "#nav-primary") {
        $(container).load("/template/nav-primary.html");
    },

    loadFooter: function (container = "#nav-footer") {
        $(container).load("/template/nav-footer.html");
    }
};

$(nav.onDocumentReady);
