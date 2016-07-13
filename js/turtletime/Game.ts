///<reference path="model/GameState.ts"/>
///<reference path="data/DataDefinitions.ts"/>
///<reference path="core/Controller.ts"/>
///<reference path="core/GameView.ts"/>
///<reference path="core/GameEngine.ts"/>

namespace TurtleTime {
    export class TurtleTimeGame extends GameEngine {
        protected preloadAssets(game : Phaser.Game):void {
            game.load.spritesheet('turtle', 'assets/textures/turtle.png', 45, 60);
            game.load.image('highlightCircle', 'assets/textures/highlightCircle.png');
            game.load.spritesheet('tableandchair', 'assets/textures/tableandchair.png', 52, 52);
            game.load.image('tile', 'assets/textures/tile.png');
            game.load.image('brick', 'assets/textures/brick.png');
            game.load.image('brick_top', 'assets/textures/bricktop.png');
            game.load.image('blackboard', 'assets/textures/blackboard.png');
            game.load.json('user_data_new', 'assets/json/new_user_data.json');
            game.load.json('turtle_data', 'assets/json/turtles.json');
            game.load.json('sprite_data', 'assets/json/sprites.json');
            game.load.json('ui_data', 'assets/json/ui.json');
        }

        protected loadData(game:Phaser.Game):GameData {
            return {
                turtleData: ((json : any) : Map<string, TurtleData> => {
                    var result : Map<string, TurtleData> = new Map();
                    var turtles = json["turtles"];
                    for (var turtle in turtles) {
                        if (turtles.hasOwnProperty(turtle)) {
                            result.set(turtle, turtles[turtle]);
                        }
                    }
                    return result;
                })(game.cache.getJSON('turtle_data')),
                spriteSpecs: new SpriteData(game.cache.getJSON('sprite_data')),
                roomScale: [32, 24],
                maxRoomSize: new Point(12, 16),
                screenSize: new Point(game.width, game.height)
            };
        }

        protected loadModel(game : Phaser.Game):GameState {
            var userData : UserData = JSON.parse(localStorage.getItem('user_data'));
            if (userData == null || checkGlobalOption('noload')) {
                userData = game.cache.getJSON('user_data_new');
                if (localStorage.getItem('user_data')) {
                    localStorage.removeItem('user_data');
                }
            }
            return {
                inputState : new InputModel(),
                selectionModel : new SelectionModel(),
                entities : {
                    turtles : new EntityCollection(Turtle, userData.cafeState.turtles),
                    chairs : new EntityCollection(Chair, userData.cafeState.chairs),
                    tables: new EntityCollection(Table, userData.cafeState.tables),
                    doors: new EntityCollection(Door, userData.cafeState.doors),
                    wallDecor: new EntityCollection(WallDecoration, userData.cafeState.wallDecor),
                    food: new EntityCollection(Food, userData.cafeState.food)
                },
                roomModel: new RoomModel(userData.room),
                uiModel: new UIModel(game.cache.getJSON('ui_data'))
            };
        }

        protected createControllers():Array<Controller<GameState>> {
            return [new RoomLayoutController(), new TurtleController(), new InputController(), new TurtleSpawnController(), new DragController()];
        }

        protected createView(gameState:GameState):GameView {
            var view : GameView = new GameView();
            view.add(new RoomView(gameState.roomModel));
            view.add(new DragView(gameState.selectionModel));
            view.add(new DebugView());
            view.add(new UIView(gameState.uiModel));
            return view;
        }

        protected saveModel(gameState : GameState) : void {
            if (checkGlobalOption('nosave')) {
                return;
            }
            var userData : UserData = {
                cafeState: {
                    turtles: gameState.entities.turtles.serialize(),
                    chairs: gameState.entities.chairs.serialize(),
                    tables: gameState.entities.tables.serialize(),
                    doors: gameState.entities.doors.serialize(),
                    wallDecor: gameState.entities.wallDecor.serialize(),
                    roomDecor: [],
                    food: gameState.entities.food.serialize()
                },
                room: gameState.roomModel.serialize()
            };
            localStorage.setItem('user_data', JSON.stringify(userData));
        }
    }
}