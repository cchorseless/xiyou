
export module AoiHelper {

    export function FindUnitsInRing(
        teamNumber: DOTATeam_t,
        position: Vector,
        cacheUnit: IBaseNpc_Plus,
        ring_radius: number,
        ring_width: number,
        teamFilter: DOTA_UNIT_TARGET_TEAM,
        typeFilter: DOTA_UNIT_TARGET_TYPE,
        flagFilter: DOTA_UNIT_TARGET_FLAGS,
        order: FindOrder,
        canGrowCache: boolean) {
        let all_units = FindUnitsInRadius(teamNumber, position, cacheUnit, ring_radius, teamFilter, typeFilter, flagFilter, order, canGrowCache);
        let outer_ring_units: IBaseNpc_Plus[] = []
        for (const unit of (all_units)) {
            if (GFuncVector.CalculateDistance(unit.GetAbsOrigin(), position) >= ring_radius - ring_width) {
                outer_ring_units.push(unit);
            }
        }
        return outer_ring_units;
    }
    export function FindUnitsInCone(
        teamNumber: DOTATeam_t,
        vDirection: Vector,
        vPosition: Vector,
        startRadius: number,
        endRadius: number,
        flLength: number,
        hCacheUnit: IBaseNpc_Plus,
        targetTeam: DOTA_UNIT_TARGET_TEAM,
        targetUnit: DOTA_UNIT_TARGET_TYPE,
        targetFlags: DOTA_UNIT_TARGET_FLAGS,
        findOrder: FindOrder,
        bCache: boolean) {
        let vDirectionCone = Vector(vDirection.y, -vDirection.x, 0.0);
        let enemies = FindUnitsInRadius(teamNumber, vPosition, hCacheUnit, endRadius + flLength, targetTeam, targetUnit, targetFlags, findOrder, bCache);
        let unitTable: IBaseNpc_Plus[] = []
        if ((enemies.length) > 0) {
            for (const enemy of (enemies)) {
                if (enemy != undefined) {
                    let vToPotentialTarget = enemy.GetOrigin() - vPosition as Vector;
                    let flSideAmount = math.abs(vToPotentialTarget.x * vDirectionCone.x + vToPotentialTarget.y * vDirectionCone.y + vToPotentialTarget.z * vDirectionCone.z);
                    let enemy_distance_from_caster = (vToPotentialTarget.x * vDirection.x + vToPotentialTarget.y * vDirection.y + vToPotentialTarget.z * vDirection.z);
                    let max_increased_radius_from_distance = endRadius - startRadius;
                    let pct_distance = enemy_distance_from_caster / flLength;
                    let radius_increase_from_distance = max_increased_radius_from_distance * pct_distance;
                    if ((flSideAmount < startRadius + radius_increase_from_distance) && (enemy_distance_from_caster > 0.0) && (enemy_distance_from_caster < flLength)) {
                        unitTable.push(enemy);
                    }
                }
            }
        }
        return unitTable;
    }

