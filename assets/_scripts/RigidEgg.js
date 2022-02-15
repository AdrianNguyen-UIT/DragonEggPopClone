//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/class.html

const EggDirection = require("Egg").EggDirection;

const RigidEgg = cc.Class({

    extends: require("ShootingEgg"),

    //region Member Variables
    gameManager: null,
    physManager: null,
    shootDir: null,
    contacted: null,
    previousPos: null,
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
    onload() {


    },

    start() {
        this.gameManager = require("GameManager");
        this.physManager = cc.director.getPhysicsManager();
        this.shootDir = cc.v2();
        this.contacted = false;
        this.previousPos = cc.v2();
    },

    update(dt) {
    },

    lateUpdate(dt) {
        this.previousPos = this.node.getPosition();
    },

    onPreSolve(contact, selfCollider, otherCollider) {

        if (otherCollider.tag === this.gameManager.Instance.destroyedEggColTag) {
            contact.disabled = true;
        }

        if (this.contacted) {
            return;
        }

        if (otherCollider.tag === this.gameManager.Instance.eggColTag) {
            this.contacted = true;
            const egg = otherCollider.node.getComponent("Egg");
            egg.enableNearDestroyedEgg = true;

            let dir = cc.v2();
            const eggPos = cc.v2(egg.node.x + this.gameManager.Instance.canvasX, egg.node.y + this.gameManager.Instance.canvasY);
            cc.Vec2.normalize(dir, this.node.getPosition().sub(eggPos));
            const angle = this.angle(dir);
            if (angle <= 45.0) {
                this.gameManager.Instance.SetNearDestroyedEgg(this.eggType, this.node.color, EggDirection.RIGHT);
            }
            else if (angle <= 90.0) {
                this.gameManager.Instance.SetNearDestroyedEgg(this.eggType, this.node.color, EggDirection.BOTTOM_RIGHT);
            }
            else if (angle <= 135.0) {
                this.gameManager.Instance.SetNearDestroyedEgg(this.eggType, this.node.color, EggDirection.BOTTOM_LEFT);
            }
            else {
                this.gameManager.Instance.SetNearDestroyedEgg(this.eggType, this.node.color, EggDirection.LEFT);
            }
            this.node.destroy();
        }

    },

    //endregion

    //region Member Methods
    Init(velocity, eggType, color) {
        this.node.getComponent(cc.RigidBody).linearVelocity = velocity;
        this.eggType = eggType;
        this.node.color = color;
    },

    angle(vec) {
        return Math.acos(vec.x) * 180.0 / Math.PI;
    }

    //endregion

});

module.exports = RigidEgg;
