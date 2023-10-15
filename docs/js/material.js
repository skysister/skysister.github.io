var material = {
    onDocumentReady: function () {
        console.log("material.onDocumentReady()");
        OnClick.install("material"); // attaches click handlers
        $("body").on("change", "[data-materialonchange]", material.onChange);
    },

    onAnalyze: function () {
        var input = $("#materialInput").val();

        var parsed = material.parse(input);
        var calculated = material.calculate(parsed);
        var analyzed = material.analyze(calculated);
        var formatted = material.format(analyzed);

        // output
        $("#material-output .report").empty()
            .append(Mustache.render(
                $("#material-report").html(), { sections: formatted }
            ));
        
        // prepared
        $(".output-date").text(moment().format("dddd, MMMM D, YYYY @ h:mm:ss a"));

        // toggle view
        $("#material-ui").hide();
        $("#material-output").show();
    },

    onSampleData: function() {
        $("#materialInput").val("Planetary materials				\nItem	Required	Available	Est. Unit price	typeID\nRobotics	2	3132	92305.71	9848\nEnriched Uranium	8	16	11280.52	44\nMechanical Parts	8	1878	10820.12	3689\nCoolant	17	5084	10635.38	9832\nOxygen	40	55455	626.62	3683\n\nMinerals				\nItem	Required	Available	Est. Unit price	typeID\nStrontium Clathrates	36	38860	2709.54	16275\nHeavy Water	303	3361493	135.94	16272\nLiquid Ozone	624	2194669	118.52	16273\nOxygen Isotopes	802	9300367	558.38	17887\n\n");
    },

    onDismiss: function () {
        // empty input
        $("#materialInput").val("");

        // toggle view
        $("#material-ui").show();
        $("#material-output").hide();
    },

    parse: function (input) {
        // split into an array of lines, filtering out empties
        var lines = input.split(/\r?\n/).filter(line => line.trim() != "");

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
                parsed.push({ name: line, data: [] });
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
                sections[s].data[i].Runs = item.Available / item.Required;
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
                if (least == null || item.Runs < least.value) {
                    least = { s, i, value: item.Runs };
                }
                if (most == null || item.Runs > most.value) {
                    most = { s, i, value: item.Runs };
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

        sections[0].showCalculateFill = true;

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
            const runs = parseFloat(row.find("[data-runs]").data("runs"));

            const quantityCell = row.find(".quantity");
            const priceCell = row.find(".price");

            // empty everything
            quantityCell.text("");
            priceCell.text("");

            if (desiredruns > runs) {
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
