const BattleEngine = {
    playerDragon: null,
    enemyDragon: null,
    phase: null,
    textQueue: [],
    currentText: '',
    textTimer: 0,
    animTimer: 0,
    selectedAction: 0,
    selectedMove: 0,
    tameAttempts: 0,
    shakeCount: 0,
    shakeTimer: 0,
    playerDragonIndex: 0,
    turnOrder: null,
    pendingPlayerMove: null,
    switchIndex: -1,
    releaseIndex: -1,
    isTrainerBattle: false,
    trainerName: '',
    trainerPostDialogue: null,
    trainerParty: null,
    trainerPartyIndex: 0,

    start(wildDragon) {
        this.enemyDragon = wildDragon;
        this.isTrainerBattle = false;
        this.trainerName = '';
        this.trainerPostDialogue = null;
        this.trainerParty = null;
        this.trainerPartyIndex = 0;
        this._initPlayerDragon();
        this.showText('A wild ' + this.enemyDragon.species.name + ' appeared!', BattlePhase.MENU);
    },

    startTrainer(trainerData) {
        this.isTrainerBattle = true;
        this.trainerName = trainerData.name;
        this._currentTrainerId = trainerData.id || null;
        this.trainerPostDialogue = trainerData.postDialogue || null;
        this.trainerParty = trainerData.party.map(d => createDragonInstance(d.speciesId, d.level));
        this.trainerPartyIndex = 0;
        this.enemyDragon = this.trainerParty[0];
        this._initPlayerDragon();
        this.showText(this.trainerName + ' challenges\nyou to a battle!', BattlePhase.TEXT);
        this._nextPhase = BattlePhase.TEXT;
        // Queue the dragon intro text
        this._trainerIntroQueued = true;
    },

    _initPlayerDragon() {
        this.playerDragonIndex = 0;
        for (let i = 0; i < Game.player.party.length; i++) {
            if (Game.player.party[i].currentHp > 0) {
                this.playerDragonIndex = i;
                break;
            }
        }
        this.playerDragon = Game.player.party[this.playerDragonIndex];
        this.tameAttempts = 0;
        this.selectedAction = 0;
        this.selectedMove = 0;
        this.switchIndex = -1;
        this.textQueue = [];
    },

    showText(text, nextPhase) {
        this.phase = BattlePhase.TEXT;
        this.currentText = '';
        this._fullText = text;
        this._textCharIndex = 0;
        this._textCharTimer = 0;
        this._nextPhase = nextPhase;
        this._textDone = false;
    },

    update(dt) {
        switch (this.phase) {
            case BattlePhase.TEXT:
                this.updateText(dt);
                break;
            case BattlePhase.MENU:
                this.updateMenu();
                break;
            case BattlePhase.MOVE_SELECT:
                this.updateMoveSelect();
                break;
            case BattlePhase.PLAYER_TURN:
                this.executePlayerTurn();
                break;
            case BattlePhase.ENEMY_TURN:
                this.executeEnemyTurn();
                break;
            case BattlePhase.CHECK:
                this.checkBattleEnd();
                break;
            case BattlePhase.TAME_ATTEMPT:
                this.updateTameAttempt(dt);
                break;
            case BattlePhase.TAME_SUCCESS:
                this.updateTameSuccess();
                break;
            case BattlePhase.PARTY_FULL:
                this.updatePartyFull();
                break;
            case BattlePhase.VICTORY:
                this.updateVictory();
                break;
            case BattlePhase.DEFEAT:
                this.updateDefeat();
                break;
            case BattlePhase.RUN:
                this.updateRun();
                break;
        }
    },

    updateText(dt) {
        if (!this._textDone) {
            this._textCharTimer += dt;
            while (this._textCharTimer >= 0.03 && this._textCharIndex < this._fullText.length) {
                this._textCharIndex++;
                this.currentText = this._fullText.substring(0, this._textCharIndex);
                this._textCharTimer -= 0.03;
            }
            if (this._textCharIndex >= this._fullText.length) {
                this._textDone = true;
            }
            if (Input.confirm()) {
                this.currentText = this._fullText;
                this._textCharIndex = this._fullText.length;
                this._textDone = true;
            }
        } else {
            if (Input.confirm()) {
                if (this._trainerIntroQueued) {
                    this._trainerIntroQueued = false;
                    this.showText(this.trainerName + ' sends out\n' + this.enemyDragon.species.name + '!', BattlePhase.MENU);
                    return;
                }
                this.phase = this._nextPhase;
            }
        }
    },

    updateMenu() {
        // Navigate 2x2 menu: FIGHT, TAME, DRAGON, RUN
        if (Input.wasPressed('arrowup') || Input.wasPressed('w')) {
            if (this.selectedAction >= 2) { this.selectedAction -= 2; GameAudio.sfx.select(); }
        }
        if (Input.wasPressed('arrowdown') || Input.wasPressed('s')) {
            if (this.selectedAction < 2) { this.selectedAction += 2; GameAudio.sfx.select(); }
        }
        if (Input.wasPressed('arrowleft') || Input.wasPressed('a')) {
            if (this.selectedAction % 2 === 1) { this.selectedAction--; GameAudio.sfx.select(); }
        }
        if (Input.wasPressed('arrowright') || Input.wasPressed('d')) {
            if (this.selectedAction % 2 === 0) { this.selectedAction++; GameAudio.sfx.select(); }
        }

        if (Input.confirm()) {
            GameAudio.sfx.confirm();
            switch (this.selectedAction) {
                case 0: // FIGHT
                    this.selectedMove = 0;
                    this.phase = BattlePhase.MOVE_SELECT;
                    break;
                case 1: // TAME
                    if (this.isTrainerBattle) {
                        this.showText("Can't tame a\ntrainer's dragon!", BattlePhase.MENU);
                    } else {
                        this.attemptTame();
                    }
                    break;
                case 2: // DRAGON (switch)
                    if (Game.player.party.length > 1) {
                        const otherIdx = this.playerDragonIndex === 0 ? 1 : 0;
                        if (Game.player.party[otherIdx].currentHp > 0) {
                            this.playerDragonIndex = otherIdx;
                            this.playerDragon = Game.player.party[this.playerDragonIndex];
                            this.showText('Go, ' + this.playerDragon.species.name + '!', BattlePhase.ENEMY_TURN);
                        } else {
                            this.showText('That dragon has\nno energy left!', BattlePhase.MENU);
                        }
                    } else {
                        this.showText('No other dragons\nin your party!', BattlePhase.MENU);
                    }
                    break;
                case 3: // RUN
                    if (this.isTrainerBattle) {
                        this.showText("Can't run from\na trainer battle!", BattlePhase.MENU);
                    } else {
                        this.attemptRun();
                    }
                    break;
            }
        }
    },

    updateMoveSelect() {
        const moves = this.playerDragon.moves;
        if (Input.wasPressed('arrowup') || Input.wasPressed('w')) {
            if (this.selectedMove > 0) { this.selectedMove--; GameAudio.sfx.select(); }
        }
        if (Input.wasPressed('arrowdown') || Input.wasPressed('s')) {
            if (this.selectedMove < moves.length - 1) { this.selectedMove++; GameAudio.sfx.select(); }
        }
        if (Input.cancel()) {
            this.phase = BattlePhase.MENU;
            GameAudio.sfx.cancel();
            return;
        }
        if (Input.confirm()) {
            const move = moves[this.selectedMove];
            if (move.currentPp <= 0) {
                this.showText('No PP left for\nthat move!', BattlePhase.MOVE_SELECT);
                return;
            }
            GameAudio.sfx.confirm();
            this.pendingPlayerMove = move;
            // Determine turn order by speed
            if (this.playerDragon.stats.speed >= this.enemyDragon.stats.speed) {
                this.phase = BattlePhase.PLAYER_TURN;
            } else {
                this.phase = BattlePhase.ENEMY_TURN;
                this.turnOrder = 'enemy_first';
            }
        }
    },

    executePlayerTurn() {
        const move = this.pendingPlayerMove;
        this.pendingPlayerMove = null;
        move.currentPp--;
        const moveData = MOVES[move.id];
        const damage = this.calcDamage(this.playerDragon, this.enemyDragon, moveData);
        const hit = Math.random() * 100 < moveData.accuracy;

        if (hit) {
            this.enemyDragon.currentHp = Math.max(0, this.enemyDragon.currentHp - damage);
            GameAudio.sfx.hit();
            const effectiveness = this.getTypeMultiplier(moveData.type, this.enemyDragon.species.type);
            let extra = '';
            if (effectiveness > 1) extra = '\nIt\'s super effective!';
            else if (effectiveness < 1) extra = '\nNot very effective...';
            const skipEnemyTurn = this.turnOrder === 'enemy_first' || this.enemyDragon.currentHp <= 0;
            this.showText(this.playerDragon.species.name + '\nused ' + moveData.name + '!' + extra,
                skipEnemyTurn ? BattlePhase.CHECK : BattlePhase.ENEMY_TURN);
        } else {
            this.showText(this.playerDragon.species.name + '\nused ' + moveData.name + '\nbut missed!',
                this.turnOrder === 'enemy_first' ? BattlePhase.CHECK : BattlePhase.ENEMY_TURN);
        }
        this.turnOrder = null;
    },

    executeEnemyTurn() {
        // AI: pick a move
        const moves = this.enemyDragon.moves.filter(m => m.currentPp > 0);
        if (moves.length === 0) {
            this.showText(this.enemyDragon.species.name + '\nhas no moves left!', BattlePhase.CHECK);
            return;
        }

        // Weighted selection: prefer stronger moves
        let selectedMove;
        if (Math.random() < 0.7) {
            // Pick strongest
            selectedMove = moves.reduce((best, m) => MOVES[m.id].power > MOVES[best.id].power ? m : best, moves[0]);
        } else {
            selectedMove = moves[Math.floor(Math.random() * moves.length)];
        }

        selectedMove.currentPp--;
        const moveData = MOVES[selectedMove.id];
        const damage = this.calcDamage(this.enemyDragon, this.playerDragon, moveData);
        const hit = Math.random() * 100 < moveData.accuracy;

        if (hit) {
            this.playerDragon.currentHp = Math.max(0, this.playerDragon.currentHp - damage);
            GameAudio.sfx.hit();
            const canPlayerAct = this.pendingPlayerMove && this.playerDragon.currentHp > 0;
            this.showText('Wild ' + this.enemyDragon.species.name + '\nused ' + moveData.name + '!',
                canPlayerAct ? BattlePhase.PLAYER_TURN : BattlePhase.CHECK);
        } else {
            this.showText('Wild ' + this.enemyDragon.species.name + '\nused ' + moveData.name + '\nbut missed!',
                this.pendingPlayerMove ? BattlePhase.PLAYER_TURN : BattlePhase.CHECK);
        }
        if (!this.pendingPlayerMove) {
            // Enemy went second
        } else {
            // Enemy went first, player goes next
            this.turnOrder = 'enemy_first';
        }
    },

    calcDamage(attacker, defender, move) {
        const level = attacker.level;
        const atk = attacker.stats.attack;
        let def = defender.stats.defense;
        const power = move.power;
        const base = Math.floor(((2 * level / 5 + 2) * power * atk / def) / 50 + 2);
        const random = 0.85 + Math.random() * 0.15;
        let typeMultiplier = this.getTypeMultiplier(move.type, DRAGON_SPECIES[defender.speciesId].type);

        // Weather power boost
        if (typeof WeatherSystem !== 'undefined') {
            const weatherBoost = WeatherSystem.getTypePowerBoost(move.type);
            typeMultiplier *= weatherBoost;
        }

        // Saddle: Lead-Lined gives lightning immunity to defender
        if (Inventory.hasSaddleEffect(defender, 'lightning_immune') && move.type === 'lightning') {
            return 0;
        }

        return Math.max(1, Math.floor(base * random * typeMultiplier));
    },

    getTypeMultiplier(atkType, defType) {
        if (TYPE_CHART[atkType] && TYPE_CHART[atkType][defType] !== undefined) {
            return TYPE_CHART[atkType][defType];
        }
        return 1;
    },

    attemptTame() {
        this.tameAttempts++;
        const hpRatio = this.enemyDragon.currentHp / this.enemyDragon.maxHp;
        const baseTameChance = this.enemyDragon.species.tameDifficulty;
        const chance = baseTameChance * (1 - hpRatio * 0.7) * (1 + this.tameAttempts * 0.1);

        this.showText('You attempt to\ntame the ' + this.enemyDragon.species.name + '...', BattlePhase.TAME_ATTEMPT);
        this._tameSuccess = Math.random() < chance;
        this.shakeCount = 0;
        this.shakeTimer = 0;
    },

    updateTameAttempt(dt) {
        this.shakeTimer += dt;
        if (this.shakeTimer > 0.5) {
            this.shakeTimer = 0;
            this.shakeCount++;
            GameAudio.sfx.tameShake();

            if (this.shakeCount >= 3) {
                if (this._tameSuccess) {
                    GameAudio.sfx.tameSuccess();
                    if (Game.player.party.length < MAX_PARTY) {
                        Game.player.addToParty(this.enemyDragon);
                        this.showText('You tamed the\n' + this.enemyDragon.species.name + '!', BattlePhase.VICTORY);
                    } else {
                        this.showText('You tamed the\n' + this.enemyDragon.species.name + '!\nBut your party is full!', BattlePhase.PARTY_FULL);
                    }
                } else {
                    GameAudio.sfx.tameFail();
                    this.showText('The ' + this.enemyDragon.species.name + '\nbroke free!', BattlePhase.ENEMY_TURN);
                    this.pendingPlayerMove = null;
                }
            }
        }
    },

    updateTameSuccess() {
        // Battle ends
        if (Input.confirm()) {
            this.endBattle();
        }
    },

    updatePartyFull() {
        // Show options: Release a dragon, Send to Sanctuary, or Cancel
        this.currentText = 'Party full! What now?\n';
        const options = [];
        for (let i = 0; i < Game.player.party.length; i++) {
            options.push('Release ' + Game.player.party[i].species.name);
        }
        if (Sanctuary.stored.length < Sanctuary.maxStorage) {
            options.push('Send to Sanctuary');
        }
        options.push('Cancel');

        // releaseIndex: 0..party.length-1 = release, party.length = sanctuary, last = cancel
        const sanctuaryIdx = Sanctuary.stored.length < Sanctuary.maxStorage ? Game.player.party.length : -1;
        const cancelIdx = sanctuaryIdx >= 0 ? sanctuaryIdx + 1 : Game.player.party.length;

        for (let i = 0; i < options.length; i++) {
            const prefix = i === this.releaseIndex ? '> ' : '  ';
            this.currentText += prefix + options[i] + '\n';
        }
        this._textDone = true;

        if (Input.wasPressed('arrowup') || Input.wasPressed('w')) {
            this.releaseIndex--;
            if (this.releaseIndex < 0) this.releaseIndex = options.length - 1;
            GameAudio.sfx.select();
        }
        if (Input.wasPressed('arrowdown') || Input.wasPressed('s')) {
            this.releaseIndex++;
            if (this.releaseIndex >= options.length) this.releaseIndex = 0;
            GameAudio.sfx.select();
        }
        if (Input.confirm()) {
            if (this.releaseIndex >= 0 && this.releaseIndex < Game.player.party.length) {
                // Release a party dragon and add tamed one
                const released = Game.player.party[this.releaseIndex];
                Game.player.removeFromParty(this.releaseIndex);
                Game.player.addToParty(this.enemyDragon);
                GameAudio.sfx.confirm();
                this.showText('Released ' + released.species.name + '.\n' + this.enemyDragon.species.name + '\njoined your party!', BattlePhase.VICTORY);
            } else if (this.releaseIndex === sanctuaryIdx) {
                // Send tamed dragon to sanctuary
                Sanctuary.storeDirectly(this.enemyDragon);
                GameAudio.sfx.confirm();
                this.showText(this.enemyDragon.species.name + ' was\nsent to the Dragon\nSanctuary!', BattlePhase.VICTORY);
            } else {
                // Cancel
                this.showText('You let the\n' + this.enemyDragon.species.name + ' go.', BattlePhase.VICTORY);
            }
            this.releaseIndex = -1;
        }
    },

    attemptRun() {
        const playerSpd = this.playerDragon.stats.speed;
        const enemySpd = this.enemyDragon.stats.speed;
        const chance = 0.5 + (playerSpd - enemySpd) * 0.02;

        if (Math.random() < clamp(chance, 0.2, 0.95)) {
            GameAudio.sfx.run();
            this.showText('Got away safely!', BattlePhase.RUN);
        } else {
            this.showText('Can\'t escape!', BattlePhase.ENEMY_TURN);
            this.pendingPlayerMove = null;
        }
    },

    checkBattleEnd() {
        if (this.enemyDragon.currentHp <= 0) {
            // Trainer battle: check if trainer has more dragons
            if (this.isTrainerBattle && this.trainerParty) {
                this.trainerPartyIndex++;
                if (this.trainerPartyIndex < this.trainerParty.length) {
                    // Award XP for this dragon
                    const xp = this.enemyDragon.species.xpYield;
                    this.playerDragon.xp += xp;
                    this._checkLevelUp();
                    // Send out next trainer dragon
                    this.enemyDragon = this.trainerParty[this.trainerPartyIndex];
                    this.showText(this.trainerName + ' sends out\n' + this.enemyDragon.species.name + '!', BattlePhase.MENU);
                    return;
                }
            }

            // Victory
            GameAudio.sfx.victory();
            const xp = this.isTrainerBattle ? Math.floor(this.enemyDragon.species.xpYield * 1.5) : this.enemyDragon.species.xpYield;
            this.playerDragon.xp += xp;
            let lvlMsg = this._checkLevelUp();

            // Item drop (no drops from trainer battles)
            let dropMsg = '';
            if (!this.isTrainerBattle) {
                const drop = Inventory.getDropFromBattle(this.enemyDragon.speciesId);
                if (drop) {
                    Inventory.addItem(drop, 1);
                    const itemName = ITEMS[drop] ? ITEMS[drop].name : drop;
                    dropMsg = '\nFound ' + itemName + '!';
                }
            }

            const prefix = this.isTrainerBattle ? 'Defeated ' + this.trainerName + '!' : 'Defeated the wild\n' + this.enemyDragon.species.name + '!';
            this.showText(prefix + '\nGot ' + xp + ' XP!' + lvlMsg + dropMsg, BattlePhase.VICTORY);
            return;
        }

        if (this.playerDragon.currentHp <= 0) {
            // Check if any party member is alive
            let aliveIdx = -1;
            for (let i = 0; i < Game.player.party.length; i++) {
                if (Game.player.party[i].currentHp > 0 && i !== this.playerDragonIndex) {
                    aliveIdx = i;
                    break;
                }
            }

            if (aliveIdx >= 0) {
                const faintedName = this.playerDragon.species.name;
                this.playerDragonIndex = aliveIdx;
                this.playerDragon = Game.player.party[aliveIdx];
                this.showText(faintedName + ' fainted!\nGo, ' + this.playerDragon.species.name + '!', BattlePhase.MENU);
            } else {
                GameAudio.sfx.defeat();
                this.showText('All your dragons\nhave fainted!', BattlePhase.DEFEAT);
            }
            return;
        }

        // Continue battle
        this.phase = BattlePhase.MENU;
        this.selectedAction = 0;
    },

    updateVictory() {
        if (Input.confirm()) {
            // Store trainer ID for post-battle processing
            if (this.isTrainerBattle && this._currentTrainerId) {
                this._defeatedTrainerId = this._currentTrainerId;
            }
            this.endBattle();
        }
    },

    updateDefeat() {
        if (Input.confirm()) {
            // Heal and return to berk in a single transition
            Game.player.healAll();
            Game.stateStack.pop(); // discard the stacked overworld state
            Game.warpTo('berk_village', 14, 10);
        }
    },

    updateRun() {
        if (Input.confirm()) {
            this.endBattle();
        }
    },

    endBattle() {
        const postDialogue = this.trainerPostDialogue;
        const trainerId = this._defeatedTrainerId;
        this.isTrainerBattle = false;
        this.trainerName = '';
        this.trainerPostDialogue = null;
        this.trainerParty = null;
        this._defeatedTrainerId = null;
        Game.popState();

        // Show post-battle dialogue and mark trainer as defeated
        if (trainerId) {
            Game.defeatedTrainers[trainerId] = true;
        }
        if (postDialogue) {
            DialogueSystem.start(postDialogue);
        }
    },

    _checkLevelUp() {
        let lvlMsg = '';
        while (this.playerDragon.xp >= this.playerDragon.xpToNext) {
            this.playerDragon.xp -= this.playerDragon.xpToNext;
            this.playerDragon.level++;
            recalcStats(this.playerDragon);
            this.playerDragon.xpToNext = Math.floor(50 * Math.pow(1.2, this.playerDragon.level - 1));
            lvlMsg = '\n' + this.playerDragon.species.name + ' grew to\nlevel ' + this.playerDragon.level + '!';
            GameAudio.sfx.levelUp();
        }
        return lvlMsg;
    }
};
