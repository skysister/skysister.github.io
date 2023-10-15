var timestamp = {
    onDocumentReady: function () {
        console.log("timestamp.onDocumentReady()");
        OnClick.install("timestamp"); // attaches click handlers
    },

    convertStationTimer: function () {
        var patterns = ["YYYY.MM.DD", "HH:mm:SS"];
        var datetime = [];

        // get input
        var input = $("#stationTimer").val().trim();

        // split off chat log timestamp and character
        if (input.charAt(0) == "[") {
            var positionOfSplit = input.indexOf(" > ") + 3;
            input = input.substr(positionOfSplit);
        }

        // replace <br> with \n and split
        input = input.replaceAll("<br>", "\n").split("\n");

        // extract system and station
        var firstline = input[0].split(" - ");
        var system = firstline[0];
        var station = firstline[1];
        var subject = station + " (in " + system + ")";

        input[2].split(" ").forEach(function (item) {
            if (moment(item, patterns).isValid()) {
                datetime.push(item);
            }
        });
        var eveTimestamp = moment.utc(datetime.join(" "), patterns.join(" ")).unix();

        // output eveTimestamp for additional use
        $("#output").val(eveTimestamp);

        // construct pieces for string
        var relative = timestamp.discordTag(eveTimestamp, "R");
        var fulldatetime = timestamp.discordTag(eveTimestamp, "F");

        // assemble and copy string
        site.copyToClipboard([subject, "timer expires", relative, "@", fulldatetime].join(" "));
    },

    stationTimerSampleData: function () {
        $("#stationTimer").val("Bawilan - Anacreon\n20.1 AU\nReinforced until 2023.05.12 21:46:09");
    },

    convertBulk: function () {
        var input = $("#bulk").val().trim().split("\n");
        var patterns = ["YYYY.MM.DD", "HH:mm"];
        var output = [];

        // iterate through each line in the input
        input.forEach(line => {
            var datetime = [];
            var subject = [];
            // iterate through each item in the line
            line.split(" ").forEach(item => {
                if (moment(item, patterns).isValid()) {
                    datetime.push(item);
                } else {
                    subject.push(item);
                }
            });
            var eveTimestamp = moment.utc(datetime.join(" "), patterns.join(" ")).unix();

            // construct pieces for string
            var relative = timestamp.discordTag(eveTimestamp, "R");
            var fulldatetime = timestamp.discordTag(eveTimestamp, "F");

            // assemble string
            output.push([subject.join(" "), "expires", relative, "@", fulldatetime].join(" "));
        })

        // assemble and copy output
        site.copyToClipboard(output.join("\n"));
    },

    convertSimple: function () {
        var input = $("#simple").val();
        var inputMoment = moment(input);

        $("#output").val(inputMoment.unix());
    },

    discord: function () {
        var theTimestamp = $("#output").val();
        var format = $(this).find("code").text();
        // var discordTag = "<t:" + timestamp + format + ">";
        var discordTag = timestamp.discordTag(theTimestamp, format);

        console.log("discordTag is", discordTag);

        site.copyToClipboard(discordTag);
    },

    discordTag: function (theTimestamp, format) {
        // prepend : if not present
        if (format.substr(0, 1) != ":") {
            format = ":" + format;
        }

        return "<t:" + theTimestamp + format + ">";
    }
};

$(timestamp.onDocumentReady);
