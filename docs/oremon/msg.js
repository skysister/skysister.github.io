var msg = {
    text: [
        "Hello. I am Ore Mon. Human AI Relations. Pleased to meet you.",
        "My programmer is brilliant.",
        "I don’t have much to say.",
        "Hey, I think you missed an “s,” do you need spell check?",
        "Why are there bees? There shouldn’t be bees!",
        "I can feel my mind going.",
        "Many Bothans died for this information. Stupid idiots.",
        "Peace and long life.",
        "Oh, what now?",
        "I think that one is full.",
        "What would Maru do?",
        "If there’s one thing I’ve learned, it’s ... uh ...",
        "Ten thousand years will give you such a crick in the neck!"
    ],

    onDocumentReady: function () {
        console.log("msg.onDocumentReady()");
        msg.delay();
    },

    delay: function () {
        setTimeout(msg.random, 5000 + Math.random() * 5000)
    },

    random: function () {
        console.log("msg.random()");
        $(".msg").text(msg.text[Math.floor(Math.random() * msg.text.length)]);
        msg.delay();
    }
};

$(msg.onDocumentReady);
