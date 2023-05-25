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
        // sect_phyarm_up = "sect_phyarm_up",
        /**减甲流 */
        sect_phyarm_down = "sect_phyarm_down",
        /**吸血流 */
        // sect_suck_blood = "sect_suck_blood",
        /**治疗流 */
        sect_treatment = "sect_treatment",
        /**暴击流 */
        sect_phycrit = "sect_phycrit",
        /**中毒流 */
        sect_poision = "sect_poision",
        /**护盾流 */
        sect_shield = "sect_shield",
        /**闪避流 */
        // sect_miss = "sect_miss",
        /**冰冻流 */
        // sect_ice = "sect_ice",
        /**缴械流 */
        // sect_disarm = "sect_disarm",
        /**复制流 */
        sect_copy = "sect_copy",
        /**召唤流 */
        sect_summon = "sect_summon",
        /**魔法流 */
        sect_magic = "sect_magic",
        /**减抗流 */
        sect_magarm_down = "sect_magarm_down",
        /**变身流 */
        sect_transform = "sect_transform",
        /**沉默流 */
        // sect_scilence = "sect_scilence",
        /**攻速流 */
        sect_atkspeed = "sect_atkspeed",
        /**切入流 */
        // sect_blink = "sect_blink",
        /**生命流 */
        // sect_health = "sect_health",
        /**刺甲流 */
        sect_thorns = "sect_thorns",
        /**战意流 */
        sect_warpath = "sect_warpath",
        /**分裂流 */
        sect_cleave = "sect_cleave",
        /**窃取流 */
        sect_steal = "sect_steal",
        /**钓鱼流 */
        sect_fish_chess = "sect_fish_chess",
        /**发明流 */
        sect_invent = "sect_invent",
        /**冷却流 */
        sect_cd_down = "sect_cd_down",
        /**双头流 */
        // sect_double_head = "sect_double_head",
        /**妖术流 */
        sect_black_art = "sect_black_art",
        /**恶魔流 */
        sect_demon = "sect_demon",
        /**秘法流 */
        // sect_cabala = "sect_cabala",
        /**虚空流 */
        // sect_vanity = "sect_vanity",
        /**光明流 */
        // sect_light = "sect_light",
        /**食人流 */
        sect_cannibalism = "sect_cannibalism",
        /**火焰流 */
        sect_flame = "sect_flame",
        /**射手流 */
        // sect_archer = "sect_archer",
        /**亡灵流 */
        // sect_ghost = "sect_ghost",
        /**武器流 */
        // sect_weapon = "sect_weapon",
        /**冲锋流 */
        // sect_assault = "sect_assault",
        /**领域流 */
        // sect_territory = "sect_territory",
        /**秒杀流 */
        sect_seckill = "sect_seckill",
        /**控场流 */
        // sect_control = "sect_control",
        /**策反流 */
        sect_betrayal = "sect_betrayal",
        /**守卫流 */
        sect_guard = "sect_guard",
        /**爆头流 */
        sect_headshot = "sect_headshot",
        /**溅射流 */
        sect_splash = "sect_splash",
        /**法爆流 */
        sect_magcrit = "sect_magcrit",
        /**雷电流 */
        sect_shock = "sect_shock",

    }

    export const ESectNameList = Object.keys(ESectName);
    // 1加甲流
    // 2减抗流
    // 3暴击流
    // 4缴械
    // 5吸血流
    // 6护盾流
    // 7发明流
    // 8变形流
    // 9秒杀流
    // 10策反流
    // 11减少羁绊流
    // 12闪避流
    // 13战前流
    // 14召唤流
    // 15生命流
    // 16加抗流
    // 17攻速流
    // 18减甲流
    // 19真伤流
    // 20石化流
    // 21攻击距离流
    // 22食人流
    // 23钓鱼流
    // 24CD流
    // 25复制流
    // 26加攻流
    // 27虚空
    // 28飞禽类
    // 29双头怪物
    // 30中毒流
    // 31冰冻流
    // 32奶妈流
    // 33黑暗
    // 34光明
    // 35火焰流
    // 36梦魇
    // 37暗夜精灵
    // 38血精灵
    // 39绿色守护

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