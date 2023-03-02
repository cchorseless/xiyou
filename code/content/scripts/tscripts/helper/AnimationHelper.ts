/*
 * @Author: Jaxh
 * @Date: 2021-05-08 19:04:12
 * @LastEditors: your name
 * @LastEditTime: 2021-05-10 17:59:05
 * @Description: file content
 */

export module AnimationHelper {

    class AnimationInfo {
        public frameCount: number = 0;
        public perFrameTime: number = 0.03;
        constructor(frameCount: number, perFrameTime: number = 0.03) {
            this.frameCount = frameCount;
            this.perFrameTime = perFrameTime;
        }
        public CompleteTime() {
            return this.frameCount * this.perFrameTime;
        }
    }


    export const allAnimationInfo: { [v: string]: any } = {
        dawnbreaker: {
            ACT_DOTA_CAST_ABILITY_1: new AnimationInfo(10, 0.01),
            ACT_DOTA_OVERRIDE_ABILITY_1: new AnimationInfo(54, 0.02),
            ACT_DOTA_CAST_ABILITY_1_END: new AnimationInfo(54),

            ACT_DOTA_CAST_ABILITY_2: new AnimationInfo(29),
            ACT_DOTA_OVERRIDE_ABILITY_2: new AnimationInfo(24),
            ACT_DOTA_CAST_ABILITY_2_END: new AnimationInfo(16),



        }
    }

    class CbInfo {
        public cb: Function;
        public wait(cb: Function) {
            this.cb = cb;
        }
        public run() {
            if (this.cb) {
                this.cb()
            }
            this.cb = null;
        }
    }
    export function play(baseNpc: CDOTA_BaseNPC, action: GameActivity_t): CbInfo {
        let _CbInfo = new CbInfo();
        let unitName: string = baseNpc.GetUnitName();
        let finishTime = 0;
        if (allAnimationInfo[unitName]) {
            finishTime = allAnimationInfo[unitName][GameActivity_t[action]]
        }
        baseNpc.StartGesture(action);
        GTimerHelper.AddTimer(finishTime, GHandler.create(baseNpc, () => {
            _CbInfo.run()
        }));
        return _CbInfo;
    }

