//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/class.html

const ShootingEgg = require("ShootingEgg");

const EggShooter = cc.Class({

    extends: cc.Component,

    //region Member Variables
    shootDir: null,
    leftDeadShootDir: null,
    rightDeadShootDir: null,
    graphics: null,
    shootPos: null,
    gameManager: null,

    ctor() {
        this.shootDir = cc.v2();
        this.leftDeadShootDir = cc.v2(Math.cos(this.leftDeadAngle * Math.PI / 180.0), Math.sin(this.leftDeadAngle * Math.PI / 180.0));
        this.rightDeadShootDir = cc.v2(Math.cos(this.rightDeadAngle * Math.PI / 180.0), Math.sin(this.rightDeadAngle * Math.PI / 180.0));
    },
    //endregion

    //region Properties Configurations
    properties: {
        leftDeadAngle: {
            type: cc.Float,
            default: 150.0
        },
        rightDeadAngle: {
            type: cc.Float,
            default: 30.0
        },

        arrowLengthMultiplier: {
            default: cc.v2(250, 200)
        },
        currentShootingEgg: {
            default: null,
            type: ShootingEgg,
        },
        nextShootingEgg: {
            default: null,
            type: ShootingEgg,
        },
        rigidEgg: {
            default: null,
            type: cc.Prefab
        },
        shootSpeed: cc.v2(100, 100),
    },
    //endregion

    //region Static Variables &
    statics: {
    },
    //endregion

    //region CC Lifecycle Callbacks
    onLoad() {
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.OnMouseMove, this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.OnMouseDown, this);
        this.graphics = this.getComponent(cc.Graphics);
        this.gameManager = require("GameManager");
    },

    start() {
        this.shootPos = this.currentShootingEgg.node.getPosition();
    },

    //endregion

    //region Member Methods
    OnMouseMove(event) {
        cc.Vec2.normalize(this.shootDir, event.getLocation().sub(this.node.convertToWorldSpaceAR(this.shootPos)));
        if (this.shootDir.y < 0.0) {
            this.shootDir.y *= -1.0;
        }

        const shootAngle = this.angle(this.shootDir);
        if (shootAngle < this.rightDeadAngle) {
            this.shootDir = cc.v2(this.rightDeadShootDir.x, this.rightDeadShootDir.y);
        }
        else if (shootAngle > this.leftDeadAngle) {
            this.shootDir = cc.v2(this.leftDeadShootDir.x, this.leftDeadShootDir.y);
        }

        this.graphics.clear();
        this.graphics.moveTo(this.shootPos.x, this.shootPos.y);
        this.graphics.lineTo(this.shootPos.x + this.shootDir.x * this.arrowLengthMultiplier.x, this.shootPos.y + this.shootDir.y * this.arrowLengthMultiplier.y);
        this.graphics.stroke();
    },

    OnMouseDown(event) {
        if (event.getButton() === cc.Event.EventMouse.BUTTON_LEFT) {
            const egg = cc.instantiate(this.rigidEgg);

            egg.parent = cc.director.getScene();

            egg.setPosition(this.currentShootingEgg.node.x + this.gameManager.Instance.canvasX, this.currentShootingEgg.node.y + this.gameManager.Instance.canvasY);
            egg.getComponent("RigidEgg").Init(
                cc.v2(this.shootDir.x * this.shootSpeed.x * 200, this.shootDir.y * this.shootSpeed.x * 200.0),
                this.currentShootingEgg.eggType,
                this.currentShootingEgg.node.color);



            this.currentShootingEgg.SetType(this.nextShootingEgg.eggType, this.nextShootingEgg.node.color);
            this.nextShootingEgg.InitEggType();
        }
    },

    angle(vec) {
        return Math.acos(vec.x) * 180.0 / Math.PI;
    }
    //endregion

});

module.exports = EggShooter;
