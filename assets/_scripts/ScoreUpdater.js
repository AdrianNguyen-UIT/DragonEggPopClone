//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/class.html

const ScoreUpdater = cc.Class({

    extends: cc.Component,

    //region Member Variables
    scoreLabel: null,
    gameManager: null,
    //endregion

    //region Properties Configurations
    properties: {
    },
    //endregion

    //region Static Variables &
    statics: {
    },
    //endregion

    //region CC Lifecycle Callbacks
    onLoad() {
        this.scoreLabel = this.getComponent(cc.Label);
        this.gameManager = require("GameManager");
    },

    start() {
    },

    update(dt) {
        this.UpdateScore();
    },
    //endregion

    //region Member Methods
    //endregion

    UpdateScore() {
        this.scoreLabel.string = this.gameManager.Instance.score.toString();
    }
});

module.exports = ScoreUpdater;
