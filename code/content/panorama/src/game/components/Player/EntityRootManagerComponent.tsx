import { NetHelper } from "../../../helper/NetHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ET, registerET } from "../../../libs/Entity";
import { PlayerConfig } from "../../system/Player/PlayerConfig";
import { AbilityEntityRoot } from "../Ability/AbilityEntityRoot";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { EnemyUnitEntityRoot } from "../Enemy/EnemyUnitEntityRoot";
import { FakerHeroEntityRoot } from "../FakerHero/FakerHeroEntityRoot";
import { PlayerEntityRoot } from "./PlayerEntityRoot";
import { PlayerScene } from "./PlayerScene";

@registerET()
export class EntityRootManagerComponent extends ET.Component {
    readonly AllPlayers: { [playerid: string]: string } = {};
    readonly AllBuilding: { [entityid: string]: string } = {};
    readonly AllEnemy: { [entityid: string]: string } = {};
    readonly AllAbility: { [playerid: string]: string } = {};
    readonly AllFakerHero: { [playerid: string]: string } = {};

    onAwake() {
        let maxPlayers = Players.GetMaxPlayers();
        for (let i = 0; i < maxPlayers; i++) {
            let playerid = i as PlayerID;
            if (Players.IsValidPlayerID(playerid)) {
                this.addPlayer(playerid)
            }
        }
    }
    getAllPlayer() {
        let players: PlayerEntityRoot[] = [];
        for (let k in this.AllPlayers) {
            let player = this.getPlayer(Number(k) as PlayerID);
            if (player) {
                players.push(player);
            }
        }
        return players;
    }

    getPlayer(playerid: PlayerID) {
        let entityid = this.AllPlayers[playerid];
        if (entityid) {
            return this.GetChild<PlayerEntityRoot>(entityid);
        }
    }

    addPlayer(playerid: PlayerID) {
        let playertype = PrecacheHelper.GetRegClass<typeof PlayerEntityRoot>("PlayerEntityRoot");
        let player = this.AddChild(playertype, playerid);
        this.AllPlayers[playerid] = player.Id;
    }

    getAllFakerHero() {
        let fakerheros: FakerHeroEntityRoot[] = [];
        for (let k in this.AllFakerHero) {
            let fakerhero = this.getFakerHero(Number(k) as PlayerID);
            if (fakerhero) {
                fakerheros.push(fakerhero);
            }
        }
        return fakerheros;
    }

    getFakerHero(playerid: PlayerID) {
        let entityid = this.AllFakerHero[playerid + ""];
        if (entityid) {
            return this.GetChild<FakerHeroEntityRoot>(entityid);
        }
        else {

        }
    }

    addFakerHero(b: FakerHeroEntityRoot) {
        this.AllFakerHero[b.Playerid + ""] = b.Id;
        this.AddOneChild(b);
    }

    addAbility(b: AbilityEntityRoot) {
        this.AllAbility[b.EntityId + ""] = b.Id;
        this.AddOneChild(b);
    }

    removeAbility(b: AbilityEntityRoot) {
        delete this.AllAbility[b.EntityId];
        b.Dispose();
    }

    getAbility(entityIndex: number | string) {
        let entityid = this.AllAbility[entityIndex + ""];
        if (entityid) {
            return this.GetChild<AbilityEntityRoot>(entityid);
        }
    }

    addBuilding(b: BuildingEntityRoot) {
        this.AllBuilding[b.EntityId + ""] = b.Id;
        this.AddOneChild(b);
    }

    removeBuilding(b: BuildingEntityRoot) {
        delete this.AllBuilding[b.EntityId];
        b.Dispose();
    }

    getBuilding(entityIndex: number | string) {
        let entityid = this.AllBuilding[entityIndex + ""];
        if (entityid) {
            return this.GetChild<BuildingEntityRoot>(entityid);
        }
    }

    addEnemy(b: EnemyUnitEntityRoot) {
        this.AllEnemy[b.EntityId + ""] = b.Id;
        this.AddOneChild(b);
    }

    removeEnemy(b: EnemyUnitEntityRoot) {
        delete this.AllEnemy[b.EntityId];
        b.Dispose();
    }

    getEnemy(entityIndex: number | string) {
        let entityid = this.AllEnemy[entityIndex + ""];
        if (entityid) {
            return this.GetChild<EnemyUnitEntityRoot>(entityid);
        }
    }
}
