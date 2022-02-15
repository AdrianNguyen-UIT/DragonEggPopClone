//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/class.html


const EggType = {
    Yellow: 0,
    Cyan: 1,
    Green: 2,
    Orange: 3,
    Red: 4
};

const EggColor = {
    Yellow: "#E3E777",
    Cyan: "#22C6E6",
    Green: "#41E441",
    Orange: "#DD8042",
    Red: "#EE4C46"

};

const EggState = {
    NORMAL: 0,
    DESTROYED: 1,
};

const EggDirection = {
    BOTTOM_LEFT: 0,
    LEFT: 1,
    TOP_LEFT: 2,
    TOP_RIGHT: 3,
    RIGHT: 4,
    BOTTOM_RIGHT: 5
};
const Egg = cc.Class({

    extends: cc.Component,

    //region Member Variables
    physManager: null,
    eggState: null,
    reposition: null,
    eggType: null,
    gameManager: null,
    animator: null,
    eggDyingAniState: null,
    sprite: null,
    enableNearDestroyedEgg: null,
    rayCastEndPoints: null,
    nodePos: null,
    col: null,
    mightPop: null,
    dying: null,
    popParticles: null,
    isNormalStart: null,
    audioController: null,
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
        this.physManager = cc.director.getPhysicsManager();
        this.physManager.enabled = true;
        this.gameManager = require("GameManager");
        this.animator = this.getComponent(cc.Animation);
        this.eggDyingAniState = this.animator.getAnimationState("Egg_Dying");
        this.sprite = this.getComponent(cc.Sprite);
        this.rayCastEndPoints = [];
        this.col = this.getComponent(cc.PhysicsCircleCollider);
        this.popParticles = this.node.children[0].getComponent(cc.ParticleSystem);
        //this.node.on(cc.Node.EventType.MOUSE_DOWN, this.OnMouseDown, this);
        this.isNormalStart = true;
        this.audioController = cc.find("AudioController").getComponent("AudioController");

    },

    start() {
        if (this.isNormalStart) {
            this.InitEggType();
            this.eggState = EggState.NORMAL;
            this.col.tag = this.gameManager.Instance.eggColTag;
        }
        else  {
            this.DestroyEgg();
        }
        this.reposition = false;
        this.enableNearDestroyedEgg = false;
        this.mightPop = false;
        this.dying = false;
    },

    update(dt) {

        if (this.eggState === EggState.NORMAL) {
            this.CalculateRayCastEndpoints();
            if (this.CheckFalling()) {
                this.gameManager.Instance.AddFallScore();
                this.DestroyEgg();
            }
        }

        if (this.enableNearDestroyedEgg) {
            this.enableNearDestroyedEgg = false
            const results = this.physManager.rayCast(this.nodePos, this.rayCastEndPoints[this.gameManager.Instance.nearDestroyedEggDirection], cc.RayCastType.Any);
            if (results.length !== 0) {
                const egg = results[0].collider.node.getComponent("Egg");
                if (egg !== null && egg.eggState === EggState.DESTROYED) {
                    egg.eggType = this.gameManager.Instance.nearDestroyedEggType;
                    egg.node.color = this.gameManager.Instance.nearDestroyedEggColor;
                    egg.ResetToNormal();
                    egg.CalculateRayCastEndpoints();

                    egg.CheckNearSameTypeEgg(egg.eggType);
                    this.gameManager.Instance.CheckPopEggs();
                }

            }
        }
    },

    lateUpdate(dt) {
        if (this.gameManager.Instance.dyingCount > 0) {
            return;
        }

        this.MoveToLine(dt);
        this.Looping();
    },

    onPreSolve(contact, selfCollider, otherCollider) {
        if (otherCollider.tag === this.gameManager.Instance.gameOverLineColTag) {
            if (this.eggState === EggState.NORMAL) {
                if (!this.eggDyingAniState.isPlaying) {
                    this.animator.play("Egg_Dying");
                }

                if (!this.dying) {
                    this.gameManager.Instance.AddDyingEggCount();
                    this.dying = true;
                }
            }
        }
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

    MoveToLine(dt) {
        this.node.y += this.gameManager.Instance.toLineSpeed * dt;

        if (this.eggState === EggState.DESTROYED) {
            if (this.node.y <= this.gameManager.Instance.eggEndYPos) {
                this.reposition = true;
            }
        }
    },

    DestroyEgg() {
        this.eggState = EggState.DESTROYED;
        this.sprite.enabled = false;
        this.col.tag = this.gameManager.Instance.destroyedEggColTag;
        //this.node.color = cc.Color.BLACK;

        if (this.dying) {
            this.dying = false;
            this.gameManager.Instance.PopDyingEggCount();
        }
    },

    PlayPopParticles() {
        this.popParticles.resetSystem();
        this.audioController.PlayPopEffect();
    },


    CheckNearSameTypeEgg(type) {
        if (this.eggState === EggState.DESTROYED) {
            return;
        }

        if (this.eggType !== type) {
            return;
        }

        if (this.mightPop) {
            return;
        }

        this.mightPop = true;
        this.gameManager.Instance.mightPopEggs.push(this);

        for (let index = 0; index < 6; index++) {
            const results = this.physManager.rayCast(this.nodePos, this.rayCastEndPoints[index], cc.RayCastType.Any);
            if (results.length !== 0) {
                const egg = results[0].collider.node.getComponent("Egg");
                if (egg !== null) {
                    egg.CheckNearSameTypeEgg(type);
                }
            }
        }
    },

    ResetToNormal() {
        this.sprite.enabled = true;
        this.eggState = EggState.NORMAL;
        this.reposition = false;
        this.enableNearDestroyedEgg = false;
        this.mightPop = false;
        this.col.tag = this.gameManager.Instance.eggColTag;
    },

    Looping() {
        if (this.reposition === true) {
            this.node.y += this.gameManager.Instance.heightNearPos * 14.0;
            this.InitEggType();
            this.ResetToNormal();
        }
    },

    CheckFalling(direction = EggDirection.TOP_LEFT, destroyed = false) {
        let results = null;
        results = this.physManager.rayCast(this.nodePos, this.rayCastEndPoints[direction], cc.RayCastType.Any);
/*        if (this.debug) {
            console.log(results);
        }*/

        if (results.length !== 0) {
            if (results[0].collider.tag === this.gameManager.Instance.wallColTag) {
                if (direction === EggDirection.TOP_RIGHT) {
                    return destroyed;
                }

                return this.CheckFalling(direction + 1, true);
            }
            else if (results[0].collider.tag === this.gameManager.Instance.destroyedEggColTag) {
                if (direction === EggDirection.TOP_RIGHT) {
                    return destroyed;
                }
                return this.CheckFalling(direction + 1, true);
            }
            else if (results[0].collider.tag === this.gameManager.Instance.eggColTag) {
                return false;
            }
        }
        else {
            if (direction === EggDirection.TOP_RIGHT) {
                return false;
            }
            return this.CheckFalling(direction + 1, false);
        }
    },

    CalculateRayCastEndpoints() {
        const heightNearPos = this.gameManager.Instance.heightNearPos;
        this.nodePos = cc.v2(this.node.x + this.gameManager.Instance.canvasX, this.node.y + this.gameManager.Instance.canvasY);

        // Bottom Left
        this.rayCastEndPoints[0] = cc.v2(this.nodePos.x - this.node.width / 2.0, this.nodePos.y - heightNearPos);
        // Left
        this.rayCastEndPoints[1] = cc.v2(this.nodePos.x - this.node.width, this.nodePos.y);
        // Top Left
        this.rayCastEndPoints[2] = cc.v2(this.nodePos.x - this.node.width / 2.0, this.nodePos.y + heightNearPos);
        // Top Right
        this.rayCastEndPoints[3] = cc.v2(this.nodePos.x + this.node.width / 2.0, this.nodePos.y + heightNearPos);
        // Right
        this.rayCastEndPoints[4] = cc.v2(this.nodePos.x + this.node.width, this.nodePos.y);
        // Bottom Right
        this.rayCastEndPoints[5] = cc.v2(this.nodePos.x + this.node.width / 2.0, this.nodePos.y - heightNearPos);
    },

    OnMouseDown(event){
        this.CheckNearSameTypeEgg(this.eggType);
        this.gameManager.Instance.CheckPopEggs();
    }
    //endregion

});

module.exports = Egg;
module.exports.EggType = EggType;
module.exports.EggColor = EggColor;
module.exports.EggState = EggState;
module.exports.EggDirection = EggDirection;
