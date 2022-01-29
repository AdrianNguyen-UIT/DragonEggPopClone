// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const GameManager = cc.Class({
    extends: cc.Component,
    physManager: null,
    colManager: null,

    toLineSpeed: null,
    heightNearPos: null,
    gameOverLineColTag: null,
    eggPopParticles: null,
    canvasX: null,
    canvasY: null,
    eggColTag: null,
    nearDestroyedEggDirection: null,
    nearDestroyedEggType: null,
    nearDestroyedEggColor: null,
    mightPopEggs: null,
    eggCountToPop: null,
    wallColTag: null,
    eggEndYPos: null,
    destroyedEggColTag: null,

    gameOverTimeCounter:null,
    gameOverTime: null,

    ctor() {
        this.toLineSpeed = -15.0;
        this.heightNearPos = 70;
        this.gameOverLineColTag = 10;
        this.canvasX = 370;
        this.canvasY = 540;
        this.eggColTag = 0;
        this.wallColTag = 5;
        this.destroyedEggColTag = 1;

        this.nearDestroyedEggDirection = 0;
        this.nearDestroyedEggType = 0;
        this.nearDestroyedEggColor = 0;

        this.mightPopEggs = [];
        this.eggCountToPop = 3;

        this.eggEndYPos = -378.0;

        this.physManager = cc.director.getPhysicsManager();
        this.physManager.enabled = true;

        this.gameOverTime = 6.0;
        this.gameOverTimeCounter = 0.0;
        this.dyingCount = 0.0;
    },
    statics : {
        Instance: null
    },

    onLoad() {
        if (GameManager.Instance == null) {
            GameManager.Instance = new GameManager();
        }
        else {
            this.node.destroy();
        }
    },

    update(dt) {
        if (this.dyingCount > 0) {
            this.gameOverTimeCounter += dt;
            console.log(this.gameOverTimeCounter);
            if (this.gameOverTimeCounter >= this.gameOverTime) {
                console.log("Game Over");
            }
        }
        else {
            this.gameOverTimeCounter = 0.0;
        }
    },

    AddDyingEggCount() {
        ++this.dyingCount;
        console.log(this.dyingCount);

    },

    PopDyingEggCount() {
        --this.dyingCount;
        console.log(this.dyingCount);
    },

    PopAllDyingEggCount() {
        this.dyingCount = 0.0;
    },

    ResetGameOverTimer() {
        this.gameOverTimeCounter = 0.0;
        this.dyingCount = 0.0;
    },


    SetNearDestroyedEgg(type, color, direction) {
        this.nearDestroyedEggType = type;
        this.nearDestroyedEggColor = color;
        this.nearDestroyedEggDirection = direction;
    },

    CheckPopEggs() {
        if (this.mightPopEggs.length >= this.eggCountToPop) {
            for (let index = 0; index < this.mightPopEggs.length; index++) {
                this.mightPopEggs[index].DestroyEgg();
                this.mightPopEggs[index].PlayPopParticles();
            }
        }
        else {
            for (let index = 0; index < this.mightPopEggs.length; index++) {
                this.mightPopEggs[index].mightPop = false;
            }
        }
        this.mightPopEggs = [];
    }

});

module.exports = GameManager;