    export function FindUnitsInBicycleChain(
        nTeamNumber: DOTATeam_t,
        vCenterPos: Vector,
        vStartPos: Vector,
        vEndPos: Vector,
        fStartRadius: number,
        fEndRadius: number,
        hCacheUnit: IBaseNpc_Plus,
        nTeamFilter: DOTA_UNIT_TARGET_TEAM,
        nTypeFilter: DOTA_UNIT_TARGET_TYPE,
        nFlagFilter: DOTA_UNIT_TARGET_FLAGS,
        nOrderFilter: FindOrder,
        bCanGrowCache: boolean) {
        let direction = vEndPos - vStartPos as Vector;
        direction.z = 0;
        let distance = direction.Length2D();
        direction = direction.Normalized();
        let big_radius = distance + math.max(fStartRadius, fEndRadius);
        let units = FindUnitsInRadius(nTeamNumber, vCenterPos, hCacheUnit, big_radius, nTeamFilter, nTypeFilter, nFlagFilter, nOrderFilter, bCanGrowCache);
        let targets: IBaseNpc_Plus[] = []
        for (const unit of (units)) {
            let vUnitPos = unit.GetOrigin() - vStartPos as Vector;
            let fProjection = vUnitPos.x * direction.x + vUnitPos.y * direction.y + vUnitPos.z * direction.z;
            fProjection = math.max(math.min(fProjection, distance), 0);
            let vProjection = direction * fProjection;
            let fUnitRadius = (vUnitPos - vProjection as Vector).Length2D();
            let fInterpRadius = (fProjection / distance) * (fEndRadius - fStartRadius) + fStartRadius;
            if (fUnitRadius <= fInterpRadius && math.abs(AngleDiff(VectorToAngles(vCenterPos - vStartPos as Vector).y, VectorToAngles(unit.GetAbsOrigin() - vStartPos as Vector).y)) <= 90) {
                targets.push(unit);
            }
        }
        return targets;
    }
    /**
     * 圆形区域找敌方单位
     * @param team
     * @param location
     * @param radius
     * @param exclude 排除的实体
     * @param teamFilter
     * @param typeFilter
     * @param flagFilter
     * @param order
     * @param cacheUnit
     * @param canGrowCache
     */
    export function FindEntityInRadius(
        team: DOTATeam_t,
        location: Vector,
        radius: number,
        exclude: IBaseNpc_Plus[] | null = null,
        teamFilter: DOTA_UNIT_TARGET_TEAM = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
        typeFilter: DOTA_UNIT_TARGET_TYPE = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
        flagFilter: DOTA_UNIT_TARGET_FLAGS = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
        order: FindOrder = FindOrder.FIND_ANY_ORDER,
        cacheUnit: IBaseNpc_Plus | undefined = null,
        canGrowCache: boolean = false,
    ) {
        let find = FindUnitsInRadius(team, location, cacheUnit, radius, teamFilter, typeFilter, flagFilter, order, canGrowCache) as IBaseNpc_Plus[]
        if (find && find.length > 0 && exclude && exclude.length > 0) {
            let _r: IBaseNpc_Plus[] = [];
            for (let entity of find) {
                if (exclude.indexOf(entity) == -1) {
                    _r.push(entity)
                }
            }
            return _r
        }
        return find as IBaseNpc_Plus[]
    }

    /**
     * 找到范围内一个距离最近的单位
     * @param team
     * @param location
     * @param radius
     * @param exclude
     * @param teamFilter
     * @param typeFilter
     * @param flagFilter
     */
    export function FindOneUnitsInRadius(
        team: DOTATeam_t,
        location: Vector,
        radius: number,
        exclude: IBaseNpc_Plus[] | null = null,
        teamFilter: DOTA_UNIT_TARGET_TEAM = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
        typeFilter: DOTA_UNIT_TARGET_TYPE = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
        flagFilter: DOTA_UNIT_TARGET_FLAGS = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
        findOrder: FindOrder = FindOrder.FIND_CLOSEST
    ) {
        let find = FindEntityInRadius(team, location, radius, exclude, teamFilter, typeFilter, flagFilter, findOrder);
        while (find.length > 0) {
            let r = find.shift();
            if (GFuncEntity.IsValid(r) && r.IsAlive()) {
                return r
            }
        }

    }


