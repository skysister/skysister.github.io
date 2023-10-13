var material = {
    onDocumentReady: function () {
        console.log("material.onDocumentReady()");
        OnClick.install("material"); // attaches click handlers
        $("body").on("change", "[data-materialonchange]", material.onChange);
    },

    onAnalyze: function () {
        var input = $("#materialInput").val();
        console.log(input);

        var parsed = material.parse(input);
        console.log("parsed", parsed);
        var calculated = material.calculate(parsed);
        console.log("calculated", calculated);
        var analysis = material.analyze(calculated);
        console.log("analysis", analysis);
    },

    onDismiss: function() {
        $("#materialInput").val("");
        $("#material-ui").show();
        $("#material-output").hide();
    },

    parse: function (input) {
        // split into an array of lines, filtering out empties
        var lines = input.split("\n").filter(line => line.trim() != "");

        // group lines by section
        var parsed = [];
        for (var line of lines) {
            line = line.trim();
            var tabs = line.split("\t").length - 1;
            var current;
            var header;

            // add section every time a line has no tabs
            if (tabs == 0) {
                current = parsed.length;
                parsed.push({name: line, data: []});
                header = null;
                continue; // next line
            }

            // if there is no header, use this line
            if (tabs > 0 && header == null) {
                header = material.parseLine(line);
                continue; // next line
            }

            // otherwise, it's data
            parsed[current].data.push(material.parseLine(line, header));
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
        for (var s in sections) {
            for (var i in sections[s].data) {
                var item = sections[s].data[i];
                sections[s].data[i]["Runs Available"] = item.Available / item.Required;
            }
        }

        return sections;
    },

    analyze: function (sections) {
        var least = null;
        var most = null;

        for (var s in sections) {
            for (var i in sections[s].data) {
                var item = sections[s].data[i];
                sections[s].data[i].classes = [];
                if (least == null || item["Runs Available"] < least.value) {
                    least = { s, i, value: item["Runs Available"] };
                }
                if (most == null || item["Runs Available"] > most.value) {
                    most = { s, i, value: item["Runs Available"] };
                }
            }
        }

        sections[least.s].data[least.i].classes.push("item-least-runs");
        sections[most.s].data[most.i].classes.push("item-most-runs");

        return sections;
    },

    format: function (sections) {
        for (var s in sections) {
            for (var i in sections[s].data) {
                var item = sections[s].data[i];
                sections[s].data[i].EstUnitPrice = item["Est. Unit price"];
                sections[s].data[i].FormattedRuns = Math.floor(item.Runs).toLocaleString();
                sections[s].data[i].FormattedAvailable = Number(item.Available).toLocaleString();
                sections[s].data[i].FormattedRequired = Number(item.Required).toLocaleString();
            }
        }

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
