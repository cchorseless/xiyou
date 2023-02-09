import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../../entityPlus/Base_Plus";
import { IBuilding_BaseNpc } from "../Building_BaseNpc";

@registerUnit()
export class building_hero_axe extends BaseNpc_Plus implements IBuilding_BaseNpc {
    Spawn(entityKeyValues: CScriptKeyValues) {
        GLogHelper.print("building_hero_axe", "Spawn")
        GLogHelper.print(entityKeyValues.GetValue("Ability1"))
        GLogHelper.print(entityKeyValues.GetValue("Ability2"))
        GLogHelper.print(entityKeyValues.GetValue("Ability6"))
        //     if (!IsServer()) {
        //         return;
        //     }
        //    this.FindAbilityByName

        //     let len = this.GetAbilityCount();
        //     for (let i = 0; i < len; i++) {
        //         let ability = this.GetAbilityByIndex(i);
        //         if (ability) ability.UpgradeAbility(true);
        //     }

        //  GameFunc.BindInstanceToCls()
    }
    onSpawned(event: NpcSpawnedEvent) {
        // let abilty2 = KVHelper.GetUnitData(this.GetUnitName(), "Ability2") as string;
        // let abilty6 = KVHelper.GetUnitData(this.GetUnitName(), "Ability6") as string;
        // let abi2 = this.FindAbilityByName(abilty2);
        // let abi6 = this.FindAbilityByName(abilty6);
        // if (abi2) {
        //     GLogHelper.print(abi2.GetAbilityName())
        //     if (IsClient()) {
        //         // GLogHelper.print(Object.keys(getmetatable(abi2).__index))
        //         // GLogHelper.print(Object.keys((BaseAbility.prototype as any).__index.__index))
        //         // setmetatable(BaseAbility_Plus, getmetatable(abi2) as any)

        //         // setmetatable(abi2, BaseAbility_Plus.prototype as any)
        //         // GameFunc._BindInstanceToCls(abi2, BaseAbility_Plus);
        //     }
        //     GLogHelper.print(abi2.GetClassname(), abi2.GetManaCost == null)
        // }
        // if (abi6) {
        //     // GameFunc.BindInstanceToCls(abi6, BaseAbility_Plus, true)
        // }
    }
}
