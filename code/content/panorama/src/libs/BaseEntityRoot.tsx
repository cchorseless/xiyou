import { ET, ETEntitySystem } from "../../../scripts/tscripts/shared/lib/Entity";

export class BaseEntityRoot extends ET.EntityRoot {
    readonly ConfigID: string;
    readonly EntityId: EntityIndex;
    public GetPlayer() {
        return GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
    }
    onSerializeToEntity() {
        BaseEntityRoot.AllEntity[this.EntityId + ""] = this.InstanceId;
    }
    onDestroy() {
        delete BaseEntityRoot.AllEntity[this.EntityId + ""];
    }

    static readonly AllEntity: { [entityid: string]: string } = {};
    static GetEntity<T extends typeof BaseEntityRoot>(this: T, entityid: string | EntityIndex | number) {
        const instanceID = BaseEntityRoot.AllEntity[entityid + ""];
        if (instanceID) {
            const entity = ETEntitySystem.GetEntity(instanceID) as InstanceType<T>;
            if (entity && entity.GetType() == this.name) {
                return entity;
            }
        }
    }
    static GetEntityById<T extends typeof BaseEntityRoot>(this: T, selfid: string) {
        const instanceID = selfid.includes(this.name) ? selfid : (selfid + this.name);
        if (instanceID) {
            const entity = ETEntitySystem.GetEntity(instanceID) as InstanceType<T>;
            if (entity && entity.GetType() == this.name) {
                return entity;
            }
        }
    }

    static GetEntityByConfig<T extends typeof BaseEntityRoot>(this: T, playerid: PlayerID, configname: string) {
        let entitys = this.GetGroupInstance(playerid);
        for (let r of entitys) {
            if (r.ConfigID == configname)
                return r;
        }
    }

    static GetBattleEntity(entityid: string | EntityIndex | number) {
        const instanceID = BaseEntityRoot.AllEntity[entityid + ""];
        if (instanceID) {
            const entity = ETEntitySystem.GetEntity(instanceID) as IBattleUnitEntityRoot;
            return entity;
        }
    }

    static GetEntityBelongPlayerId(entityid: string | EntityIndex | number): PlayerID {
        const instanceID = BaseEntityRoot.AllEntity[entityid + ""];
        if (instanceID) {
            const entity = ETEntitySystem.GetEntity(instanceID);
            if (entity)
                return entity.BelongPlayerid;
        }
        return -1;
    }

}

