//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/class.html

const Singleton = cc.Class({

    extends: cc.Component,

    statics: {
        Instance: null,
    },

    onLoad() {
        console.log("Singleton Onload");
        if (Singleton.Instance == null) {
            Singleton.Instance = new Singleton();
        }
        else {
            console.log("Destroying " + this.name);
            this.node.destroy();
        }
    },
});

module.exports = Singleton;
