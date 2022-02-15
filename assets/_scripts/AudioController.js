//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/class.html

const AudioController = cc.Class({

    extends: cc.Component,

    //region Member Variables
    //endregion

    //region Properties Configurations
    properties: {
        eggShootSound: {
            default: null,
            type: cc.AudioClip
        },
        eggPopSound: {
            default: null,
            type: cc.AudioClip
        },

        backgroundMusic: {
            default: null,
            type: cc.AudioClip
        }
    },
    //endregion

    //region Static Variables &
    statics: {
    },
    //endregion

    //region CC Lifecycle Callbacks
    start() {
        cc.audioEngine.playMusic(this.backgroundMusic, true);
        console.log("playBackgroundMusic");
    },
    //endregion

    //region Member Methods
    //endregion

    PlayShootEffect() {
        cc.audioEngine.playEffect(this.eggShootSound, false);
    },

    PlayPopEffect() {
        cc.audioEngine.playEffect(this.eggPopSound, false);
    }

});

module.exports = AudioController;
