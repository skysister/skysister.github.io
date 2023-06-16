var OnClick = {
    install: function (objName) {
        var target = window[objName];

        // extend functionality into the target
        $.extend(target, {
            onClick: function (e) {
                e.preventDefault();
                e.stopPropagation();

                var targetMethod = $(this).data(objName);
                if (typeof target[targetMethod] == "function") {
                    target[targetMethod].call(this);
                } else {
                    var method = objName + "." + targetMethod;
                    console.info("Aborting. Could not find method " + method + "().");
                }
            }
        });

        // define the selector
        var selector = "[data-" + objName + "]";

        // enable the click listener
        $("body").on("click", selector, target.onClick);

        // add cursor
        $(selector).css("cursor", "pointer");
    },
}