    //  获取某单位范围内单位最多的单位
    //  搜索点，搜索范围，队伍，范围，队伍过滤，类型过滤，特殊过滤
    export function GetAOEMostTargetsSpellTarget(
        search_position: Vector,
        search_radius: number,
        team_number: DOTATeam_t,
        radius: number,
        exclude: IBaseNpc_Plus[] | null,
        team_filter: DOTA_UNIT_TARGET_TEAM,
        type_filter: DOTA_UNIT_TARGET_TYPE,
        flag_filter: DOTA_UNIT_TARGET_FLAGS,
        order: FindOrder = FindOrder.FIND_ANY_ORDER) {
        let targets;
        if (IsInToolsMode()) {
            targets = FindUnitsInRadius(team_number, search_position, null, search_radius + radius, team_filter, type_filter, flag_filter, order, false)
        }
        else {
            targets = AoiHelper.FindEntityInRadius(team_number, search_position, search_radius + radius, exclude, team_filter, type_filter, flag_filter, order)
        }
        let target;
        let iMax = 0
        for (let i = 0; i < targets.length; i++) {
            let first_target = targets[i]
            let n = 0
            if (first_target.IsPositionInRange(search_position, search_radius)) {
                if (target == null) {
                    target = first_target
                }
                for (let j = 0; j < targets.length; j++) {
                    //  N = N + 1
                    let second_target = targets[j]
                    if (second_target.IsPositionInRange(first_target.GetAbsOrigin(), radius + second_target.GetHullRadius())) {
                        n = n + 1
                    }
                }
            }
            if (n > iMax) {
                target = first_target
                iMax = n
            }
        }
        return target
    }
    // 获取一定范围内单位最多的点
    // 搜索点，搜索范围，队伍，范围，队伍过滤，类型过滤，特殊过滤
    export function GetAOEMostTargetsPosition(
        search_position: Vector,
        search_radius: number,
        team_number: DOTATeam_t,
        radius: number,
        exclude: IBaseNpc_Plus[] | null,
        team_filter: DOTA_UNIT_TARGET_TEAM,
        type_filter: DOTA_UNIT_TARGET_TYPE,
        flag_filter: DOTA_UNIT_TARGET_FLAGS,
        order: FindOrder = FindOrder.FIND_ANY_ORDER): Vector | void {
        let targets;
        if (IsInToolsMode()) {
            targets = FindUnitsInRadius(team_number, search_position, null, search_radius + radius, team_filter, type_filter, flag_filter, order, false)
        }
        else {
            targets = AoiHelper.FindEntityInRadius(team_number, search_position, search_radius + radius, exclude, team_filter, type_filter, flag_filter, order)
        }
        let position = Vector();
        //  let N = 0
        if (targets.length == 1) {
            let vDirection = (targets[0].GetAbsOrigin() - search_position) as Vector;
            vDirection.z = 0
            position = GetGroundPosition((search_position + vDirection.Normalized() * math.min(search_radius - 1, vDirection.Length2D())) as Vector, null)
        }
        else if (targets.length > 1) {
            let tPoints: Vector[] = [];
            //  取圆中点或交点
            for (let i = 0; i < targets.length; i++) {
                let first_target = targets[i]
                //  DebugDrawCircle(first_target.GetAbsOrigin(), Vector(0, 255, 0), 32, radius, false, 0.5)
                for (let j = i + 1; i < targets.length; j++) {
                    //  N = N + 1
                    let second_target = targets[j]
                    let vDirection = (second_target.GetAbsOrigin() - first_target.GetAbsOrigin()) as Vector;
                    vDirection.z = 0
                    let fDistance = vDirection.Length2D()
                    if (fDistance <= radius * 2 && fDistance > 0) {
                        let vMid = (second_target.GetAbsOrigin() + first_target.GetAbsOrigin()) / 2 as Vector;
                        if (((vMid - search_position) as Vector).Length2D() <= search_radius) {
                            tPoints.push(vMid);
                        }
                        else {
                            let fHalfLength = math.sqrt(radius ^ 2 - (fDistance / 2) ^ 2)
                            let v = GFuncVector.Rotation2D(vDirection.Normalized(), math.rad(90))
                            let p = [
                                vMid - v * fHalfLength,
                                vMid + v * fHalfLength
                            ] as Vector[];
                            for (let vPoint of p) {
                                if (((vPoint - search_position) as Vector).Length2D() <= search_radius) {
                                    tPoints.push(vPoint);
                                }
                            }
                        }
                    }
                }
            }
            //  print("O(n):"+N)
            let iMax = 0
            for (let i = 0; i < tPoints.length; i++) {
                let vPoint = tPoints[i]
                let n = 0
                for (let j = 0; j < targets.length; j++) {
                    //  N = N + 1
                    let target = targets[j]
                    if (target.IsPositionInRange(vPoint, radius + target.GetHullRadius())) {
                        n = n + 1
                    }
                }
                if (n > iMax) {
                    position = vPoint
                    iMax = n
                }
            }
            //  如果
            if (GFuncVector.VectorIsZero(position)) {
                let vDirection = (targets[1].GetAbsOrigin() - search_position) as Vector;
                vDirection.z = 0
                position = GetGroundPosition((search_position + vDirection.Normalized() * math.min(search_radius - 1, vDirection.Length2D())) as Vector, null)
            }
        }
        //  获取地面坐标
        if (!GFuncVector.VectorIsZero(position)) {
            position = GetGroundPosition(position, null)
            return position
        }
        //  DebugDrawCircle(position, Vector(0, 255, 255), 32, 64, true, 0.5)
    }
    //  获取一条线上单位最多的施法点
    //  搜索点，搜索范围，队伍，开始宽度，结束宽度，队伍过滤，类型过滤，特殊过滤
    export function GetLinearMostTargetsPosition(
        search_position: Vector,
        search_radius: number,
        team_number: DOTATeam_t,
        start_width: number,
        end_width: number,
        exclude: IBaseNpc_Plus[] | null,
        team_filter: DOTA_UNIT_TARGET_TEAM,
        type_filter: DOTA_UNIT_TARGET_TYPE,
        flag_filter: DOTA_UNIT_TARGET_FLAGS,
        order: FindOrder = FindOrder.FIND_ANY_ORDER) {
        let targets
        if (IsInToolsMode()) {
            targets = FindUnitsInRadius(team_number, search_position, null, search_radius + end_width, team_filter, type_filter, flag_filter, order, false)
        } else {
            targets = AoiHelper.FindEntityInRadius(team_number, search_position, search_radius + end_width, exclude, team_filter, type_filter, flag_filter, order)
        }
        let position = vec3_invalid
        //  let N = 0
        if (targets.length == 1) {
            let vDirection = (targets[0].GetAbsOrigin() - search_position) as Vector;
            vDirection.z = 0
            position = (search_position + vDirection.Normalized() * (search_radius - 1)) as Vector;
        }
        else if (targets.length > 1) {
            let tPolygons: Vector[][] = [];
            for (let i = 0; i < targets.length; i++) {
                let first_target = targets[i]
                for (let j = i + 1; j < targets.length; j++) {
                    //  N = N + 1
                    let second_target = targets[j]
                    let vDirection1 = (first_target.GetAbsOrigin() - search_position) as Vector
                    vDirection1.z = 0
                    let vDirection2 = (second_target.GetAbsOrigin() - search_position) as Vector
                    vDirection2.z = 0
                    let vDirection = ((vDirection1 + vDirection2) / 2) as Vector
                    vDirection.z = 0
                    let v = GFuncVector.Rotation2D(vDirection.Normalized(), math.rad(90))
                    let vEndPosition = (search_position + vDirection.Normalized() * (search_radius - 1)) as Vector
                    let tPolygon = [
                        search_position + v * start_width,
                        vEndPosition + v * end_width,
                        vEndPosition,
                        vEndPosition - v * end_width,
                        search_position - v * start_width
                    ] as Vector[];
                    if ((GFuncVector.IsPointInPolygon(first_target.GetAbsOrigin(), tPolygon) || first_target.IsPositionInRange(tPolygon[3], end_width + first_target.GetHullRadius()))
                        && (GFuncVector.IsPointInPolygon(second_target.GetAbsOrigin(), tPolygon) || second_target.IsPositionInRange(tPolygon[3], end_width + second_target.GetHullRadius()))) {
                        tPolygons.push(tPolygon)
                    }
                }
                let vDirection = (first_target.GetAbsOrigin() - search_position) as Vector
                vDirection.z = 0
                let v = GFuncVector.Rotation2D(vDirection.Normalized(), math.rad(90))
                let vEndPosition = search_position + vDirection.Normalized() * (search_radius - 1)
                let tPolygon = [
                    search_position + v * start_width,
                    vEndPosition + v * end_width,
                    vEndPosition,
                    vEndPosition - v * end_width,
                    search_position - v * start_width
                ] as Vector[];
                tPolygons.push(tPolygon)
            }
            //  print("O(n):"+N)
            let iMax = 0
            for (let i = 1; i <= tPolygons.length; i++) {
                let tPolygon = tPolygons[i]
                let n = 0
                for (let j = 1; j <= targets.length; j++) {
                    //  N = N + 1
                    let target = targets[j]
                    if (GFuncVector.IsPointInPolygon(target.GetAbsOrigin(), tPolygon) || target.IsPositionInRange(tPolygon[3], end_width + target.GetHullRadius())) {
                        n = n + 1
                    }
                }
                if (n > iMax) {
                    position = tPolygon[3]
                    iMax = n
                }
            }
        }
        //  print("O(n):"+N)
        if (position != vec3_invalid) {
            position = GetGroundPosition(position, null)
        }
        //  DebugDrawCircle(position, Vector(0, 255, 255), 32, 64, true, 0.5)
        return position
    }

