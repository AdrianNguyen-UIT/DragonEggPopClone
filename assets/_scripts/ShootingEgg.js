//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/class.html

const EggType = require("Egg").EggType;
const EggColor = require("Egg").EggColor;

const ShootingEgg = cc.Class({

    extends: cc.Component,

    //region Member Variables
    eggType: null,
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
    start() {
        this.InitEggType();
    },
    //endregion

    //region Member Methods
    InitEggType() {
        const type =  Math.floor(Math.random() * 5 );
        const newColor = new cc.Color();
        switch (type) {
            case 0:
                this.eggType = EggType.Yellow;
                cc.Color.fromHEX(newColor, EggColor.Yellow);
                break;
            case 1:
                this.eggType = EggType.Cyan;
                cc.Color.fromHEX(newColor, EggColor.Cyan);
                break;
            case 2:
                this.eggType = EggType.Green;
                cc.Color.fromHEX(newColor, EggColor.Green);
                break;
            case 3:
                this.eggType = EggType.Orange;
                cc.Color.fromHEX(newColor, EggColor.Orange);
                break;
            case 4:
                this.eggType = EggType.Red;
                cc.Color.fromHEX(newColor, EggColor.Red);
                break;
        }
        this.node.color = newColor;
    },

    SetType(nextEggType, color) {
        this.eggType = nextEggType;
        this.node.color = color;
    }
    //endregion

});

module.exports = ShootingEgg;
