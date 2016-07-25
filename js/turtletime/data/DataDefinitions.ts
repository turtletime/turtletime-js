///<reference path="../../defs/phaser.comments.d.ts"/>

module TurtleTime {
    export interface EntityData {
        position:Array<number>,
        direction:string,
        actionStatus:string,
        appearanceID:string,
        additionalData:any
    }

    export interface RoomData {
        size: Array<number>,
        wallHeight: number,
        floorPattern: string,
        wallPattern: string
    }

    export interface UITemplateData {
        id: string,
        subs?: Array<string>
    }

    export interface UIContainerData {
        anchor: Array<number>,
        position: Array<string>,
        size: Array<string>
    }

    export interface UISpriteData {
        spriteID: string,
        tint? : string
    }

    export interface UITextData {
        text?: string,
        font?: string,
        size?: string,
        justify?: string,
        tint?: string
    }

    export interface UIGeometryData {
        fillColor? : string;
        lineColor? : string;
        lineWeight? : string;
        cornerRadius? : string;
    }

    export interface UIAppearanceData {
        sprite? : UISpriteData,
        text? : UITextData,
        geometry? : UIGeometryData
    }

    export interface UIAppearanceCollectionData {
        normal?: UIAppearanceData
    }

    export interface UIData {
        id: string,
        container?: UIContainerData,
        appearance?: UIAppearanceCollectionData,
        children?: Array<UIData>,
        template?: UITemplateData,
        type?: string
    }

    export interface UIDataCollection {
        templates: Array<UIData>,
        layout: UIData
    }

    /**
     * Data about each individual turtle.
     */
    export interface TurtleData {
        name: string,
        description: string,
        likes: Array<string>,
        dislikes: Array<string>
    }

    /**
     * User-specific data; serializable.
     */
    export interface UserData {
        cafeState: {
            turtles: Array<EntityData>,
            chairs: Array<EntityData>,
            tables: Array<EntityData>,
            doors: Array<EntityData>,
            wallDecor: Array<EntityData>,
            roomDecor: Array<EntityData>,
            food: Array<EntityData>
        },
        room: RoomData
    }

    /**
     * Static, globally-accessible data.
     */
    export interface GameData {
        turtleData: Map<string, TurtleData>,
        spriteSpecs: SpriteData,
        roomScale: Array<number>,
        maxRoomSize: Point,
        screenSize: Point
    }
}