    export const _ANIMATION_TRANSLATE_TO_CODE: { [k: string]: number } = {
        "loadout": 0,
        "split_shot": 1,
        "chemical_rage": 2,
        "agedspirit": 3,
        "aggressive": 4,
        "injured": 5,
        "ancient_armor": 6,
        "anvil": 7,
        "arcana": 8,
        "techies_arcana": 9,
        "fast": 10,
        "faster": 11,
        "fastest": 12,
        "abysm": 13,
        "dualwield": 14,
        "forcestaff_friendly": 15,
        "phantom_attack": 16,
        "snowangel": 17,
        "suicide_squad": 18,
        "taunt_fullbody": 19,
        "armaments_set": 20,
        "instagib": 21,
        "tidehunter_boat": 22,
        "shinobi_tail": 23,
        "tidebringer": 24,
        "masquerade": 25,
        "pyre": 26,
        "shinobi": 27,
        "immortal": 28,
        "cauldron": 29,
        "red_moon": 30,
        "when_nature_attacks": 31,
        "odachi": 32,
        "wraith_spin": 33,
        "eyeoffetizu": 34,
        "berserkers_blood": 35,
        "flying": 36,
        "frost_arrow": 37,
        "manta": 38,
        "come_get_it": 39,
        "good_day_sir": 40,
        "backstab": 41,
        "offhand_basher": 42,
        "batter_up": 43,
        "black": 44,
        "haste": 45,
        "with_item": 46,
        "bot": 47,
        "web": 48,
        "fountain": 49,
        "broodmother_spin": 50,
        "burrowed": 51,
        "sandking_rubyspire_burrowstrike": 52,
        "moth": 53,
        "frostivus": 54,
        "desolation": 55,
        "sm_head": 56,
        "chasm": 57,
        "greevil_black_hole": 58,
        "greevil_blade_fury": 59,
        "greevil_bloodlust": 60,
        "greevil_cold_snap": 61,
        "greevil_decrepify": 62,
        "greevil_diabolic_edict": 63,
        "greevil_echo_slam": 64,
        "greevil_fatal_bonds": 65,
        "greevil_ice_wall": 66,
        "ancestral_scepter": 67,
        "greevil_laguna_blade": 68,
        "greevil_leech_seed": 69,
        "greevil_magic_missile": 70,
        "greevil_maledict": 71,
        "greevil_miniboss_black_brain_sap": 72,
        "greevil_miniboss_black_nightmare": 73,
        "greevil_miniboss_blue_cold_feet": 74,
        "greevil_miniboss_blue_ice_vortex": 75,
        "greevil_miniboss_green_living_armor": 76,
        "greevil_miniboss_green_overgrowth": 77,
        "greevil_miniboss_orange_dragon_slave": 78,
        "greevil_miniboss_orange_lightstrike_array": 79,
        "greevil_miniboss_purple_plague_ward": 80,
        "greevil_miniboss_purple_venomous_gale": 81,
        "greevil_miniboss_red_earthshock": 82,
        "greevil_miniboss_red_overpower": 83,
        "greevil_miniboss_white_purification": 84,
        "greevil_miniboss_yellow_ion_shell": 85,
        "greevil_miniboss_yellow_surge": 86,
        "greevil_natures_attendants": 87,
        "greevil_phantom_strike": 88,
        "greevil_poison_nova": 89,
        "greevil_purification": 90,
        "greevil_shadow_strike": 91,
        "greevil_shadow_wave": 92,
        "stalker_exo": 93,
        "death_protest": 94,
        "nihility": 95,
        "deadwinter_soul": 96,
        "charge": 97,
        "charge_attack": 98,
        "iron_surge": 99,
        "impatient_maiden": 100,
        "glacier": 101,
        "snowball": 102,
        "corpse_dresstop": 103,
        "corpse_dress": 104,
        "corpse_scarf": 105,
        "unbroken": 106,
        "dc_sb_charge": 107,
        "dc_sb_charge_attack": 108,
        "dc_sb_charge_finish": 109,
        "dc_sb_ultimate": 110,
        "faces_hakama": 111,
        "faces_wraps": 112,
        "faces_mask": 113,
        "lodestar": 114,
        "reincarnate": 115,
        "demon_drain": 116,
        "divine_sorrow": 117,
        "divine_sorrow_loadout": 118,
        "divine_sorrow_loadout_spawn": 119,
        "divine_sorrow_sunstrike": 120,
        "duel_kill": 121,
        "forcestaff_enemy": 122,
        "fish_slap": 123,
        "focusfire": 124,
        "fear": 125,
        "ftp_dendi_back": 126,
        "triumphant_timelord": 127,
        "ground_pound": 128,
        "harlequin": 129,
        "injured_aggressive": 130,
        "f2p_doom": 131,
        "obsidian_helmet": 132,
        "item_style_2": 133,
        "blood_chaser": 134,
        "manias_mask": 135,
        "punch": 136,
        "thirst": 137,
        "impetus": 138,
        "taunt_killtaunt": 139,
        "level_1": 140,
        "level_2": 141,
        "level_3": 142,
        "dagger_twirl": 143,
        "ancestors_edge": 144,
        "ancestors_pauldron": 145,
        "ancestors_vambrace": 146,
        "bladebiter": 147,
        "burning_fiend": 148,
        "fiery_soul": 149,
        "frostiron_raider": 150,
        "obeisance_of_the_keeper": 151,
        "salvaged_sword": 152,
        "serene_honor": 153,
        "shinobi_mask": 154,
        "swordonshoulder": 155,
        "whalehook": 156,
        "winterblight": 157,
        "lucentyr": 158,
        "lyreleis_breeze": 159,
        "mace": 160,
        "tinker_rollermaw": 161,
        "meld": 162,
        "agrressive": 163,
        "miniboss": 164,
        "moonfall": 165,
        "moon_griffon": 166,
        "overpower1": 167,
        "overpower2": 168,
        "overpower3": 169,
        "overpower4": 170,
        "overpower5": 171,
        "overpower6": 172,
        "loda": 173,
        "dark_wraith": 174,
        "pinfold": 175,
        "digger": 176,
        "portrait_fogheart": 177,
        "silent_ripper": 178,
        "shake_moneymaker": 179,
        "belly_flop": 180,
        "roshan": 181,
        "am_blink": 182,
        "mana_void": 183,
        "culling_blade": 184,
        "brain_sap": 185,
        "fiends_grip": 186,
        "roar": 187,
        "axes": 188,
        "stolen_firefly": 189,
        "firefly": 190,
        "freezing_field": 191,
        "frostbite": 192,
        "crystal_nova": 193,
        "black_hole": 194,
        "fissure": 195,
        "slam": 196,
        "totem": 197,
        "omnislash": 198,
        "spin": 199,
        "finger": 200,
        "impale": 201,
        "laguna": 202,
        "lsa": 203,
        "mana_drain": 204,
        "wave": 205,
        "leap": 206,
        "requiem": 207,
        "shadowraze": 208,
        "sprout": 209,
        "summon": 210,
        "teleport": 211,
        "wrath": 212,
        "darkness": 213,
        "void": 214,
        "guardian_angel": 215,
        "purification": 216,
        "repel": 217,
        "dismember": 218,
        "life_drain": 219,
        "hook": 220,
        "qop_blink": 221,
        "scream": 222,
        "shadow_strike": 223,
        "sonic_wave": 224,
        "ravage": 225,
        "snipe": 226,
        "stolen_charge": 227,
        "strike": 228,
        "burrow": 229,
        "shrapnel": 230,
        "ball_lightning": 231,
        "remnant": 232,
        "bolt": 233,
        "vortex": 234,
        "earthshock": 235,
        "gale": 236,
        "plague_ward": 237,
        "poison_nova": 238,
        "viper_strike": 239,
        "wall": 240,
        "ward": 241,
        "powershot": 242,
        "end": 243,
        "windrun": 244,
        "windy": 245,
        "chase": 246,
        "injured rare": 247,
        "pegleg": 248,
        "start": 249,
        "sb_helmet": 250,
        "sb_bracers": 251,
        "sb_shoulder": 252,
        "sb_spear": 253,
        "dominator": 254,
        "iron": 255,
        "sven_shield": 256,
        "sven_warcry": 257,
        "chicken_gesture": 258,
        "emp": 259,
        "slasher_weapon": 260,
        "slasher_offhand": 261,
        "slasher_chest": 262,
        "slasher_mask": 263,
        "sm_armor": 264,
        "sm_shoulder": 265,
        "wolfhound": 266,
        "great_safari": 267,
        "taunt_quickdraw_gesture": 268,
        "sparrowhawk_bow": 269,
        "sparrowhawk_cape": 270,
        "sparrowhawk_quiver": 271,
        "sparrowhawk_hood": 272,
        "sparrowhawk_shoulder": 273,
        "twister": 274,
        "sprint": 275,
        "sugarrush": 276,
        "trickortreat": 277,
        "transition": 278,
        "torment": 279,
        "stinger": 280,
        "whats_that": 281,
        "witchdoctor_jig": 282,
        "backstroke_gesture": 283,
        "bazooka": 284,
        "cat_dancer_gesture": 285,
        "face_me": 286,
        "swag_gesture": 287,
        "get_burned": 288,
        "giddy_up_gesture": 289,
        "guitar": 290,
        "hang_loose_gesture": 291,
        "horn": 292,
        "happy_dance": 293,
        "jump_gesture": 294,
        "loser": 295,
        "lute": 296,
        "magic_ends_here": 297,
        "mag_power_gesture": 298,
        "mask_lord": 299,
        "poundnpoint": 300,
        "robot_gesture": 301,
        "taunt_roll_gesture": 302,
        "sharp_blade": 303,
        "staff_swing": 304,
        "groove_gesture": 305,
        "telebolt": 306,
        "admirals_prow": 307,
        "turbulent_teleport": 308,
        "timelord_head": 309,
        "tree": 310,
        "dryad_tree": 311,
        "tidehunter_toss_fish": 312,
        "enchant_totem": 313,
        "trapper": 314,
        "twinblade_attack": 315,
        "twinblade_attack_b": 316,
        "twinblade_attack_c": 317,
        "twinblade_attack_d": 318,
        "twinblade_attack_injured": 319,
        "twinblade_death": 320,
        "twinblade_idle": 321,
        "twinblade_idle_injured": 322,
        "twinblade_idle_rare": 323,
        "twinblade_injured_attack_b": 324,
        "twinblade_jinada": 325,
        "twinblade_jinada_injured": 326,
        "twinblade_shuriken_toss": 327,
        "twinblade_shuriken_toss_injured": 328,
        "twinblade_spawn": 329,
        "twinblade_stun": 330,
        "twinblade_track": 331,
        "twinblade_track_injured": 332,
        "twinblade_victory": 333,
        "melee": 334,
        "backward": 335,
        "forward": 336,
        "vendetta": 337,
        "viridi_set": 338,
        "fishstick": 339,
        "dogofduty": 340,
        "cryAnimationExportNode": 341,
        "dog_of_duty": 342,
        "dizzying_punch": 343,
        "wardstaff": 344,
        "glory": 345,
        "white": 346,
        "tidehunter_yippy": 347,
        "rampant": 348,
        "overload": 349,
        "surge": 350,
        "es_prosperity": 351,
        "Espada_pistola": 352,
        "overload_injured": 353,
        "ss_fortune": 354,
        "liquid_fire": 355,
        "jakiro_icemelt": 356,
        "jakiro_roar": 357,
        "chakram": 358,
        "doppelwalk": 359,
        "enrage": 360,
        "fast_run": 361,
        "overpower": 362,
        "overwhelmingodds": 363,
        "pregame": 364,
        "shadow_dance": 365,
        "shukuchi": 366,
        "strength": 367,
        "twinblade_run": 368,
        "twinblade_run_injured": 369,
        "windwalk": 370,
        "walk": 371,
        "run": 372,
        "run_fast": 373,
        "<none>": 374,
        "attack_long_range": 375,
        "attack_normal_range": 376,
        "spear": 377,
        "faces_vest": 378,
        "slasher_shoulder": 379,
        "slasher_arms": 380,
        "slasher_belt": 381,
        "ancestral": 382,
        "spirit": 383,
        "ancestors_belt": 384,
        "sm_weapons": 385,
        "sm_belt": 386,
        "shinobi_wraps": 387,
        "shinobi_shoulder": 388,
        "faces_katana": 389,
        "sb_offhand": 390,
        "regalia_bonelord": 391,
        "ernest_pipe": 392,
        "lightning": 393,
        "olde_pipe": 394,
        "yuwipi": 395,
        "MGC": 396,
        "shade": 397,
        "eldwurm": 398,
        "reprisal": 399,
        "basher": 400,
        "suffer": 401,
        "darkclaw": 402,
        "whiskey": 403,
        "banana_gesture": 404,
        "dive": 405,
        "eztzhok": 406,
        "eztzhok_off": 407,
        "immosh": 408,
        "solar": 409,
        "para": 410,
        "priest": 411,
        "tako": 412,
        "force": 413,
        "shard": 414,
        "crimson": 415,
        "light": 416,
        "burn": 417,
        "juggle_gesture": 418,
        "hell_gesture": 419,
        "disco_gesture": 420,
        "tears": 421,
        "ogre_hop_gesture": 422,
        "sideflip_gesture": 423,
        "blowkiss_gesture": 424,
        "terror": 425,
        "pogo_gesture": 426,
        "ti7": 427,
        "pudge_ti7_immortal": 428,
        "green": 429,
        "weaver_ti7_immortal": 430,
        "viper_immortal_head_ti7": 431,
        "bm_ti7_immortal_shoulder": 432,
        "pl_ti7_immortal_shoulder": 433,
        "rage_gesture": 434,
        "funky_gesture": 435,
        "ti4": 436,
        "auspice": 437,
        "hydro": 438,
        "ti6": 439,
        "fallen_legion": 440,
        "hoard": 441,
        "jade": 442,
        "starstorm": 443,
        "augur_arm": 444,
        "latch": 445,
        "falcon": 446,
        "harpoon": 447,
        "shards": 448,
        "fur": 449,
        "voodoo": 450,
        "rain_gesture": 451,
        "inner_peace_gesture": 452,
        "selemene_gesture": 453,
        "ti8_taunt": 454,
        "dreamleague": 455,
        "bonkers_the_mad": 456,
        "aeons": 457,
        "Hero_Magnataur.ShockWave.Cast.Anvil": 458,
        "spike": 459,
        "walk_gesture": 460,
        "apex": 461,
        "mermaid": 462,
        "ashes": 463,
        "tactician": 464,
        "bladeform_pants": 465,
        "favor": 466,
        "silent": 467,
        "freeze": 468,
        "arcana_style": 469,
        "red": 470,
        "scholar": 471,
        "lycosidae_spread": 472,
        "shark_up": 473,
        "spectre_ti7_immortal": 474,
        "head_roll_gesture": 475,
        "break_gesture": 476,
        "swing_around_gesture": 477,
        "smoke": 478,
        "treant_ti7_immortal": 479,
        "immortal_cape": 480,
        "kotl_ti7_immortal": 481,
        "back": 482,
        "rage": 483,
        "assassin": 484,
        "immortal_shoulder": 485,
        "musket": 486,
        "rose": 487,
        "rope": 488,
        "corkscrew_gesture": 489,
        "kunkka_dance_gesture": 490,
        "thirst_loadout": 491,
        "ti8": 492,
        "guns": 493,
        "focal": 494,
        "owl_mount": 495,
        "bombadillo": 496,
        "nords": 497,
        "ti8_taunt_cooked": 498,
        "tube_ti8": 499,
        "arcana_skip": 500,
        "ti8_immortal": 501,
        "ti8_style_1": 502,
        "viper_ti8_immortal_tail": 503,
        "dance": 504,
        "legion_commander_ti8": 505,
        "centaur_taunt_gesture": 506,
        "keg_roll_gesture": 507,
        "dota_plus_head": 508,
        "dota_plus": 509,
        "2018_frostivus": 510,
        "Tsukumo_mount": 511,
        "level1": 512,
        "level2": 513,
        "level3": 514,
        "level4": 515,
        "level5": 516,
        "level6": 517,
        "super_fast": 518,
        "attack_closest_range": 519,
        "attack_close_range": 520,
        "attack_medium_range": 521,
        "ti9_taunt": 522,
        "drum_beat": 523,
        "hang_ten_gesture": 524,
        "average_bear": 525,
        "ck_gesture": 526,
        "drum_major_gesture": 527,
        "taunt_ti9": 528,
        "ti9": 529,
        "ti9_head": 530,
        "ti9_arms": 531,
        "taunt_antimage_cheer": 532,
        "ti9_weapon": 533,
        "lich_ballplay": 534,
        "ti9_totem": 535,
        "jog": 536,
        "ti9_cache": 537,
        "everblack": 538,
        "egg": 539,
        "ti9_off": 540,
        "ti9_cape": 541,
        "TI9": 542,
        "dota_plus_back": 543
    }
    export const _CODE_TO_ANIMATION_TRANSLATE: string[] = [];
    if (_CODE_TO_ANIMATION_TRANSLATE.length == 0) {
        for (const key in _ANIMATION_TRANSLATE_TO_CODE) {
            _CODE_TO_ANIMATION_TRANSLATE[_ANIMATION_TRANSLATE_TO_CODE[key]] = key;
        }
    }

