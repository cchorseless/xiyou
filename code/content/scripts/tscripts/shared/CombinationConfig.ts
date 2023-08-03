export module CombinationConfig {

    export enum EEffectTargetType {
        // 自己
        self = "self",
        // 激活羁绊的英雄
        hero = "hero",
        // 全队
        team = "team",
        // 敌方
        enemyteam = "enemyteam",
        // 特殊敌人
        enemyspe = "enemyspe",
    }
    export enum ESectName {
        /**加甲流 */
        sect_phyarm_up = "sect_phyarm_up",
        /**生命流 */
        sect_health = "sect_health",
        /**护盾流 */
        sect_shield = "sect_shield",
        /**战意流 */
        sect_warpath = "sect_warpath",
        /**闪避流 */
        sect_miss = "sect_miss",
        /**中毒流 */
        sect_poision = "sect_poision",
        /**石化流 */
        sect_shihua = "sect_shihua",
        /**治疗流 */
        sect_treatment = "sect_treatment",
        /**机械流 */
        sect_tech = "sect_tech",
        /**冰盾流 */
        sect_iceshield = "sect_iceshield",
        /**坚韧流 */
        sect_jianren = "sect_jianren",
        /**链接流 */
        sect_lianjie = "sect_lianjie",
        /**暴击流 */
        sect_phycrit = "sect_phycrit",
        /**野兽流 */
        sect_beast = "sect_beast",
        /**恐惧流 */
        sect_ghost = "sect_ghost",
        /**齐射流 */
        sect_cleave = "sect_cleave",
        /**恶魔流 */
        sect_demon = "sect_demon",
        /**暗杀流 */
        sect_assassinate = "sect_assassinate",
        /**召唤流 */
        sect_summon = "sect_summon",
        /**魔法流 */
        sect_magic = "sect_magic",
        /**火焰流 */
        sect_flame = "sect_flame",
        /**变身流 */
        sect_transform = "sect_transform",
        /**秒杀流 */
        sect_seckill = "sect_seckill",
        /**吞噬流 */
        sect_cannibalism = "sect_cannibalism",
        /**融合流 */
        sect_fusion = "sect_fusion",
        /**祝福流 */
        sect_lucky = "sect_lucky",
        /**减伤流 */
        sect_reduceinjury = "sect_reduceinjury",
        /**冷却流 */
        sect_cd_down = "sect_cd_down",
        /**复制流 */
        sect_copy = "sect_copy",
        /**守卫流 */
        sect_guard = "sect_guard",
        /**大招流 */
        sect_dazhao = "sect_dazhao",
        /**钓鱼流 */
        sect_fish_chess = "sect_fish_chess",
        /**冲锋流 */
        sect_assault = "sect_assault",
        /**多倍流 */
        sect_doublespell = "sect_doublespell",
        /**窃取流 */
        sect_steal = "sect_steal",
        /**吸血流 */
        sect_suck_blood = "sect_suck_blood",
        /**攻速流 */
        sect_atkspeed = "sect_atkspeed",
        /**魅惑流 */
        sect_control = "sect_control",
        /**背叛流 */
        sect_betrayal = "sect_betrayal",


        /**减甲流 */
        // sect_phyarm_down = "sect_phyarm_down",
        /**缴械流 */
        // sect_disarm = "sect_disarm",
        /**减抗流 */
        // sect_magarm_down = "sect_magarm_down",
        /**沉默流 */
        // sect_scilence = "sect_scilence",
        /**切入流 */
        // sect_blink = "sect_blink",
        /**刺甲流 */
        // sect_thorns = "sect_thorns",
        /**妖术流 */
        // sect_black_art = "sect_black_art",
        /**秘法流 */
        // sect_cabala = "sect_cabala",
        /**虚空流 */
        // sect_vanity = "sect_vanity",
        /**光明流 */
        // sect_light = "sect_light",
        /**射手流 */
        // sect_archer = "sect_archer",
        /**武器流 */
        // sect_weapon = "sect_weapon",
        /**领域流 */
        // sect_territory = "sect_territory",
        /**爆头流 */
        // sect_headshot = "sect_headshot",
        /**溅射流 */
        // sect_splash = "sect_splash",
        /**法爆流 */
        // sect_magcrit = "sect_magcrit",
        /**雷电流 */
        // sect_shock = "sect_shock",
        /**发明流 */
        // sect_invent = "sect_invent",
    }

    export const ESectNameList = Object.keys(ESectName);
    // 1	加甲流
    // 2	生命流
    // 3	护盾流
    // 4	战意流
    // 5	闪避流
    // 6	中毒流
    // 7	石化流
    // 8	治疗流
    // 9	机械流
    // 10	冰盾流
    // 11	坚韧流
    // 12	链接流
    // 1	物暴流
    // 2	野兽流
    // 3	恐惧流
    // 4	齐发流
    // 5	恶魔流
    // 6	暗杀流
    // 7	召唤流
    // 8	法师流
    // 9	火焰流
    // 10	变身流
    // 11	秒杀流
    // 12	星级流
    // 1	吞噬流
    // 2	融合流
    // 3	祝福流
    // 4	减伤流
    // 5	冷却流
    // 6	复制流
    // 7	守卫流
    // 8	大招流
    // 9	钓鱼流
    // 10	冲锋流
    // 11	多倍流
    // 12	窃取流
    // 13	吸血流
    // 14	攻速流
    // 15	魅惑流
    // 16	舔狗流


    // 生命流
    // 冰冻流
    // 大招流
    // 普攻流
    // 暴击流
    // 中毒流
    // 闪避流
    // 精灵流
    // 易伤流
    // 护盾流
    // 回复流
    // 战前流

}