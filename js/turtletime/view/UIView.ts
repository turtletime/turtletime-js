///<reference path="../core/BaseView.ts"/>

module TurtleTime {
    import Rectangle = Phaser.Rectangle;
    import Graphics = Phaser.Graphics;
    class UIViewNode extends View<UIModel> {
        screenDimensions : Rectangle;
        children : Array<UIViewNode>;
        private _text : Phaser.Text;
        private _editMode : boolean;

        constructor(model : UIModel) {
            super(model);
            this._editMode = checkGlobalOption('uiEdit');
            this.screenDimensions = new Rectangle(0, 0, 0, 0);
            this.children = model.children.map((childData : UIModel) : UIViewNode => new UIViewNode(childData));
            if (this.model.appearance.normal instanceof UIText || this._editMode) {
                this._text = GAME_ENGINE.game.add.text(0, 0, "", {
                    font: 'Courier New',
                    fontSize: '12px',
                    fill: '#ffffff',
                    wordWrap: true
                });
            }
        }

        assignScreenDimensions(parentDimensions : Rectangle) : void {
            this.screenDimensions = this.model.container.eval(parentDimensions);
            if (this._text != null) {
                this._text.setTextBounds(this.screenDimensions.x, this.screenDimensions.y, this.screenDimensions.width, this.screenDimensions.height);
                this._text.wordWrapWidth = this.screenDimensions.width;
            }
            this.children.forEach((child : UIViewNode) : void => child.assignScreenDimensions(this.screenDimensions));
        }

        contains(x:number, y:number):boolean {
            return this.screenDimensions.contains(x, y);
        }

        draw(graphics : Graphics, interactionModel : UIInteractionModel, parentVisible : boolean = true):void {
            if (this._editMode) {
                graphics.lineStyle(2, 0xffffff, 1.0);
                if (interactionModel.mouseOver(this.model)) {
                    this._text.text = this.model.id;
                    graphics.beginFill(0xff0000, 0.2);
                } else if (this.model.visible && parentVisible) {
                    this._text.text = "";
                    graphics.beginFill(0xffffff, 0.05);
                } else {
                    graphics.lineStyle(1, 0xffffff, 0.5);
                    graphics.beginFill(0x000000, 0.05);
                }
                graphics.drawRect(this.screenDimensions.x, this.screenDimensions.y, this.screenDimensions.width, this.screenDimensions.height);
                graphics.endFill();
            } else if (this._text != null) {
                if (this.model.visible) {
                    this._text.visible = this.model.visible;
                    this._text.text = (<UIText>this.model.appearance.normal).text;
                    this._text.tint = (<UIText>this.model.appearance.normal).tint;
                }
            }
            if (this._editMode || this.model.visible) {
                this.children.forEach((child : UIViewNode) : void => child.draw(graphics, interactionModel, this.model.visible && parentVisible));
            }
        }

        update():void {
        }

        bringToTop():void {
        }

        enumerateGameObjects():Array<PIXI.DisplayObject> {
            var result : Array<PIXI.DisplayObject> = [ this._text ];
            // I hate this code why did it take me so much time to write this
            this.children.map((child : UIViewNode) : Array<PIXI.DisplayObject> => child.enumerateGameObjects())
                .forEach((element : Array<PIXI.DisplayObject>) : void => element
                    .forEach((innerElement : PIXI.DisplayObject) : void => { result.push(innerElement); return; }));
            return result;
        }
    }

    export class UIView extends BaseView {
        private _graphics : Graphics;
        private _rootNode : UIViewNode;
        private _editMode : boolean;
        private _interactionModel : UIInteractionModel;

        constructor(model : UIModel, interactionModel : UIInteractionModel) {
            super();
            this._interactionModel = interactionModel;
            this._graphics = GAME_ENGINE.game.add.graphics(0, 0);
            this._rootNode = new UIViewNode(model);
            this._rootNode.assignScreenDimensions(
                new Rectangle(0, 0, GAME_ENGINE.globalData.screenSize.x, GAME_ENGINE.globalData.screenSize.y));
            this._editMode = checkGlobalOption('uiEdit');
        }

        update():void {
            this._graphics.clear();
            this._rootNode.draw(this._graphics, this._interactionModel);
        }

        contains(x:number, y:number):boolean {
            return false;
        }

        getLayerNumber():number {
            return LAYER_UI;
        }

        enumerateGameObjects():Array<PIXI.DisplayObject> {
            return this._rootNode.enumerateGameObjects().concat(this._graphics);
        }
    }
}