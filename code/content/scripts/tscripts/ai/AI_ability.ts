import { AoiHelper } from "../helper/AoiHelper";

export module AI_ability {
    export function NO_TARGET_cast(ability: IBaseAbility_Plus | IBaseItem_Plus): boolean {
        let caster = ability.GetCasterPlus();
        ExecuteOrderFromTable({
            UnitIndex: caster.entindex(),
            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
            AbilityIndex: ability.entindex(),
        })
        return true;
    }

    /**
     * 无目标，有敌人
     * @param ability
     * @param range 技能范围
     */
    export function NO_TARGET_if_enemy(ability: IBaseAbility_Plus | IBaseItem_Plus, range: number = 0) {
        let caster = ability.GetCasterPlus();
        if (range == 0 || range == null) range = math.max(200, ability.GetCastRangePlus());
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
    export function TARGET_if_enemy(ability: IBaseAbility_Plus | IBaseItem_Plus, range?: number, _filter?: (enemy: IBaseNpc_Plus) => boolean, findorder?: FindOrder): boolean {
        let caster = ability.GetCasterPlus();
        if (range == 0 || range == null) range = ability.GetCastRangePlus();
        if (range == 0) {
            GLogHelper.warn(`${ability.GetAbilityName()}.TARGET_if_enemy:range==0 `);
            return false;
        }
        let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
        let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
        let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
        let order = findorder || FindOrder.FIND_CLOSEST;
        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
        for (let target of targets) {
            const _filter_r = _filter == null ? true : _filter(target)
            if (_filter_r) {
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
     * @Server
     * @param ability
     * @param range
     * @param _filter 不填，选择最近的敌人
     * @returns
     */
    export function POSITION_if_enemy(ability: IBaseAbility_Plus | IBaseItem_Plus, range?: number, _filter?: (enemy: IBaseNpc_Plus, index?: number, count?: number) => boolean, findorder?: FindOrder) {
        let caster = ability.GetCasterPlus();
        if (range == 0 || range == null) range = ability.GetCastRangePlus();
        if (range == 0) {
            GLogHelper.warn(`${ability.GetAbilityName()}.POSTTION_if_enemy:range==0 `);
            return false;
        }
        let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
        let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
        let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
        let order = findorder || FindOrder.FIND_CLOSEST;
        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
        for (let target of targets) {
            const _filter_r = _filter == null ? true : _filter(target, targets.indexOf(target), targets.length)
            if (_filter_r) {
                let position = GetGroundPosition(target.GetAbsOrigin(), undefined);
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                });
                return true;
            }
        }
        return false;
    }
    export function POSITION_if_friend(ability: IBaseAbility_Plus | IBaseItem_Plus, range?: number, _filter?: (enemy: IBaseNpc_Plus, index?: number, count?: number) => boolean, findorder?: FindOrder) {
        let caster = ability.GetCasterPlus();
        if (range == 0 || range == null) range = ability.GetCastRangePlus();
        if (range == 0) {
            GLogHelper.warn(`${ability.GetAbilityName()}.POSITION_if_friend:range==0 `);
            return false;
        }
        let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
        let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
        let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
        let order = findorder || FindOrder.FIND_CLOSEST;
        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
        for (let target of targets) {
            const _filter_r = _filter == null ? true : _filter(target, targets.indexOf(target), targets.length)
            if (_filter_r) {
                let position = GetGroundPosition(target.GetAbsOrigin(), undefined);
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
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
    export function POSITION_most_enemy(ability: IBaseAbility_Plus | IBaseItem_Plus, range: number = 0, radius: number = 0): boolean {
        let caster = ability.GetCasterPlus();
        if (range == 0 || range == null) range = ability.GetCastRangePlus();
        if (radius == 0 || radius == null) radius = ability.GetAOERadius();
        if (range == 0 || radius == 0) {
            GLogHelper.warn(`${ability.GetAbilityName()}.POSITION_most_enemy:range==0 | radius==0`);
            return false;
        }
        let position = AoiHelper.GetAOEMostTargetsPosition2(caster.GetAbsOrigin(), range,
            caster.GetTeamNumber(), radius, null,
            DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
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

    export function POSITION_most_friend(ability: IBaseAbility_Plus | IBaseItem_Plus, range: number = 0, radius: number = 0): boolean {
        let caster = ability.GetCasterPlus();
        if (range == 0 || range == null) range = ability.GetCastRangePlus();
        if (radius == 0 || radius == null) radius = ability.GetAOERadius();
        if (range == 0 || radius == 0) {
            GLogHelper.warn(`${ability.GetAbilityName()}.POSITION_most_enemy:range==0 | radius==0`);
            return false;
        }
        let position = AoiHelper.GetAOEMostTargetsPosition2(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null,
            DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY,
            DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
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
    export function TARGET_if_friend(ability: IBaseAbility_Plus | IBaseItem_Plus, range?: number, _filter?: (enemy: IBaseNpc_Plus) => boolean) {
        let caster = ability.GetCasterPlus()
        if (range == 0 || range == null) range = ability.GetCastRangePlus();
        if (range == 0) {
            GLogHelper.warn(`${ability.GetAbilityName()}.POSITION_if_friend:range==0 `);
            return false;
        }
        let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
        let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
        let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
        let order = FindOrder.FIND_CLOSEST
        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
        for (let target of targets) {
            const _filter_r = _filter == null ? true : _filter(target)
            if (_filter_r) {
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

    export function TARGET_Self(ability: IBaseAbility_Plus | IBaseItem_Plus,) {
        let caster = ability.GetCasterPlus()
        ExecuteOrderFromTable({
            UnitIndex: caster.entindex(),
            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
            AbilityIndex: ability.entindex(),
            TargetIndex: caster.entindex()
        });
        return true;
    }


}