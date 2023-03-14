import { AoiHelper } from "../helper/AoiHelper"

export module AI_ability {

    /**
     * 无目标，有敌人
     * @param ability
     * @param range 技能范围
     */
    export function NO_TARGET_if_enemy(ability: IBaseAbility_Plus, range: number) {
        let caster = ability.GetCasterPlus()
        let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
        let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
        let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
        let order = FindOrder.FIND_CLOSEST
        let targets = AoiHelper.FindOneUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
        if (targets != null) {
            ExecuteOrderFromTable({
                UnitIndex: caster.entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                AbilityIndex: ability.entindex(),
            })
            return true;
        }
        return false;
    }
    /**
     * @Server
     * @param ability 
     * @param range 
     * @param _filter 不填，选择最近的敌人
     * @returns 
     */
    export function TARGET_if_enemy(ability: IBaseAbility_Plus, range: number, _filter: (enemy: IBaseNpc_Plus) => boolean = (enemy) => true) {
        let caster = ability.GetCasterPlus()
        let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
        let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
        let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
        let order = FindOrder.FIND_CLOSEST
        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
        for (let target of targets) {
            if (_filter(target)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    AbilityIndex: ability.entindex(),
                    TargetIndex: target.entindex()
                });
                return true;
            }
        }
        return false;
    }

    /**
     * 敌人最多的位置
     * @param ability
     * @param range
     * @param radius
     */
    export function POSITION_most_enemy(ability: IBaseAbility_Plus, range: number, radius: number) {
        let caster = ability.GetCasterPlus()
        let team = caster.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_GOODGUYS ? DOTATeam_t.DOTA_TEAM_BADGUYS : DOTATeam_t.DOTA_TEAM_GOODGUYS;
        let position = AoiHelper.GetAOEMostTargetsPosition2(caster.GetAbsOrigin(), range, team, radius, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
        GLogHelper.print("POSITION_most_enemy", position)
        //  施法命令
        if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
            ExecuteOrderFromTable(
                {
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                }
            )
            return true;
        }
        return false;
    }

    /**
     * @Server
     * @param ability 
     * @param range 
     * @param _filter 不填，选择最近的敌人
     * @returns 
     */
    export function TARGET_if_friend(ability: IBaseAbility_Plus, range: number, _filter: (enemy: IBaseNpc_Plus) => boolean = (enemy) => true) {
        let caster = ability.GetCasterPlus()
        let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
        let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
        let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
        let order = FindOrder.FIND_CLOSEST
        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
        for (let target of targets) {
            if (_filter(target)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    AbilityIndex: ability.entindex(),
                    TargetIndex: target.entindex()
                });
                return true;
            }
        }
        return false;
    }
}