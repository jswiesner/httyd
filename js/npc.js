class NPC extends Entity {
    constructor(data) {
        super(data.x, data.y, data.spriteId);
        this.id = data.id;
        this.dialogueId = data.dialogue;
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
};
