namespace TurtleTime {
    /**
     * Represents the engine of the game itself.
     */
    export abstract class GameEngine {
        private gameState : GameState;
        private controllers : Array<Controller<GameState>>;
        private views : GameView;
        debugText : string = "";
        /**
         * The current time.
         */
        time : number;
        /**
         * A reference to the underlying Phaser.Game object. Use with care.
         */
        game : Phaser.Game;
        /**
         * A reference to all of the game's globally available data.
         * The data here should remain read-only.
         */
        globalData : GameData;

        constructor() {
            var scale_factor : number = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? 0.5 : 1;
            this.game = new Phaser.Game(window.innerWidth * scale_factor, window.innerHeight * scale_factor, Phaser.AUTO, '', {
                preload: () => this.preloadAssets(this.game),
                create: this.create.bind(this),
                update: this.update.bind(this)});
        }

        private create() : void {
            this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.time = 0;
            this.globalData = this.loadData(this.game);
            this.gameState = this.loadModel(this.game);
            this.controllers = this.createControllers();
            this.views = this.createView(this.gameState);
            // Set controllers
            this.controllers.forEach((function (controller : Controller<GameState>) { controller.initialize(this.gameState); }).bind(this));
        }

        private update() : void {
            this.debugText = "";
            // Update controllers
            this.controllers.forEach(function (controller : Controller<GameState>) { controller.update(1.0/60); });
            for (var property in this.gameState.entities) {
                if (this.gameState.entities.hasOwnProperty(property)) {
                    var entityCollection : AbstractEntityCollection = this.gameState.entities[property];
                    entityCollection.update(this.views);
                }
            }
            this.views.update();
            this.time += 1/60.0;
        }

        debugPrint(text : string) {
            this.debugText += text;
        }

        debugPrintln(text : string) {
            this.debugText += text + "\n";
        }

        protected abstract preloadAssets(game : Phaser.Game) : void;

        protected abstract loadData(game : Phaser.Game) : GameData;

        protected abstract loadModel(game : Phaser.Game) : GameState;

        protected abstract createControllers() : Array<Controller<GameState>>;

        protected abstract createView(gameState : GameState) : GameView;

        protected abstract saveModel(gameState : GameState) : void;
    }

    export var GAME_ENGINE : GameEngine;
}