    /**
     * 获取弹射目标
     * @param unit_table 排除的单位
     * @param team_number 队伍
     * @param position 选择位置
     * @param radius 范围
     * @param team_filter 队伍过滤
     * @param type_filter 类型过滤
     * @param flag_filter 特殊过滤
     * @param position 圆心，默认最后一个排除的NPC位置
     * @param order 选择方式
     * @param can_bounce_bounced_unit 是否可以弹射回来（缺省false
     */
    export function GetBounceTarget(
        unit_table: IBaseNpc_Plus[],
        team_number: DOTATeam_t,
        radius: number,
        team_filter: DOTA_UNIT_TARGET_TEAM,
        type_filter: DOTA_UNIT_TARGET_TYPE,
        flag_filter: DOTA_UNIT_TARGET_FLAGS,
        position: Vector = null,
        order: FindOrder = FindOrder.FIND_CLOSEST,
        can_bounce_bounced_unit = false): IBaseNpc_Plus | null {
        let last_target = unit_table[unit_table.length - 1];
        if (!GFuncEntity.IsValid(last_target)) {
            return
        }
        if (position == null) {
            position = last_target.GetAbsOrigin();
        }
        let exclude = unit_table;
        // 能弹射回来
        if (can_bounce_bounced_unit) {
            exclude = [last_target]
        }
        let first_targets = FindEntityInRadius(team_number, position, radius, exclude, team_filter, type_filter, flag_filter, order)
        while (first_targets.length > 0) {
            let nextUnit = first_targets.shift();
            if (GFuncEntity.IsValid(nextUnit) && nextUnit.IsAlive()) {
                return nextUnit
            }
        }
    }

