import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";

export class PlayerState {
    /**出生点信息 */
    static HeroReSpawnPoint: { playerid: PlayerID[], Vector: Vector[] };
    
    static HeroSpawnPoint: Vector[] = [];
    
    static init() {
        this.HeroSpawnPoint.push(Entities.FindByName(null, "player_startpoint0").GetAbsOrigin());
        this.HeroSpawnPoint.push(Entities.FindByName(null, "player_startpoint1").GetAbsOrigin());
        this.HeroSpawnPoint.push(Entities.FindByName(null, "player_startpoint2").GetAbsOrigin());
        this.HeroSpawnPoint.push(Entities.FindByName(null, "player_startpoint3").GetAbsOrigin());
        this.HeroSpawnPoint.push(Entities.FindByName(null, "player_startpoint4").GetAbsOrigin());
    }
}