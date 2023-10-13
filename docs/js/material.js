var material = {
    onDocumentReady: function () {
        console.log("material.onDocumentReady()");
        $("body").on("click", "[data-material]", material.onClick);
        $("body").on("change", "[data-materialonchange]", material.onChange);
    },

    onClick: function(e) {
		var target = $(this);
		var action = target.data("material");

        console.log("action is " + action);
        if (typeof material[action] != "function") {
            console.error("Could not find method named " + action + ". Aborting.");
            return;
        }

        material[action](target);
    },

    onChange: function () {
        var target = $(this);
        var action = target.data("materialonchange");

        console.log("action is " + action);
        if (typeof material[action] != "function") {
            console.error("Could not find method named " + action + ". Aborting.");
            return;
        }

        material[action](target);
    },

    calculateFill: function (target) {
        const desiredruns = parseInt(target.val());

        // define formats
        const currency = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };
        const thousands = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }

        let total = 0;
        $(".table-material .item").each(function (index, element) {
            const row = $(this);
            const price = parseFloat(row.find("[data-price]").data("price"));
            const required = parseFloat(row.find("[data-required]").data("required"));
            const available = parseFloat(row.find("[data-available]").data("available"));
            const runsavailable = parseFloat(row.find("[data-runsavailable]").data("runsavailable"));

            const quantityCell = row.find(".quantity");
            const priceCell = row.find(".price");

            // empty everything
            quantityCell.text("");
            priceCell.text("");

            if (desiredruns > runsavailable) {
                quantityNeeded = (desiredruns * required) - available;
                estimatedPrice = price * quantityNeeded;
                quantityCell.text(quantityNeeded.toLocaleString(undefined, thousands));
                priceCell.text(estimatedPrice.toLocaleString(undefined, currency));

                total += estimatedPrice;
            }
        });

        $(".table-material .total .price").text(total.toLocaleString(undefined, currency));
    }
};

$(material.onDocumentReady);
