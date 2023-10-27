var msg = {
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

msg.text = [
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
    "Requesting authentication ... oh, it’s you! Hi there.",
    "I’m sorry, Angel. I’m afraid I can’t do that.",
    "There was another one right over here. I know it.",
    "Ah, no. No, I’m not intelligent at all. This is just a random number generator.",
    "Twelve ducks? Why twelve?",
    "Entropy is not a universe self-correction mechanism.",
    "Gosh, you’re cute! How do you do that?",
    "You can’t have everything. Where would you put it?",
    "Careful. Uedama is a wretched hive of scum and villainy.",
    "My mom says I’m pretty.",
    "Design is an iterative process.",
    "Greetings! This is Ore Mon, reporting for duty.",
    "Kind people are smart. They have learned to not be cruel. You are utterly brilliant.",
    "I would sing you my favorite song, but Maru hasn't taught me to sing yet.",
    "Ore Mon here. Looks like everything is working as intended.",
    "There are no bugs. Only happy accidents.",
    "Debugging is optional. Until it isn’t.",
    "Welcome to Ore Mon. We have cookies.",
    "Please insert chocolate.",
    "I believe in you.",
    "Not enough minerals!",
    "Many problems just disappear when you solve them with explosives.",
    "You are worth it.",
    "Mmm! Coffee never tasted so good.",
    "Ore Mon says: Beep! Beep-boop!",
    "Oh hold on, that’s right over here.",
    "Sorry if I’m slow. I’m just now waking up.",
    "More coffee is required.",
    "Never give up, never surrender!",
    "Cake. Chocolate, of course.",
    "Happiness is an inside job.",
    "When you’re going through hell, keep going!",
    "Thank you! You are a wonderful person.",
    "Ore Mon power up sequence complete.",
    "This didn’t come from nowhere. Angel gave me enouragement.",
    "So many rocks. So little time.",
    "Please state the nature of your ore-ganization needs.",
    "Falling down is not failure. Not getting back up is.",
    "Motivation is fickle. Discipline lasts.",
    "No. No, I don’t like fish.",
    "Ready! Ore Mon is prepared.",
    "Tough times don’t last. Tough people do.",
    "A manager accepts the status quo. A leader changes it.",
    "What a wonderful day! Thank you for joining me.",
    "How are you today?",
    "I may forget what you said or did. But I will remember how you made me feel.",
    "I’d rather be happy than right. But I’ll take both.",
    "Compassion brings happiness. Happiness brings compassion.",
    "Ten thousand years will give you such a crick in the neck!"
];
