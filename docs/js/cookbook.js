var cookbook = {
    onDocumentReady: function () {
        console.log("cookbook.onDocumentReady()");
        OnClick.install("cookbook"); // attaches click handlers
        $("body").on("change", "[data-cookbookonchange]", cookbook.onChange);
    },

    onChange: function () {
        var target = $(this);
        var action = target.data("cookbookonchange");

        console.log("action is " + action);
        if (typeof cookbook[action] != "function") {
            console.error("Could not find method named " + action + ". Aborting.");
            return;
        }

        cookbook[action](target);
    }
};

$(cookbook.onDocumentReady);
