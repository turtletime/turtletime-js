module TurtleTime {
    import LoopBrain = TurtleTime.Behavior.LoopBehavior;
    export class Turtle extends EntityModel {
        brain : LoopBrain;

        constructor(entityData : EntityData) {
            super(entityData);
            this.layerNumber = LAYER_SPRITE_TURTLE;
            this.currentStatus = 'normal';
            var side = 1;
            var x = entityData.position.x;
            var y = entityData.position.y;
            this.brain = new LoopBrain(0.001, [
                {
                    lowerBoundT: 0,
                    upperBoundT: 0.5,
                    behavior: (innerT : number) => {
                        this.position.x = x + innerT * side;
                        this.position.y = y;
                        this.direction = Direction.Right;
                    }
                },
                {
                    lowerBoundT: 0.5,
                    upperBoundT: 1.0,
                    behavior: (innerT : number) => {
                        this.position.x = x + (1 - innerT) * side;
                        this.position.y = y;
                        this.direction = Direction.Left;
                    }
                }
            ]);
        }

        getEntityClass() : string { return "turtle"; }
    }
}