import { Assert_SoundEvent } from "./Assert_SoundEvent";

export interface IProjectileEffectInfo {
    name?: string;
    effect?: string;
    sound?: string;
}

export const Assert_ProjectileEffect = {
    p000: {
        name: "默认弹道",
        effect: "particles/base_attacks/ranged_tower_good.vpcf",
        sound: Assert_SoundEvent.projectile_hit_tower,
    },
    p001: {
        name: "通行证金色弹道",
        effect: "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf",
        sound: Assert_SoundEvent.projectile_hit_tiannu,
    },
    p002: {
        name: "南瓜",
        effect: "effect/pj_nangua/1.vpcf",
        sound: Assert_SoundEvent.diretide_hit,
    },

    p101: {
        name: "毒液",
        effect: "particles/econ/items/viper/viper_ti7_immortal/viper_poison_crimson_attack_ti7.vpcf",
        sound: Assert_SoundEvent.projectile_hit_duye,
    },
    p102: {
        name: "灼热之箭",
        effect: "particles/econ/items/clinkz/clinkz_maraxiform/clinkz_ti9_summon_projectile_arrow.vpcf",
        sound: Assert_SoundEvent.projectile_hit_zhuore,
    },
    p103: {
        name: "飞镖|金色",
        effect: "particles/econ/items/phantom_assassin/pa_ti8_immortal_head/pa_ti8_immortal_stifling_dagger_arcana_combined.vpcf",
        sound: Assert_SoundEvent.projectile_hit_yueren,
    },
    p104: {
        name: "灵魂火",
        effect: "particles/econ/items/shadow_fiend/sf_desolation/sf_base_attack_desolation_fire_arcana.vpcf",
        sound: Assert_SoundEvent.projectile_hit_linghun,
    },
    p105: {
        name: "雪球",
        effect: "effect/projectile/snowball/1.vpcf",
        sound: Assert_SoundEvent.projectile_hit_snowball,
    },
    p106: {
        name: "噩梦",
        effect: "particles/units/heroes/hero_bane/bane_projectile.vpcf",
        sound: Assert_SoundEvent.projectile_hit_emeng,
    },
    p107: {
        name: "萤火虫",
        effect: "particles/units/heroes/hero_phantom_lancer/phantomlancer_spiritlance_projectile.vpcf",
        sound: Assert_SoundEvent.projectile_hit_snake,
    },
    p108: {
        name: "狂暴药剂",
        effect: "particles/units/heroes/hero_alchemist/alchemist_berserk_potion_projectile.vpcf",
        sound: Assert_SoundEvent.projectile_hit_berserk_potion,
    },
    p109: {
        name: "闪光幽魂",
        effect: "particles/units/heroes/hero_arc_warden/arc_warden_wraith_prj.vpcf",
        sound: Assert_SoundEvent.projectile_hit_spark_wraith,
    },
    p110: {
        name: "昏睡飞镖",
        effect: "particles/units/heroes/hero_riki/riki_shard_sleeping_dart.vpcf",
        sound: "Hero_Riki.SleepDart.Target",
    },

    p201: {
        name: "粘稠鼻液",
        effect: "particles/econ/items/bristleback/ti7_head_nasal_goo/bristleback_ti7_crimson_nasal_goo_proj.vpcf",
        sound: Assert_SoundEvent.projectile_hit_duye,
    },
    p202: {
        name: "水果忍者|椰子",
        effect: "particles/econ/items/witch_doctor/wd_monkey/witchdoctor_cask_monkey.vpcf",
        sound: Assert_SoundEvent.diretide_hit,
    },
    p203: {
        name: "水果忍者|榴莲",
        effect: "particles/econ/items/witch_doctor/wd_ti8_immortal_bonkers/wd_ti8_immortal_bonkers_cask.vpcf",
        sound: Assert_SoundEvent.diretide_hit,
    },
    p204: {
        name: "月刃|金色",
        effect: "particles/econ/items/luna/luna_ti9_weapon_gold/luna_ti9_gold_base_attack.vpcf",
        sound: Assert_SoundEvent.projectile_hit_yueren,
    },
    p205: {
        name: "风暴之锤",
        effect: "particles/units/heroes/hero_sven/sven_spell_storm_bolt.vpcf",
        sound: Assert_SoundEvent.projectile_hit_chuizi,
    },
    p206: {
        name: "异术秘蛇",
        effect: "particles/units/heroes/hero_medusa/medusa_mystic_snake_projectile.vpcf",
        sound: Assert_SoundEvent.projectile_hit_snake,
    },
    p207: {
        name: "月刃|紫色",
        effect: "particles/econ/items/luna/luna_ti9_weapon/luna_ti9_base_attack.vpcf",
        sound: Assert_SoundEvent.projectile_hit_yueren,
    },
    p208: {
        name: "糖果炸弹",
        effect: "effect/pj_hw_candy/1.vpcf",
        sound: Assert_SoundEvent.projectile_hit_snowball,
    },
    p209: {
        name: "诱捕|银色",
        effect: "particles/units/heroes/hero_siren/siren_net_projectile.vpcf",
        sound: Assert_SoundEvent.projectile_hit_net,
    },
    p210: {
        name: "诱捕|金色",
        effect: "particles/units/heroes/hero_troll_warlord/troll_warlord_bersekers_net_projectile.vpcf",
        sound: Assert_SoundEvent.projectile_hit_net,
    },
    p211: {
        name: "圣诞礼物",
        effect: "particles/winter_fx/winter_present_projectile.vpcf",
        sound: Assert_SoundEvent.projectile_hit_snowball,
    },
    p212: {
        name: "仙灵榴弹",
        effect: "particles/items2_fx/paintball.vpcf",
        sound: Assert_SoundEvent.projectile_hit_paintball,
    },

    p301: {
        name: "光之紫",
        effect: "particles/items4_fx/nullifier_proj.vpcf",
        sound: Assert_SoundEvent.projectile_hit_magic_missile,
    },
    p302: {
        name: "冥魂之怒",
        effect: "particles/econ/items/wraith_king/wraith_king_ti6_bracer/wraith_king_ti6_hellfireblast.vpcf",
        sound: Assert_SoundEvent.projectile_hit_linghun,
    },
    p303: {
        name: "照明弹",
        effect: "particles/econ/items/clockwerk/clockwerk_paraflare/clockwerk_para_rocket_flare.vpcf",
        sound: Assert_SoundEvent.projectile_hit_flare_explode,
    },
    p304: {
        name: "风暴魔方",
        effect: "particles/econ/items/rubick/rubick_arcana/rbck_arc_skeletonking_hellfireblast.vpcf",
        sound: Assert_SoundEvent.projectile_hit_chuizi,
    },
    p305: {
        name: "飞鸟炸弹",
        effect: "particles/econ/items/skywrath_mage/skywrath_ti9_immortal_back/skywrath_mage_ti9_arcane_bolt.vpcf",
        sound: Assert_SoundEvent.projectile_hit_tiannu,
    },
    p306: {
        name: "天罗地网",
        effect: "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf",
        sound: Assert_SoundEvent.projectile_hit_net,
    },
    p307: {
        name: "辣椒",
        effect: "particles/econ/events/ti10/hot_potato/hot_potato_projectile.vpcf",
        sound: Assert_SoundEvent.projectile_hit_pepper,
    },
    p308: {
        name: "眼镜蛇射击",
        effect: "particles/econ/items/medusa/medusa_ti10_immortal_tail/medusa_ti10_projectile.vpcf",
        sound: Assert_SoundEvent.projectile_hit_snake,
    },

    p401: {
        name: "霜冻之箭",
        effect: "particles/econ/items/drow/drow_ti9_immortal/drow_ti9_marksman_frost.vpcf",
        sound: Assert_SoundEvent.projectile_hit_frost_arrow,
    },
    p402: {
        name: "不稳定化合物",
        effect: "particles/econ/items/alchemist/alchemist_smooth_criminal/alchemist_smooth_criminal_unstable_concoction_projectile.vpcf",
        sound: Assert_SoundEvent.projectile_hit_unstable_concoction,
    },
    p403: {
        name: "羽毛弹|紫色",
        effect: "particles/econ/items/vengeful/vs_ti8_immortal_shoulder/vs_ti8_immortal_magic_missle.vpcf",
        sound: Assert_SoundEvent.projectile_hit_magic_missile,
    },
    p404: {
        name: "羽毛弹|红色",
        effect: "particles/econ/items/vengeful/vs_ti8_immortal_shoulder/vs_ti8_immortal_magic_missle_crimson.vpcf",
        sound: Assert_SoundEvent.projectile_hit_magic_missile,
    },
    p405: {
        name: "彩虹之矛",
        effect: "particles/econ/items/enchantress/enchantress_virgas/ench_impetus_virgas.vpcf",
        sound: Assert_SoundEvent.projectile_hit_rainbow,
    },
    p406: {
        name: "巫妖王之怒",
        effect: "particles/econ/items/lich/lich_ti8_immortal_arms/lich_ti8_chain_frost.vpcf",
        sound: Assert_SoundEvent.projectile_hit_lichking,
    },
    p407: {
        name: "霜寒之触",
        effect: "particles/units/heroes/hero_ancient_apparition/ancient_apparition_chilling_touch_projectile.vpcf",
        sound: Assert_SoundEvent.projectile_hit_lichking,
    },
};
