export module PlayerConfig {

    export namespace I {
        export interface INetTableETEntity {
            EntityId: EntityIndex;
        }
    }

    export enum EProtocol {
        reqApplyPopuLevelUp = "reqApplyPopuLevelUp",
        reqApplyTechLevelUp = "reqApplyTechLevelUp",
    }
}