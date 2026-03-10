class NPC extends Entity {
    constructor(data) {
        super(data.x, data.y, data.spriteId);
        this.id = data.id;
        this.dialogueId = data.dialogue;
        this.trainerId = data.trainerId || null;
        this.direction = data.direction || DIR.DOWN;
    }

    interact() {
        // Face the player
        const px = Game.player.gridX;
        const py = Game.player.gridY;
        if (px < this.gridX) this.direction = DIR.LEFT;
        else if (px > this.gridX) this.direction = DIR.RIGHT;
        else if (py < this.gridY) this.direction = DIR.UP;
        else if (py > this.gridY) this.direction = DIR.DOWN;

        // If trainer already defeated, show post-battle dialogue
        if (this.trainerId && Game.defeatedTrainers[this.trainerId]) {
            const postDialogue = DIALOGUES[this.dialogueId + '_defeated'];
            if (postDialogue) {
                GameAudio.sfx.confirm();
                DialogueSystem.start(postDialogue);
                return;
            }
        }

        // Start dialogue
        const dialogue = DIALOGUES[this.dialogueId];
        if (dialogue) {
            GameAudio.sfx.confirm();
            DialogueSystem.start(dialogue);
        }
    }
}

// Dialogue data for all NPCs
const DIALOGUES = {
    stoick_intro: [
        { text: "Welcome to Berk, young\nViking! Our island has\nbeen overrun by dragons." },
        { text: "But I've heard some\nfolks have learned to\ntame them instead!" },
        { text: "Head into the forest\nand see if you can\nbefriend one." },
        { text: "Be careful though!\nYou can only keep two\ndragons with you." },
    ],
    healer_talk: [
        { text: "Your dragons look\ntired from battle." },
        { text: "Let me heal them\nfor you..." },
        { action: 'healParty' },
        { text: "There! Your dragons\nare fully healed!" },
    ],
    trader_talk: [
        { text: "Looking for dragon\ntaming supplies?" },
        { text: "The best way to tame\na dragon is to weaken\nit first in battle." },
        { text: "Then use TAME when\nits health is low.\nGood luck!" },
    ],
    elder_talk: [
        { text: "I've studied dragons\nfor many years..." },
        { text: "There are four types:\nFire, Ice, Lightning,\nand Earth." },
        { text: "Fire beats Ice,\nIce beats Lightning,\nLightning beats Earth." },
        { text: "And Earth beats Fire.\nRemember this in\nbattle!" },
    ],
    forest_guide: [
        { text: "This forest is full\nof wild dragons!" },
        { text: "Walk through the\ntall grass and you\nmay encounter one." },
        { text: "Terrible Terrors are\ncommon here. Good for\nbeginners!" },
    ],
    mountain_guide: [
        { text: "The mountain pass is\ntreacherous!" },
        { text: "Deadly Nadders and\nRazorwhips live here.\nThey're tough!" },
    ],
    cave_guide: [
        { text: "These volcanic caves\nare incredibly hot!" },
        { text: "Monstrous Nightmares\nand Fireworm Queens\nlurk in the darkness." },
    ],
    hidden_guide: [
        { text: "You found the\nHidden World!" },
        { text: "The rarest dragons\nlive here: Night\nFuries and Light Furies." },
        { text: "They're nearly\nimpossible to tame.\nBut try your best!" },
    ],
    sanctuary_guide: [
        { text: "This is the Dragon\nSanctuary. Only the\nbravest reach here." },
        { text: "The great Stormcutter\nroams these meadows." },
    ],
    berk_child: [
        { text: "Have you seen\na Night Fury?!" },
        { text: "They say they're\nthe fastest dragons\nalive!" },
    ],
    dock_fisherman: [
        { text: "I sail between the\nislands. The sea is\nfull of dangers!" },
        { text: "If you see a path\nleading off the edge\nof town, follow it!" },
    ],
    gobber_forge: [
        { text: "Welcome to the forge!\nI'm Gobber, the best\nblacksmith on Berk!" },
        { text: "Bring me materials\nand I'll craft you\nsome dragon saddles." },
        { text: "Dragon Scales, Iron,\nand Leather - find\nthem on your travels!" },
        { action: 'openForge' },
    ],
    flight_tutorial: [
        { text: "Press F to toggle\nflight mode when you\nhave a dragon!" },
        { text: "In the sky, you can\nfly over trees and\nwater freely." },
        { text: "Look for cloud banks\nwhere rare dragons\nhide in the sky!" },
        { text: "Wind currents will\npush you along -\nuse them wisely!" },
    ],

    // Dragon Sanctuary Keeper
    sanctuary_keeper: [
        { text: "Welcome to the Dragon\nSanctuary stables!" },
        { text: "I can look after your\nextra dragons while\nyou're adventuring." },
        { action: 'openSanctuary' },
    ],

    // --- TRAINER DIALOGUES ---
    trainer_snotlout: [
        { text: "Hey! Think you're\ntough? My Nightmare\nwill crush you!" },
        { action: { type: 'trainerBattle', trainer: {
            id: 'snotlout', name: 'Snotlout',
            party: [
                { speciesId: 'monstrous_nightmare', level: 8 },
            ],
            postDialogue: [
                { text: "No way! My Nightmare\nlost?! You got lucky!" },
            ],
        }}},
    ],
    trainer_snotlout_defeated: [
        { text: "I'm still tougher\nthan you... I just\nlet you win!" },
    ],

    trainer_astrid: [
        { text: "A true Viking must\nprove their strength\nin dragon combat!" },
        { text: "My Nadder and I\nwon't hold back!" },
        { action: { type: 'trainerBattle', trainer: {
            id: 'astrid', name: 'Astrid',
            party: [
                { speciesId: 'deadly_nadder', level: 10 },
                { speciesId: 'razorwhip', level: 9 },
            ],
            postDialogue: [
                { text: "Impressive! You've\nearned my respect." },
                { text: "Keep training hard.\nThe Dragon Sanctuary\nawaits the bravest!" },
            ],
        }}},
    ],
    trainer_astrid_defeated: [
        { text: "You've proven your\nworth. Stay sharp\nout there!" },
    ],

    trainer_tuffnut: [
        { text: "My Zippleback has\nTWO heads! That's\ntwice the trouble!" },
        { action: { type: 'trainerBattle', trainer: {
            id: 'tuffnut', name: 'Tuffnut',
            party: [
                { speciesId: 'hideous_zippleback', level: 7 },
                { speciesId: 'terrible_terror', level: 6 },
            ],
            postDialogue: [
                { text: "Aww man! Two heads\nand we still lost!" },
            ],
        }}},
    ],
    trainer_tuffnut_defeated: [
        { text: "My Zippleback isn't\nfeeling well today.\nNo rematch!" },
    ],

    trainer_eret: [
        { text: "I used to trap\ndragons for Drago.\nNow I train them." },
        { text: "Let me show you\nwhat a real dragon\nmaster can do!" },
        { action: { type: 'trainerBattle', trainer: {
            id: 'eret', name: 'Eret',
            party: [
                { speciesId: 'gronckle', level: 12 },
                { speciesId: 'monstrous_nightmare', level: 14 },
            ],
            postDialogue: [
                { text: "Ha! Well fought!\nYou've got the heart\nof a true rider." },
            ],
        }}},
    ],
    trainer_eret_defeated: [
        { text: "You're a natural.\nDrago himself would\nbe impressed!" },
    ],

    trainer_valka: [
        { text: "I've lived among\ndragons for twenty\nyears..." },
        { text: "My Stormcutter and\nI share a bond\ndeeper than words." },
        { text: "Show me what your\ndragons can do!" },
        { action: { type: 'trainerBattle', trainer: {
            id: 'valka', name: 'Valka',
            party: [
                { speciesId: 'stormcutter', level: 16 },
                { speciesId: 'fireworm', level: 14 },
            ],
            postDialogue: [
                { text: "Remarkable! Your\nbond with your\ndragons is strong." },
                { text: "You remind me of\nmy son, Hiccup.\nKeep going!" },
            ],
        }}},
    ],
    trainer_valka_defeated: [
        { text: "The bond between\nyou and your dragons\ngrows stronger." },
    ],

    trainer_drago: [
        { text: "So you dare face\nDrago Bludvist?" },
        { text: "I am the Dragon\nGod! No one can\nstand against me!" },
        { action: { type: 'trainerBattle', trainer: {
            id: 'drago', name: 'Drago',
            party: [
                { speciesId: 'monstrous_nightmare', level: 18 },
                { speciesId: 'night_fury', level: 20 },
            ],
            postDialogue: [
                { text: "Impossible! My\ndragons... defeated?!" },
                { text: "You are the true\nDragon Master.\nI yield." },
            ],
        }}},
    ],
    trainer_drago_defeated: [
        { text: "...You have proven\nyourself. I will\nnot forget this." },
    ],
};
