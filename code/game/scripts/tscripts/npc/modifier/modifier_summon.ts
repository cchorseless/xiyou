import { GameEnum } from "../../GameEnum";
import { BaseModifier_Plus } from "../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../entityPlus/BaseNpc_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, EventDataType, modifier_event } from "./modifier_event";
import { modifier_property } from "./modifier_property";

@registerModifier()
export class modifier_summon extends BaseModifier_Plus {
    IsHidden() { return false }
    IsDebuff() { return true }
    IsPurgable() { return false }
    IsPurgeException() { return true }
    IsStunDebuff() { return true }
    AllowIllusionDuplicate() { return false }



    /**
     * 创建召唤物
     * @param sUnitName
     * @param hCaster
     * @param vLocation
     * @param fDuration
     * @param bFindClearSpace
     * @param iTeamNumber
     * @returns
     */
    static CreateSummon(sUnitName: string, hCaster: BaseNpc_Plus, vLocation: Vector, fDuration: number, bFindClearSpace: boolean = true, iTeamNumber: DOTATeam_t = null) {
        if (!IsServer()) { return };
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        iTeamNumber = iTeamNumber || hCaster.GetTeamNumber()
        let hSummon = CreateUnitByName(sUnitName, vLocation, bFindClearSpace, hHero, hHero, iTeamNumber)
        fDuration = fDuration + modifier_property.SumProps(hCaster, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.SUMMON_DURATION_BONUS);
        modifier_summon.apply(hSummon, hCaster, null, { duration: fDuration })
        modifier_event.FireEvent({
            attacker: hCaster,
            summon: hSummon,
            eventType: EventDataType.attackerIsSelf + EventDataType.OtherCanBeAnyOne,
        }, Enum_MODIFIER_EVENT.ON_SPAWN_SUMMONNED)
        return hSummon
    }

    static GetSummonCount(hCaster: BaseNpc_Plus) {
        return
    }
}

