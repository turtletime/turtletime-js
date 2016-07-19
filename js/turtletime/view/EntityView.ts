///<reference path="../data/Constants.ts"/>
///<reference path="../core/View.ts"/>
///<reference path="EntitySpriteWrapper.ts"/>
///<reference path="../model/SelectionModel.ts"/>

module TurtleTime {
    import AnimationManager = Phaser.AnimationManager;
    import Sprite = Phaser.Sprite;
    import Graphics = Phaser.Graphics;

    export class EntityView extends View<EntityModel> {
        protected _mainSprite : EntitySpriteWrapper;
        protected _shadow : Sprite;

        constructor(model : EntityModel) {
            super(model);
            this._mainSprite = new EntitySpriteWrapper();
            this._mainSprite.reset(model.spriteSpecs);
            this._width = this._mainSprite.width;
            this._height = this._mainSprite.height;
            this._shadow = GAME_ENGINE.game.add.sprite(0, 0, 'shadow');
            this._shadow.scale.x = this.model.dimensions.x * this._mainSprite.width / GAME_ENGINE.globalData.roomScale[0] / 2;
            this._shadow.scale.y = this.model.dimensions.y * this._mainSprite.height / GAME_ENGINE.globalData.roomScale[0] / 2;
            this._shadow.anchor = new Point(0.5, 0.25);
            if (this.model.getEntityClass() == EntityType.WallDecor) {
                this._shadow.visible = false;
            }
        }

        get x() : number {
            return this._mainSprite.x;
        }

        get y() : number {
            return this._mainSprite.y;
        }

        contains(x : number, y : number) : boolean {
            return Math.abs(x - this.x) <= this.width / 2 && Math.abs(y - this.y) <= this.height / 2;
        }

        update() : void {
            var screenPos : Point;
            if (this.model.getEntityClass() == EntityType.WallDecor) {
                screenPos = wallToScreen(this.model.position.x + this.model.dimensions.x / 2, this.model.position.y + this.model.dimensions.y / 2);
            } else {
                screenPos = roomToScreen(this.model.position.x + this.model.dimensions.x / 2, this.model.position.y + this.model.dimensions.y / 2);
                if (this.model.getEntityClass() == EntityType.Food && (<Food>this.model).table) {
                    screenPos.y -= 10; // account for the height of the table
                }
            }
            this._mainSprite.x = screenPos.x;
            this._mainSprite.y = screenPos.y;
            this._mainSprite.animation = this.model.animationString;
            this._shadow.x = screenPos.x;
            this._shadow.y = screenPos.y;
            setTintAndAlpha(this._shadow, 0x00000033);
            // sort values
            var sortValue : number = (10000 + this.model.position.y) * 100 + this.model.getEntityClass() * 10;
            this._mainSprite.underlyingSprite.name = "" + sortValue;
            this._shadow.name = "" + (sortValue - 1);
            this.updatePrivate(screenPos, sortValue);
        }

        protected updatePrivate(screenPos : Point, sortValue : number) : void {}

        getLayerNumber() : number {
            return LAYER_SPRITE;
        }

        enumerateGameObjects():Array<PIXI.DisplayObject> {
            return [ this._mainSprite.underlyingSprite, this._shadow ];
        }
    }
}