    /**
     * 进行分裂操作
     * @param hAttacker 攻击者，
     * @param hTarget 攻击目标，
     * @param fStartWidth 开始宽度，
     * @param fEndWidth 结束宽度，
     * @param fDistance 距离，
     * @param func 操作函数
     * @param iTeamFilter
     * @param iTypeFilter
     * @param iFlagFilter
     */
    export function DoCleaveAction(
        hAttacker: IBaseNpc_Plus,
        hTarget: IBaseNpc_Plus,
        fStartWidth: number,
        fEndWidth: number,
        fDistance: number,
        func: (s: IBaseNpc_Plus) => Boolean | void,
        iTeamFilter: DOTA_UNIT_TARGET_TEAM = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
        iTypeFilter: DOTA_UNIT_TARGET_TYPE = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
        iFlagFilter: DOTA_UNIT_TARGET_FLAGS = (DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE),
    ) {
        let fRadius = math.sqrt(fDistance ^ 2 + (fEndWidth / 2) ^ 2)
        let vStart = hAttacker.GetAbsOrigin()
        let vDirection = (hTarget.GetAbsOrigin() - vStart) as Vector
        vDirection.z = 0
        vDirection = vDirection.Normalized()
        let vEnd = (vStart + vDirection * fDistance) as Vector
        let v = GFuncVector.Rotation2D(vDirection, math.rad(90))
        let tPolygon = [
            vStart + v * fStartWidth,
            vEnd + v * fEndWidth,
            vEnd - v * fEndWidth,
            vStart - v * fStartWidth
        ] as Vector[]
        DebugDrawLine(tPolygon[0], tPolygon[2], 255, 255, 255, true, hAttacker.GetSecondsPerAttack())
        DebugDrawLine(tPolygon[2], tPolygon[3], 255, 255, 255, true, hAttacker.GetSecondsPerAttack())
        DebugDrawLine(tPolygon[3], tPolygon[4], 255, 255, 255, true, hAttacker.GetSecondsPerAttack())
        DebugDrawLine(tPolygon[4], tPolygon[0], 255, 255, 255, true, hAttacker.GetSecondsPerAttack())
        let iTeamNumber = hAttacker.GetTeamNumber()
        let tTargets = AoiHelper.FindEntityInRadius(iTeamNumber, vStart, fRadius + 100, [hTarget], iTeamFilter, iTypeFilter, iFlagFilter, FindOrder.FIND_CLOSEST)
        for (let hUnit of (tTargets)) {
            if (GFuncVector.IsPointInPolygon(hUnit.GetAbsOrigin(), tPolygon)) {
                if (func(hUnit)) {
                    break
                }
            }
        }
    }
    /**
     * 找到含有BUFF的目标
     * @param sModifierName
     * @param iTeamNumber
     * @param vPosition
     * @param fRadius
     * @param iTeamFilter
     * @param iTypeFilter
     * @param iFlagFilter
     * @param iOrder
     * @returns
     */
    export function FindUnitsInRadiusByModifierName(
        sModifierName: string,
        iTeamNumber: DOTATeam_t,
        vPosition: Vector,
        fRadius: number,
        iTeamFilter: DOTA_UNIT_TARGET_TEAM,
        iTypeFilter: DOTA_UNIT_TARGET_TYPE,
        iFlagFilter: DOTA_UNIT_TARGET_FLAGS,
        iOrder: FindOrder) {
        let tUnits = FindUnitsInRadius(iTeamNumber, vPosition, null, fRadius, iTeamFilter, iTypeFilter, iFlagFilter, iOrder, false)
        for (let i = tUnits.length - 1; i >= 0; i--) {
            let hUnit = tUnits[i]
            if (!hUnit.HasModifier(sModifierName)) {
                table.remove(tUnits, i)
            }
        }
        return tUnits
    }

