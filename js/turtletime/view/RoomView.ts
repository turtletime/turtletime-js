///<reference path="../core/View.ts"/>
///<reference path="../model/RoomModel.ts"/>

module TurtleTime {
    export class RoomView extends View<RoomModel> {
        private _floorTile : Phaser.TileSprite;
        private _wallTile : Phaser.TileSprite;
        private _wallTileTop : Phaser.TileSprite;
        private _graphics : Phaser.Graphics;
        
        constructor(model : RoomModel) {
            super(model);
            var topLeft : Point = roomToScreen(new Point(0, 0));
            var bottomRight : Point = roomToScreen(new Point(this.model.width, this.model.height));
            this._floorTile = game.add.tileSprite(
                topLeft.x,
                topLeft.y,
                bottomRight.x - topLeft.x,
                bottomRight.y - topLeft.y,
                this.model.floorPattern);
            if (this.model.wallHeight > 0) {
                var wallTop = this.model.wallPattern + "_top";
                var topHeight = game.cache.getBaseTexture(wallTop).height;
                this._wallTileTop = game.add.tileSprite(
                    topLeft.x,
                    topLeft.y - topHeight * this.model.wallHeight,
                    bottomRight.x - topLeft.x,
                    topHeight,
                    wallTop);
                if (this.model.wallHeight > 1) {
                    var sectionHeight = game.cache.getBaseTexture(this.model.wallPattern).height;
                    this._wallTile = game.add.tileSprite(
                        topLeft.x,
                        topLeft.y - sectionHeight * (this.model.wallHeight - 1),
                        bottomRight.x - topLeft.x,
                        sectionHeight * (this.model.wallHeight - 1),
                        this.model.wallPattern);
                }
            }
            this._graphics = game.add.graphics(0, 0);
        }

        update():void {
            if (checkGlobalOption('debugmode')) {
                this._graphics.clear();
                this._graphics.lineStyle(0, 0x000000, 0);
                this._graphics.beginFill(0xff0000, 0.75);
                twoDForEach(this.model.roomLayout, (cell:Array<EntityData>, x:number, y:number) => {
                    if (cell.length > 0) {
                        var topLeft:Point = roomToScreen(new Point(x, y));
                        this._graphics.drawRect(topLeft.x, topLeft.y, gameData.roomScale, gameData.roomScale);
                    }
                });
                this._graphics.endFill();
            }
        }

        bringToTop():void {
            // good thing this is the lowest layer
        }
    }
}