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

    start(wildDragon) {
        this.enemyDragon = wildDragon;
        this.playerDragonIndex = 0;
        // Find first alive dragon
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
        this.showText('A wild ' + this.enemyDragon.species.name + ' appeared!', BattlePhase.MENU);
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
                    this.attemptTame();
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
                    this.attemptRun();
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
        this.pendingPlayerMove = null;
    },

    calcDamage(attacker, defender, move) {
        const level = attacker.level;
        const atk = attacker.stats.attack;
        const def = defender.stats.defense;
        const power = move.power;
        const base = Math.floor(((2 * level / 5 + 2) * power * atk / def) / 50 + 2);
        const random = 0.85 + Math.random() * 0.15;
        const typeMultiplier = this.getTypeMultiplier(move.type, DRAGON_SPECIES[defender.speciesId].type);
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
        // Show release prompt
        this.currentText = 'Release which dragon?\n';
        for (let i = 0; i < Game.player.party.length; i++) {
            const prefix = i === this.releaseIndex ? '> ' : '  ';
            this.currentText += prefix + Game.player.party[i].species.name + '\n';
        }
        const cancelPrefix = this.releaseIndex === -1 ? '> ' : '  ';
        this.currentText += cancelPrefix + 'Cancel';
        this._textDone = true;

        if (Input.wasPressed('arrowup') || Input.wasPressed('w')) {
            this.releaseIndex--;
            if (this.releaseIndex < -1) this.releaseIndex = Game.player.party.length - 1;
            GameAudio.sfx.select();
        }
        if (Input.wasPressed('arrowdown') || Input.wasPressed('s')) {
            this.releaseIndex++;
            if (this.releaseIndex >= Game.player.party.length) this.releaseIndex = -1;
            GameAudio.sfx.select();
        }
        if (Input.confirm()) {
            if (this.releaseIndex >= 0) {
                const released = Game.player.party[this.releaseIndex];
                Game.player.removeFromParty(this.releaseIndex);
                Game.player.addToParty(this.enemyDragon);
                GameAudio.sfx.confirm();
                this.showText('Released ' + released.species.name + '.\n' + this.enemyDragon.species.name + '\njoined your party!', BattlePhase.VICTORY);
            } else {
                // Cancel - just end without taming
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
            // Victory
            GameAudio.sfx.victory();
            const xp = this.enemyDragon.species.xpYield;
            this.playerDragon.xp += xp;
            let lvlMsg = '';
            // Check level up
            while (this.playerDragon.xp >= this.playerDragon.xpToNext) {
                this.playerDragon.xp -= this.playerDragon.xpToNext;
                this.playerDragon.level++;
                recalcStats(this.playerDragon);
                this.playerDragon.xpToNext = Math.floor(50 * Math.pow(1.2, this.playerDragon.level - 1));
                lvlMsg = '\n' + this.playerDragon.species.name + ' grew to\nlevel ' + this.playerDragon.level + '!';
                GameAudio.sfx.levelUp();
            }
            this.showText('Defeated the wild\n' + this.enemyDragon.species.name + '!\nGot ' + xp + ' XP!' + lvlMsg, BattlePhase.VICTORY);
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
                this.playerDragonIndex = aliveIdx;
                this.playerDragon = Game.player.party[aliveIdx];
                this.showText(Game.player.party[this.playerDragonIndex === 0 ? 0 : 1].species.name + ' fainted!\nGo, ' + this.playerDragon.species.name + '!', BattlePhase.MENU);
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
            this.endBattle();
        }
    },

    updateDefeat() {
        if (Input.confirm()) {
            // Heal and return to berk
            Game.player.healAll();
            this.endBattle();
            Game.warpTo('berk_village', 14, 10);
        }
    },

    updateRun() {
        if (Input.confirm()) {
            this.endBattle();
        }
    },

    endBattle() {
        Game.popState();
    }
};
