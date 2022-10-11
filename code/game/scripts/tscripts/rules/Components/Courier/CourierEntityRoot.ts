import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { AbilityManagerComponent } from "../Ability/AbilityManagerComponent";
import { ItemManagerComponent } from "../Item/ItemManagerComponent";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { CourierDataComponent } from "./CourierDataComponent";


export class CourierEntityRoot extends PlayerCreateBattleUnitEntityRoot {
    onAwake() {
        let hero = this.GetDomain<BaseNpc_Hero_Plus>();
        (this as any).Playerid = hero.GetPlayerOwnerID();
        (this as any).ConfigID = hero.GetUnitName();
        (this as any).EntityId = hero.GetEntityIndex();
        this.AddComponent(PrecacheHelper.GetRegClass<typeof CourierDataComponent>("CourierDataComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof AbilityManagerComponent>("AbilityManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof ItemManagerComponent>("ItemManagerComponent"));
    }
    
    CourierDataComp() {
        return this.GetComponentByName<CourierDataComponent>("CourierDataComponent");
    }

    AbilityManagerComp() {
        return this.GetComponentByName<AbilityManagerComponent>("AbilityManagerComponent");
    }
    ItemManagerComp() {
        return this.GetComponentByName<ItemManagerComponent>("ItemManagerComponent");
    }
}