    interface IAnimationInfo {
        duration?: number;
        activity: number;
        translate?: string;
        translate2?: string;
        rate: number;
    }
    export function StartAnimation(unit: IBaseNpc_Plus, table: IAnimationInfo) {
        let duration = table.duration || 0;
        let activity = table.activity;
        let translate = table.translate;
        let translate2 = table.translate2;
        let rate = table.rate || 1.0;
        rate = math.floor(math.max(0, math.min(255 / 20, rate)) * 20 + .5);
        let stacks = activity + bit.lshift(rate, 11);
        if (translate != undefined) {
            if (_ANIMATION_TRANSLATE_TO_CODE[translate] == undefined) {
                print("[ANIMATIONS.lua] ERROR, no translate-code found for '" + translate + "'.  This translate may be misspelled or need to be added to the enum manually.");
                return;
            }
            stacks = stacks + bit.lshift(_ANIMATION_TRANSLATE_TO_CODE[translate], 19);
        }
        if (translate2 != undefined && _ANIMATION_TRANSLATE_TO_CODE[translate2] == undefined) {
            print("[ANIMATIONS.lua] ERROR, no translate-code found for '" + translate2 + "'.  This translate may be misspelled or need to be added to the enum manually.");
            return;
        }
        if (unit.HasModifier("modifier_animation") || (unit.TempData()._animationEnd != undefined && unit.TempData()._animationEnd + .067 > GameRules.GetGameTime())) {
            EndAnimation(unit);
            GTimerHelper.AddTimer(.066, GHandler.create(unit, () => {
                if (translate2 != undefined) {
                    unit.AddNewModifier(unit, undefined, "modifier_animation_translate", {
                        duration: duration,
                        translate: translate2
                    });
                    unit.SetModifierStackCount("modifier_animation_translate", unit, _ANIMATION_TRANSLATE_TO_CODE[translate2]);
                }
                unit.TempData()._animationEnd = GameRules.GetGameTime() + duration;
                unit.AddNewModifier(unit, undefined, "modifier_animation", {
                    duration: duration,
                    translate: translate
                });
                unit.SetModifierStackCount("modifier_animation", unit, stacks);
            }));
        } else {
            if (translate2 != undefined) {
                unit.AddNewModifier(unit, undefined, "modifier_animation_translate", {
                    duration: duration,
                    translate: translate2
                });
                unit.SetModifierStackCount("modifier_animation_translate", unit, _ANIMATION_TRANSLATE_TO_CODE[translate2]);
            }
            if (duration) {
                unit.TempData()._animationEnd = GameRules.GetGameTime() + duration;
                unit.AddNewModifier(unit, undefined, "modifier_animation", {
                    duration: duration,
                    translate: translate
                });
                unit.SetModifierStackCount("modifier_animation", unit, stacks);
            }
        }
    }
    export function FreezeAnimation(unit: IBaseNpc_Plus, duration: number) {
        if (duration) {
            unit.AddNewModifier(unit, undefined, "modifier_animation_freeze", {
                duration: duration
            });
        } else {
            unit.AddNewModifier(unit, undefined, "modifier_animation_freeze", {});
        }
    }
    export function UnfreezeAnimation(unit: IBaseNpc_Plus) {
        unit.RemoveModifierByName("modifier_animation_freeze");
    }
    export function EndAnimation(unit: IBaseNpc_Plus) {
        unit.TempData()._animationEnd = GameRules.GetGameTime();
        unit.RemoveModifierByName("modifier_animation");
        unit.RemoveModifierByName("modifier_animation_translate");
    }
    export function AddAnimationTranslate(unit: IBaseNpc_Plus, duration: number, translate: string) {
        if (translate == undefined || _ANIMATION_TRANSLATE_TO_CODE[translate] == undefined) {
            print("[ANIMATIONS.lua] ERROR, no translate-code found for '" + translate + "'.  This translate may be misspelled or need to be added to the enum manually.");
            return;
        }
        unit.AddNewModifier(unit, undefined, "modifier_animation_translate_permanent", {
            duration: duration,
            translate: translate
        });
        unit.SetModifierStackCount("modifier_animation_translate_permanent", unit, _ANIMATION_TRANSLATE_TO_CODE[translate]);
    }
    export function RemoveAnimationTranslate(unit: IBaseNpc_Plus) {
        unit.RemoveModifierByName("modifier_animation_translate_permanent");
    }
}