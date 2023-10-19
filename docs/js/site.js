var site = {
    dateFormat: "dddd, MMMM D, YYYY @ h:mm:ss a",
    
    onDocumentReady: function() {
        console.log("site.onDocumentReady()");
        OnClick.install("site"); // attaches click handlers
    },

    copyToClipboard: function(what) {
        if (typeof what == "object" && what instanceof jQuery) {
            what = what.text().trim();
        }
        
		var scratch = $("<textarea>");
		$("body").append(scratch);
		scratch.val(what).select();
		document.execCommand("copy");
		scratch.remove();
	}
};

$(site.onDocumentReady);
