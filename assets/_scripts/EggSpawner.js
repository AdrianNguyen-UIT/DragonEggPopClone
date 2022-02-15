//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/class.html

const EggSpawner = cc.Class({

    extends: cc.Component,

    //region Member Variables
    gameManager: null,
    //endregion

    //region Properties Configurations
    properties: {
        eggToSpawn: {
            default: null,
            type: cc.Prefab
        },
        eggRowCount: {
            default: 14,
            type: cc.Integer,
            min: 0
        },
        highRowCount: {
            default: 8,
            type: cc.Integer,
            min: 0
        },
        lowRowCount: {
            default: 7,
            type: cc.Integer,
            min: 0
        }
    },
    //endregion

    //region CC Lifecycle Callbacks
    onLoad() {
        this.gameManager = require("GameManager");
    },

    start() {
        console.log();
        const canvasNode = cc.find("Canvas");

        for (let rowIndex = 0; rowIndex < this.eggRowCount; rowIndex++) {

            if (rowIndex % 2 === 0) {
                for (let highIndex = 0; highIndex < this.highRowCount; highIndex++) {
                    const spawnPos = {
                        x: this.gameManager.Instance.highSpawnXPos + this.eggToSpawn.data.width * highIndex,
                        y: this.gameManager.Instance.highSpawnYPos + this.gameManager.Instance.heightNearPos * rowIndex
                    };

                    const egg = cc.instantiate(this.eggToSpawn);
                    egg.setParent(canvasNode);
                    egg.setPosition(spawnPos.x, spawnPos.y);
                    if (spawnPos.y < 270.0) {
                        egg.getComponent("Egg").isNormalStart = false;
                    }
                }
            }
            else {
                for (let lowIndex = 0; lowIndex < this.lowRowCount; lowIndex++) {
                    const spawnPos = {
                        x: this.gameManager.Instance.lowSpawnXPos + this.eggToSpawn.data.width * lowIndex,
                        y: this.gameManager.Instance.lowSpawnYPos + this.gameManager.Instance.heightNearPos * (rowIndex - 1)
                    };
                    const egg = cc.instantiate(this.eggToSpawn);
                    egg.setParent(canvasNode);
                    egg.setPosition(spawnPos.x , spawnPos.y);
                    if (spawnPos.y < 270.0) {
                        egg.getComponent("Egg").isNormalStart = false;
                    }
                }
            }
        }
    },

    update(dt) {
        if (this.gameManager.Instance.dyingCount > 0) {
            this.gameManager.Instance.gameOverTimeCounter += dt;
            console.log(this.gameManager.Instance.gameOverTimeCounter);
            if (this.gameManager.Instance.gameOverTimeCounter >= this.gameManager.Instance.gameOverTime) {
                this.gameManager.Instance.PopAllDyingEggCount();
                this.gameManager.Instance.ResetGameOverTimer();
                cc.director.loadScene("Main");

            }
        }
        else {
            this.gameManager.Instance.gameOverTimeCounter = 0.0;
        }
    }
    //endregion

    //region Member Methods
    //endregion

});

module.exports = EggSpawner;
