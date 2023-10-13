var material = {
    onDocumentReady: function () {
        console.log("material.onDocumentReady()");
        OnClick.install("material"); // attaches click handlers
        $("body").on("change", "[data-materialonchange]", material.onChange);
    },

    onConvert: function () {
        var input = $("#materialInput").val();
        console.log(input);

        var parsed = material.parse(input);
        console.log("parsed", parsed);
        var calculated = material.calculate(parsed);
        var analysis = material.analyze(calculated);
    },

    parse: function (input) {
        // split into an array of lines, filtering out empties
        var lines = input.split("\n").filter(line => line.trim() != "");

        // group lines by section
        var parsed = {};
        for (var line of lines) {
            line = line.trim();
            var tabs = line.split("\t").length - 1;
            var current;
            var header;

            // add section every time a line has no tabs
            if (tabs == 0) {
                parsed[line] = [];
                current = line;
                header = null;
                continue; // next line
            }

            // if there is no header, use this line
            if (tabs > 0 && header == null) {
                header = material.parseLine(line);
                continue; // next line
            }

            // otherwise, it's data
            parsed[current].push(material.parseLine(line, header));
        }

        return parsed;
    },

    parseLine: function (line, keys = null) {
        // split the line by tabs
        line = line.split("\t");

        if (keys != null) {
            var lineObj = {};
            for (var l = 0; l < line.length; l++) {
                lineObj[keys[l]] = line[l];
            }
            line = lineObj;
        }

        return line;
    },

    calculate: function (sections) {
        return sections;
    },

    analyze: function (sections) {
        return sections;
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
