module TurtleTime {
    import Rectangle = Phaser.Rectangle;
    import Graphics = Phaser.Graphics;
    class UIViewNode extends View<UIModel> {
        screenDimensions : Rectangle;
        children : Array<UIViewNode>;

        constructor(model : UIModel) {
            super(model);
            this.screenDimensions = new Rectangle(0, 0, 0, 0);
            this.children = model.children.map((childData : UIModel) : UIViewNode => new UIViewNode(childData));
        }

        assignScreenDimensions(parentRectangle : Rectangle) : void {
            this.screenDimensions.x = parentRectangle.x + parentRectangle.width * this.model.internalDimensions.x;
            this.screenDimensions.y = parentRectangle.y + parentRectangle.height * this.model.internalDimensions.y;
            this.screenDimensions.width = parentRectangle.width * this.model.internalDimensions.width;
            this.screenDimensions.height = parentRectangle.height * this.model.internalDimensions.height;
            this.children.forEach((child : UIViewNode) : void => child.assignScreenDimensions(this.screenDimensions));
        }

        contains(x:number, y:number):boolean {
            return this.screenDimensions.contains(x, y);
        }

        draw(graphics : Graphics):void {
            graphics.drawRect(this.screenDimensions.x, this.screenDimensions.y, this.screenDimensions.width, this.screenDimensions.height);
            this.children.forEach((child : UIViewNode) : void => child.draw(graphics));
        }

        update():void {
        }

        bringToTop():void {
        }
    }

    export class UIView extends BaseView {
        private _graphics : Graphics;
        private _rootNode : UIViewNode;

        constructor(model : UIModel) {
            super();
            this._graphics = game.add.graphics(0, 0);
            this._rootNode = new UIViewNode(model);
            this._rootNode.assignScreenDimensions(new Rectangle(0, 0, gameData.screenSize.x, gameData.screenSize.y));
        }

        update():void {
            this._graphics.clear();
            this._graphics.lineStyle(2, 0xffffff, 1.0);
            this._graphics.beginFill(0xffffff, 0.05);
            this._rootNode.draw(this._graphics);
            this._graphics.endFill();
        }

        contains(x:number, y:number):boolean {
            return false;
        }

        getLayerNumber():number {
            return LAYER_UI;
        }

        bringToTop():void {
        }
    }
}