    export function IsNearFountain(location: Vector, distance: number) {
        for (const fountain of (Entities.FindAllByClassname("ent_dota_fountain"))) {
            if ((fountain.GetAbsOrigin() - location as Vector).Length2D() <= distance) {
                return true;
            }
        }
        return false;
    }
    export function IsNearEntity(entities: string, location: Vector, distance: number, owner: IBaseNpc_Plus) {
        for (const entity of (Entities.FindAllByClassname(entities))) {
            if ((entity.GetAbsOrigin() - location as Vector).Length2D() <= distance || owner && (entity.GetAbsOrigin() - location as Vector).Length2D() <= distance && entity.GetOwner() == owner) {
                return true;
            }
        }
        return false;
    }
    export function IsNearPosition(entities: string, location: Vector, distance: number) {
        for (const fountain of (Entities.FindAllByClassname(entities))) {
            if ((fountain.GetAbsOrigin() - location as Vector).Length2D() <= distance) {
                return true;
            }
        }
        return false;
    }
    export function IsNearEnemyClass(unit: IBaseNpc_Plus, radius: number, cls: string) {
        let class_units = Entities.FindAllByClassnameWithin(cls, unit.GetAbsOrigin(), radius);
        for (const found_unit of (class_units)) {
            if (found_unit.GetTeam() != unit.GetTeam()) {
                return true;
            }
        }
        return false;
    }

}