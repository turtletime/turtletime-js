import Point = Phaser.Point;

module TurtleTime {
    /**
     * Represents any physical object in the cafe.
     */
    export abstract class EntityModel extends VisibleModel {
        public position : Point;
        public direction : Direction;
        public spriteSpecs : SpriteSpecs;
        public currentAction : string;
        public effect : string;

        constructor(x:number, y:number, spriteSpecs:SpriteSpecs) {
            super();
            this.position = new Point(x, y);
            this.spriteSpecs = spriteSpecs;
            this.direction = Direction.Down;
            this.effect = "hidden";
        }
    }
}