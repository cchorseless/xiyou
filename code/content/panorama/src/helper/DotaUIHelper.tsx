import { LogHelper } from "./LogHelper";

export module DotaUIHelper {
    /**UI根节点 */
    let WindowRoot: Panel;

    /**
     * dota2UI查找节点
     */
    export function findElement(id: string) {
        return GetWindowRoot()!.FindChild(id);
    }

    /**
     *
     * @returns  游戏UI根节点
     */
    export function GetWindowRoot() {
        let a = $.GetContextPanel();
        while (a.GetParent() != null) {
            let p = a.GetParent() as Panel;
            if (p.BHasClass('WindowRoot')) {
                return p
            }
            a = p;
        }
    }


    /**打印dota2UI层级 */
    export function debugUIid() {
        let _r = GetWindowRoot();
        let out = {} as any;
        let arr = [
            {
                p: _r,
                data: out
            }
        ];
        while (arr.length > 0) {
            let P_data = arr.shift() as { p: Panel, data: any };
            let curP = P_data.p;
            let data = P_data.data
            if (curP && curP.id) {
                let new_data = {};
                data[curP.id] = new_data;
                if (curP.GetChildCount() > 0) {
                    for (let i = 0; i < curP.GetChildCount(); i++) {
                        let c = curP.GetChild(i)
                        if (c) {
                            arr.push({
                                p: c,
                                data: new_data
                            })
                        }
                    }

                }
            }


        };
        let str = JSON.stringify(out);
        LogHelper.print('-------------')
        let endarr = [':', '{', '}', ',', '"']
        while (str.length > 400) {
            let tmp = str.substring(0, 400);
            if (endarr.indexOf(tmp[399]) == -1) {
                LogHelper.print(tmp + '\\')
            }
            else {
                LogHelper.print(tmp)
            }
            str = str.substring(400)
        }
        LogHelper.print(str)
        LogHelper.print('------------')

    }
    /**DOta2UI层级ID */
    export const OldUI_ID = {
        "DotaHud": {
            "Hud": {
                "HUDElements": {
                    "ContextualTips": { "ForegroundTipsContainer": {} },
                    "HeroRelicProgress": {},
                    "FightRecap": {
                        "MainPanel": {
                            "DeathSegment": {
                                "RadiantDeaths": {
                                    "DeathSnippet1": {
                                        "Death": {},
                                        "DeathBuyback": {}
                                    },
                                    "DeathSnippet2": {
                                        "Death": {},
                                        "DeathBuyback": {}
                                    },
                                    "DeathSnippet3": {
                                        "Death": {},
                                        "DeathBuyback": {}
                                    },
                                    "DeathSnippet4": {
                                        "Death": {},
                                        "DeathBuyback": {}
                                    },
                                    "DeathSnippet5": {
                                        "Death": {},
                                        "DeathBuyback": {}
                                    }
                                }
                                , "DireDeaths": {
                                    "DeathSnippet6": {
                                        "Death": {},
                                        "DeathBuyback": {}
                                    },
                                    "DeathSnippet7": {
                                        "Death": {},
                                        "DeathBuyback": {}
                                    },
                                    "DeathSnippet8": {
                                        "Death": {},
                                        "DeathBuyback": {}
                                    },
                                    "DeathSnippet9": {
                                        "Death": {},
                                        "DeathBuyback": {}
                                    },
                                    "DeathSnippet10": {
                                        "Death": {},
                                        "DeathBuyback": {}
                                    }
                                }
                            },
                            "GoldSegment": {
                                "RadiantGold": {
                                    "GoldSnippet1": { "GoldLabel": {} },
                                    "GoldSnippet2": { "GoldLabel": {} },
                                    "GoldSnippet3": { "GoldLabel": {} },
                                    "GoldSnippet4": {
                                        "GoldLabel": {}
                                    },
                                    "GoldSnippet5": { "GoldLabel": {} }
                                },
                                "DireGold": {
                                    "GoldSnippet6": { "GoldLabel": {} },
                                    "GoldSnippet7": { "GoldLabel": {} },
                                    "GoldSnippet8": { "GoldLabel": {} },
                                    "GoldSnippet9": { "GoldLabel": {} },
                                    "GoldSnippet10": { "GoldLabel": {} }
                                }
                            },
                            "XPSegment": {
                                "RadiantXP": {
                                    "XPSnippet1": { "XPLabel": {} },
                                    "XPSnippet2": { "XPLabel": {} },
                                    "XPSnippet3": { "XPLabel": {} },
                                    "XPSnippet4": { "XPLabel": {} },
                                    "XPSnippet5": { "XPLabel": {} }
                                },
                                "DireXP": {
                                    "XPSnippet6": { "XPLabel": {} },
                                    "XPSnippet7": { "XPLabel": {} },
                                    "XPSnippet8": { "XPLabel": {} },
                                    "XPSnippet9": { "XPLabel": {} },
                                    "XPSnippet10": { "XPLabel": {} }
                                }
                            },
                            "DamageSegment": {
                                "RadiantDamage": {
                                    "DamageSnippet1": { "DamageLabel": {} },
                                    "DamageSnippet2": { "DamageLabel": {} },
                                    "DamageSnippet3": { "DamageLabel": {} },
                                    "DamageSnippet4": { "DamageLabel": {} },
                                    "DamageSnippet5": { "DamageLabel": {} }
                                },
                                "DireDamage": {
                                    "DamageSnippet6": {
                                        "DamageLabel":
                                            {}
                                    },
                                    "DamageSnippet7": { "DamageLabel": {} },
                                    "DamageSnippet8": { "DamageLabel": {} },
                                    "DamageSnippet9": { "DamageLabel": {} },
                                    "DamageSnippet10": { "DamageLabel": {} }
                                }
                            },
                            "AbilitiesSegment": {
                                "RadiantAbilities1": {
                                    "AbilitySnippet1": { "AbilityIcon": {} },
                                    "AbilitySnippet2": { "AbilityIcon": {} },
                                    "AbilitySnippet3": { "AbilityIcon": {} },
                                    "AbilitySnippet4": { "AbilityIcon": {} },
                                    "AbilitySnippet5": { "AbilityIcon": {} }
                                },
                                "RadiantAbilities2": {
                                    "AbilitySnippet1": { "AbilityIcon": {} },
                                    "AbilitySnippet2": { "AbilityIcon": {} },
                                    "AbilitySnippet3": { "AbilityIcon": {} },
                                    "AbilitySnippet4": { "AbilityIcon": {} },
                                    "AbilitySnippet5": { "AbilityIcon": {} }
                                },
                                "RadiantAbilities3": {
                                    "AbilitySnippet1": { "AbilityIcon": {} },
                                    "AbilitySnippet2": { "AbilityIcon": {} },
                                    "AbilitySnippet3": { "AbilityIcon": {} },
                                    "AbilitySnippet4": { "AbilityIcon": {} },
                                    "AbilitySnippet5": { "AbilityIcon": {} }
                                },
                                "RadiantAbilities4": {
                                    "AbilitySnippet1": { "AbilityIcon": {} },
                                    "AbilitySnippet2": { "AbilityIcon": {} },
                                    "AbilitySnippet3": { "AbilityIcon": {} },
                                    "AbilitySnippet4": { "AbilityIcon": {} },
                                    "AbilitySnippet5": { "AbilityIcon": {} }
                                },
                                "DireAbilities1": {
                                    "AbilitySnippet1": { "AbilityIcon": {} },
                                    "AbilitySnippet2": { "AbilityIcon": {} },
                                    "AbilitySnippet3": { "AbilityIcon": {} },
                                    "AbilitySnippet4": { "AbilityIcon": {} },
                                    "AbilitySnippet5": {
                                        "AbilityIcon": {}
                                    }
                                },
                                "DireAbilities2": {
                                    "AbilitySnippet1": { "AbilityIcon": {} },
                                    "AbilitySnippet2": { "AbilityIcon": {} },
                                    "AbilitySnippet3": { "AbilityIcon": {} },
                                    "AbilitySnippet4": { "AbilityIcon": {} },
                                    "AbilitySnippet5": { "AbilityIcon": {} }
                                },
                                "DireAbilities3": {
                                    "AbilitySnippet1": { "AbilityIcon": {} },
                                    "AbilitySnippet2": { "AbilityIcon": {} },
                                    "AbilitySnippet3": { "AbilityIcon": {} },
                                    "AbilitySnippet4": { "AbilityIcon": {} },
                                    "AbilitySnippet5": {
                                        "AbilityIcon": {}
                                    }
                                },
                                "DireAbilities4": {
                                    "AbilitySnippet1": { "AbilityIcon": {} },
                                    "AbilitySnippet2": { "AbilityIcon": {} },
                                    "AbilitySnippet3": { "AbilityIcon": {} },
                                    "AbilitySnippet4": { "AbilityIcon": {} },
                                    "AbilitySnippet5": { "AbilityIcon": {} }
                                }
                            },
                            "ItemsSegment": {
                                "RadiantItems1": {
                                    "AbilitySnippet1": { "AbilityIcon": {} },
                                    "AbilitySnippet2": { "AbilityIcon": {} },
                                    "AbilitySnippet3": { "AbilityIcon": {} },
                                    "AbilitySnippet4": { "AbilityIcon": {} },
                                    "AbilitySnippet5": { "AbilityIcon": {} }
                                },
                                "RadiantItems2": {
                                    "AbilitySnippet1": { "AbilityIcon": {} },
                                    "AbilitySnippet2": { "AbilityIcon": {} },
                                    "AbilitySnippet3": { "AbilityIcon": {} },
                                    "AbilitySnippet4": { "AbilityIcon": {} },
                                    "AbilitySnippet5": { "AbilityIcon": {} }
                                },
                                "RadiantItems3": {
                                    "AbilitySnippet1": { "AbilityIcon": {} },
                                    "AbilitySnippet2": { "AbilityIcon": {} },
                                    "AbilitySnippet3": { "AbilityIcon": {} },
                                    "AbilitySnippet4": {
                                        "AbilityIcon": {
                                        }
                                    },
                                    "AbilitySnippet5": { "AbilityIcon": {} }
                                },
                                "DireItems1": {
                                    "AbilitySnippet1": { "AbilityIcon": {} },
                                    "AbilitySnippet2": { "AbilityIcon": {} },
                                    "AbilitySnippet3": { "AbilityIcon": {} },
                                    "AbilitySnippet4": { "AbilityIcon": {} },
                                    "AbilitySnippet5": { "AbilityIcon": {} }
                                },
                                "DireItems2": {
                                    "AbilitySnippet1": { "AbilityIcon": {} },
                                    "AbilitySnippet2": { "AbilityIcon": {} },
                                    "AbilitySnippet3": { "AbilityIcon": {} },
                                    "AbilitySnippet4": {
                                        "AbilityIcon": {
                                        }
                                    },
                                    "AbilitySnippet5": { "AbilityIcon": {} }
                                },
                                "DireItems3": {
                                    "AbilitySnippet1": { "AbilityIcon": {} },
                                    "AbilitySnippet2": { "AbilityIcon": {} },
                                    "AbilitySnippet3": { "AbilityIcon": {} },
                                    "AbilitySnippet4": { "AbilityIcon": {} },
                                    "AbilitySnippet5": { "AbilityIcon": {} }
                                }
                            }
                        },
                        "AlertPanel": {
                            "ShowFightRecapButton": {},
                            "HideFightRecapButton": {}
                        }
                    },
                    "topbar": {
                        "HUDSkinTopBarBG": {},
                        "Pips": {
                            "RadiantPips": {
                                "RadiantGamePip1": {},
                                "RadiantGamePip2": {},
                                "RadiantGamePip3": {}
                            },
                            "DirePips": {
                                "DireGamePip1": {},
                                "DireGamePip2": {},
                                "DireGamePip3": {}
                            }
                        },
                        "TopBarLeftFlare": {},
                        "TopBarRadiantTeamContainer": {
                            "TopBarRadiantTeam": {
                                "TopBarRadiantPlayers": {
                                    "RadiantTeamScorePlayers": {
                                        "TopBarRadiantScore": {},
                                        "TopBarRadiantPlayersContainer": {
                                            "RadiantPlayer0": {
                                                "StreakParticle": {},
                                                "StreakBorder": {},
                                                "CoachIcon": {},
                                                "SlantedContainerPanel": {
                                                    "PlayerColor": {},
                                                    "DeadLayer": {},
                                                    "DisconnectIcon": {},
                                                    "CoachImage": {},
                                                    "HeroImage": {},
                                                    "PlayerColorShadow": {}
                                                },
                                                "HeroBadgeOverlay": {},
                                                "HealthBar": {
                                                    "HealthBar_Left": {},
                                                    "HealthBar_Right": {}
                                                },
                                                "ManaBar": {
                                                    "ManaBar_Left": {},
                                                    "ManaBar_Right": {}
                                                },
                                                "TopBarUltIndicator": {},
                                                "AbilityDraftHitBox": {},
                                                "RespawnContainer": {
                                                    "BuybackIcon": {},
                                                    "RespawnTimer": {
                                                        "RespawnTimerLabel": {},
                                                        "TopBarBuybackStatus": {}
                                                    }
                                                },
                                                "GoldIcon": {},
                                                "TipButton": { "TipIcon": {} },
                                                "BountyButton": {
                                                    "BountyHeroImage": {},
                                                    "BountyIcon": {},
                                                    "BountyCancelLabel": {},
                                                    "BountyCancelButton": {}
                                                },
                                                "Bounties": {},
                                                "TPIndicator": {
                                                    "TopBarTPIcon": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    }
                                                },
                                                "RoleButton": {
                                                    "RoleButton_Role": {},
                                                    "RoleButton_Dropdown": {}
                                                }
                                            },
                                            "RadiantPlayer1": {
                                                "StreakParticle": {},
                                                "StreakBorder": {},
                                                "CoachIcon": {},
                                                "SlantedContainerPanel": {
                                                    "PlayerColor": {},
                                                    "DeadLayer": {},
                                                    "DisconnectIcon": {},
                                                    "CoachImage": {},
                                                    "HeroImage": {},
                                                    "PlayerColorShadow": {}
                                                },
                                                "HeroBadgeOverlay": {},
                                                "HealthBar": {
                                                    "HealthBar_Left": {},
                                                    "HealthBar_Right": {}
                                                },
                                                "ManaBar": {
                                                    "ManaBar_Left": {},
                                                    "ManaBar_Right": {}
                                                },
                                                "TopBarUltIndicator": {},
                                                "AbilityDraftHitBox": {},
                                                "RespawnContainer": {
                                                    "BuybackIcon": {},
                                                    "RespawnTimer": {
                                                        "RespawnTimerLabel": {},
                                                        "TopBarBuybackStatus": {}
                                                    }
                                                },
                                                "GoldIcon": {},
                                                "TipButton": { "TipIcon": {} },
                                                "BountyButton": {
                                                    "BountyHeroImage": {},
                                                    "BountyIcon": {},
                                                    "BountyCancelLabel": {},
                                                    "BountyCancelButton": {}
                                                },
                                                "Bounties": {},
                                                "TPIndicator": {
                                                    "TopBarTPIcon": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown"
                                                                                : {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": {
                                                            "SpellsLabel"
                                                                : {}
                                                        }
                                                    }
                                                },
                                                "RoleButton": {
                                                    "RoleButton_Role": {},
                                                    "RoleButton_Dropdown": {}
                                                }
                                            },
                                            "RadiantPlayer2": {
                                                "StreakParticle": {},
                                                "StreakBorder": {},
                                                "CoachIcon": {},
                                                "SlantedContainerPanel": {
                                                    "PlayerColor": {},
                                                    "DeadLayer": {},
                                                    "DisconnectIcon": {},
                                                    "CoachImage": {},
                                                    "HeroImage": {},
                                                    "PlayerColorShadow": {}
                                                },
                                                "HeroBadgeOverlay": {},
                                                "HealthBar": {
                                                    "HealthBar_Left": {},
                                                    "HealthBar_Right": {}
                                                },
                                                "ManaBar": {
                                                    "ManaBar_Left": {},
                                                    "ManaBar_Right": {}
                                                },
                                                "TopBarUltIndicator": {},
                                                "AbilityDraftHitBox": {},
                                                "RespawnContainer": {
                                                    "BuybackIcon": {},
                                                    "RespawnTimer": {
                                                        "RespawnTimerLabel": {},
                                                        "TopBarBuybackStatus": {}
                                                    }
                                                },
                                                "GoldIcon": {},
                                                "TipButton": { "TipIcon": {} },
                                                "BountyButton": {
                                                    "BountyHeroImage": {},
                                                    "BountyIcon": {},
                                                    "BountyCancelLabel": {},
                                                    "BountyCancelButton": {}
                                                },
                                                "Bounties": {},
                                                "TPIndicator": {
                                                    "TopBarTPIcon": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight"
                                                                            : {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    }
                                                },
                                                "RoleButton": {
                                                    "RoleButton_Role": {},
                                                    "RoleButton_Dropdown": {}
                                                }
                                            },
                                            "RadiantPlayer3": {
                                                "StreakParticle":
                                                    {},
                                                "StreakBorder": {},
                                                "CoachIcon": {},
                                                "SlantedContainerPanel": {
                                                    "PlayerColor": {},
                                                    "DeadLayer": {},
                                                    "DisconnectIcon": {},
                                                    "CoachImage": {},
                                                    "HeroImage": {},
                                                    "PlayerColorShadow": {}
                                                },
                                                "HeroBadgeOverlay": {},
                                                "HealthBar": {
                                                    "HealthBar_Left": {},
                                                    "HealthBar_Right": {}
                                                },
                                                "ManaBar": {
                                                    "ManaBar_Left": {},
                                                    "ManaBar_Right": {}
                                                },
                                                "TopBarUltIndicator": {},
                                                "AbilityDraftHitBox": {},
                                                "RespawnContainer": {
                                                    "BuybackIcon": {},
                                                    "RespawnTimer": {
                                                        "RespawnTimerLabel": {},
                                                        "TopBarBuybackStatus": {}
                                                    }
                                                },
                                                "GoldIcon": {},
                                                "TipButton": { "TipIcon": {} },
                                                "BountyButton": {
                                                    "BountyHeroImage": {},
                                                    "BountyIcon": {},
                                                    "BountyCancelLabel": {},
                                                    "BountyCancelButton": {}
                                                },
                                                "Bounties": {},
                                                "TPIndicator": {
                                                    "TopBarTPIcon": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier"
                                                                        : { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    }
                                                },
                                                "RoleButton": {
                                                    "RoleButton_Role": {},
                                                    "RoleButton_Dropdown": {}
                                                }
                                            },
                                            "RadiantPlayer4": {
                                                "StreakParticle": {},
                                                "StreakBorder": {},
                                                "CoachIcon": {},
                                                "SlantedContainerPanel": {
                                                    "PlayerColor": {},
                                                    "DeadLayer": {},
                                                    "DisconnectIcon": {},
                                                    "CoachImage": {},
                                                    "HeroImage": {},
                                                    "PlayerColorShadow": {}
                                                },
                                                "HeroBadgeOverlay": {},
                                                "HealthBar": {
                                                    "HealthBar_Left": {},
                                                    "HealthBar_Right": {}
                                                },
                                                "ManaBar": {
                                                    "ManaBar_Left": {},
                                                    "ManaBar_Right": {}
                                                },
                                                "TopBarUltIndicator": {},
                                                "AbilityDraftHitBox": {},
                                                "RespawnContainer": {
                                                    "BuybackIcon": {},
                                                    "RespawnTimer": {
                                                        "RespawnTimerLabel": {},
                                                        "TopBarBuybackStatus": {}
                                                    }
                                                },
                                                "GoldIcon": {},
                                                "TipButton": { "TipIcon": {} },
                                                "BountyButton": {
                                                    "BountyHeroImage": {},
                                                    "BountyIcon": {},
                                                    "BountyCancelLabel": {},
                                                    "BountyCancelButton": {}
                                                },
                                                "Bounties": {},
                                                "TPIndicator": {
                                                    "TopBarTPIcon": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {}
                                                                            , "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    }
                                                },
                                                "RoleButton": {
                                                    "RoleButton_Role": {},
                                                    "RoleButton_Dropdown": {}
                                                }
                                            },
                                            "RadiantPlayer5": {
                                                "StreakParticle": {},
                                                "StreakBorder": {},
                                                "CoachIcon": {},
                                                "SlantedContainerPanel": {
                                                    "PlayerColor": {},
                                                    "DeadLayer": {},
                                                    "DisconnectIcon": {},
                                                    "CoachImage": {},
                                                    "HeroImage": {},
                                                    "PlayerColorShadow": {}
                                                },
                                                "HeroBadgeOverlay": {},
                                                "HealthBar": {
                                                    "HealthBar_Left": {},
                                                    "HealthBar_Right": {}
                                                },
                                                "ManaBar": {
                                                    "ManaBar_Left": {},
                                                    "ManaBar_Right": {}
                                                },
                                                "TopBarUltIndicator": {},
                                                "AbilityDraftHitBox": {},
                                                "RespawnContainer": {
                                                    "BuybackIcon": {},
                                                    "RespawnTimer": {
                                                        "RespawnTimerLabel": {},
                                                        "TopBarBuybackStatus": {}
                                                    }
                                                },
                                                "GoldIcon": {},
                                                "TipButton": { "TipIcon": {} },
                                                "BountyButton": {
                                                    "BountyHeroImage": {},
                                                    "BountyIcon": {},
                                                    "BountyCancelLabel": {},
                                                    "BountyCancelButton": {}
                                                },
                                                "Bounties": {},
                                                "TPIndicator": {
                                                    "TopBarTPIcon": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    }
                                                },
                                                "RoleButton": {
                                                    "RoleButton_Role": {},
                                                    "RoleButton_Dropdown": {}
                                                }
                                            },
                                            "RadiantPlayer6": {
                                                "StreakParticle": {},
                                                "StreakBorder": {},
                                                "CoachIcon": {},
                                                "SlantedContainerPanel": {
                                                    "PlayerColor": {},
                                                    "DeadLayer": {},
                                                    "DisconnectIcon": {},
                                                    "CoachImage": {},
                                                    "HeroImage": {},
                                                    "PlayerColorShadow": {}
                                                },
                                                "HeroBadgeOverlay": {},
                                                "HealthBar": {
                                                    "HealthBar_Left": {},
                                                    "HealthBar_Right": {}
                                                },
                                                "ManaBar": {
                                                    "ManaBar_Left": {},
                                                    "ManaBar_Right": {}
                                                },
                                                "TopBarUltIndicator": {},
                                                "AbilityDraftHitBox": {},
                                                "RespawnContainer": {
                                                    "BuybackIcon": {},
                                                    "RespawnTimer": {
                                                        "RespawnTimerLabel": {},
                                                        "TopBarBuybackStatus": {}
                                                    }
                                                },
                                                "GoldIcon": {},
                                                "TipButton": { "TipIcon": {} },
                                                "BountyButton": {
                                                    "BountyHeroImage": {},
                                                    "BountyIcon": {},
                                                    "BountyCancelLabel": {},
                                                    "BountyCancelButton": {}
                                                },
                                                "Bounties": {},
                                                "TPIndicator": {
                                                    "TopBarTPIcon": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    }
                                                },
                                                "RoleButton": {
                                                    "RoleButton_Role": {},
                                                    "RoleButton_Dropdown": {}
                                                }
                                            },
                                            "RadiantPlayer7": {
                                                "StreakParticle": {},
                                                "StreakBorder": {},
                                                "CoachIcon": {},
                                                "SlantedContainerPanel": {
                                                    "PlayerColor": {},
                                                    "DeadLayer": {},
                                                    "DisconnectIcon": {},
                                                    "CoachImage": {},
                                                    "HeroImage": {},
                                                    "PlayerColorShadow": {}
                                                },
                                                "HeroBadgeOverlay": {},
                                                "HealthBar": {
                                                    "HealthBar_Left": {},
                                                    "HealthBar_Right": {}
                                                },
                                                "ManaBar": {
                                                    "ManaBar_Left": {},
                                                    "ManaBar_Right": {}
                                                },
                                                "TopBarUltIndicator": {},
                                                "AbilityDraftHitBox": {},
                                                "RespawnContainer": {
                                                    "BuybackIcon": {},
                                                    "RespawnTimer": {
                                                        "RespawnTimerLabel": {
                                                        },
                                                        "TopBarBuybackStatus": {}
                                                    }
                                                },
                                                "GoldIcon": {},
                                                "TipButton": { "TipIcon": {} },
                                                "BountyButton": {
                                                    "BountyHeroImage": {},
                                                    "BountyIcon": {},
                                                    "BountyCancelLabel": {},
                                                    "BountyCancelButton": {}
                                                },
                                                "Bounties": {},
                                                "TPIndicator": {
                                                    "TopBarTPIcon": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    }
                                                },
                                                "RoleButton": {
                                                    "RoleButton_Role": {},
                                                    "RoleButton_Dropdown": {}
                                                }
                                            },
                                            "RadiantPlayer8": {
                                                "StreakParticle": {},
                                                "StreakBorder": {},
                                                "CoachIcon": {},
                                                "SlantedContainerPanel": {
                                                    "PlayerColor": {},
                                                    "DeadLayer": {},
                                                    "DisconnectIcon": {},
                                                    "CoachImage": {},
                                                    "HeroImage": {},
                                                    "PlayerColorShadow": {}
                                                },
                                                "HeroBadgeOverlay": {},
                                                "HealthBar": {
                                                    "HealthBar_Left": {},
                                                    "HealthBar_Right": {}
                                                },
                                                "ManaBar": {
                                                    "ManaBar_Left": {},
                                                    "ManaBar_Right": {}
                                                },
                                                "TopBarUltIndicator": {},
                                                "AbilityDraftHitBox": {},
                                                "RespawnContainer": {
                                                    "BuybackIcon": {},
                                                    "RespawnTimer": {
                                                        "RespawnTimerLabel": {},
                                                        "TopBarBuybackStatus": {}
                                                    }
                                                },
                                                "GoldIcon": {},
                                                "TipButton": { "TipIcon": {} },
                                                "BountyButton": {
                                                    "BountyHeroImage":
                                                        {},
                                                    "BountyIcon": {},
                                                    "BountyCancelLabel": {},
                                                    "BountyCancelButton": {}
                                                },
                                                "Bounties": {},
                                                "TPIndicator": {
                                                    "TopBarTPIcon": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue"
                                                                            : {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    }
                                                },
                                                "RoleButton": {
                                                    "RoleButton_Role": {},
                                                    "RoleButton_Dropdown": {}
                                                }
                                            },
                                            "RadiantPlayer9": {
                                                "StreakParticle": {},
                                                "StreakBorder": {},
                                                "CoachIcon": {},
                                                "SlantedContainerPanel": {
                                                    "PlayerColor": {},
                                                    "DeadLayer": {},
                                                    "DisconnectIcon": {},
                                                    "CoachImage": {},
                                                    "HeroImage": {},
                                                    "PlayerColorShadow": {}
                                                },
                                                "HeroBadgeOverlay": {},
                                                "HealthBar": {
                                                    "HealthBar_Left": {},
                                                    "HealthBar_Right": {}
                                                },
                                                "ManaBar": {
                                                    "ManaBar_Left": {},
                                                    "ManaBar_Right": {}
                                                },
                                                "TopBarUltIndicator": {},
                                                "AbilityDraftHitBox": {},
                                                "RespawnContainer": {
                                                    "BuybackIcon": {},
                                                    "RespawnTimer": {
                                                        "RespawnTimerLabel": {},
                                                        "TopBarBuybackStatus": {}
                                                    }
                                                },
                                                "GoldIcon": {},
                                                "TipButton": { "TipIcon": {} },
                                                "BountyButton": {
                                                    "BountyHeroImage": {},
                                                    "BountyIcon": {},
                                                    "BountyCancelLabel": {},
                                                    "BountyCancelButton": {}
                                                },
                                                "Bounties": {},
                                                "TPIndicator": {
                                                    "TopBarTPIcon": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    }
                                                },
                                                "RoleButton": {
                                                    "RoleButton_Role": {},
                                                    "RoleButton_Dropdown": {}
                                                }
                                            }
                                        },
                                        "TopBireRadiantProTeamInfo": {
                                            "RadiantTournamentTeamImage": {},
                                            "RadiantFanCount": {}
                                        }
                                    }
                                }
                            }
                        },
                        "TimeOfDayBG": {},
                        "SpectatorGoldDisplay": {
                            "GoldDiscreteDisplay": {
                                "RadiantDiscreteDisplay": {},
                                "DireDiscreteDisplay": {}
                            }
                        },
                        "TimeOfDay": {
                            "DayNightCycle": {
                                "DayTime": {},
                                "NightTime": {}
                            },
                            "NightstalkerNight": {},
                            "GameTime": {}
                        },
                        "DayGlow": {},
                        "NightGlow": {},
                        "TimeUntil": {},
                        "TopBarDireTeamContainer": {
                            "TopBarDireTeam": {
                                "TopBarDirePlayers": {
                                    "DireTeamScorePlayers": {
                                        "TopBarDireScore": {},
                                        "TopBarDirePlayersContainer": {
                                            "DirePlayer-1": {
                                                "StreakParticle": {},
                                                "StreakBorder": {},
                                                "CoachIcon": {},
                                                "SlantedContainerPanel": {
                                                    "PlayerColor": {},
                                                    "DeadLayer": {},
                                                    "DisconnectIcon": {},
                                                    "CoachImage": {},
                                                    "HeroImage": {},
                                                    "PlayerColorShadow": {}
                                                },
                                                "HeroBadgeOverlay": {},
                                                "HealthBar": {
                                                    "HealthBar_Left": {},
                                                    "HealthBar_Right": {
                                                    }
                                                },
                                                "ManaBar": {
                                                    "ManaBar_Left": {},
                                                    "ManaBar_Right": {}
                                                },
                                                "TopBarUltIndicator": {},
                                                "AbilityDraftHitBox": {},
                                                "RespawnContainer": {
                                                    "BuybackIcon": {},
                                                    "RespawnTimer": {
                                                        "RespawnTimerLabel": {},
                                                        "TopBarBuybackStatus": {}
                                                    }
                                                },
                                                "GoldIcon": {},
                                                "TipButton": { "TipIcon": {} },
                                                "BountyButton": {
                                                    "BountyHeroImage": {},
                                                    "BountyIcon": {},
                                                    "BountyCancelLabel": {},
                                                    "BountyCancelButton": {}
                                                },
                                                "Bounties": {},
                                                "TPIndicator": {
                                                    "TopBarTPIcon": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    }
                                                },
                                                "RoleButton": {
                                                    "RoleButton_Role": {},
                                                    "RoleButton_Dropdown": {}
                                                }
                                            }
                                        },
                                        "TopBireDireProTeamInfo": {
                                            "DireTournamentTeamImage": {},
                                            "DireFanCount": {}
                                        }
                                    }
                                }
                            }
                        },
                        "TopBarRightFlare": {}
                    },
                    "combat_events": { "ToastLinesWrapper": { "ToastManager": {} } },
                    "combat_log": {
                        "CombatLogHeader": {
                            "CombatLogTitle": {},
                            "CombatLogRefreshButton": {},
                            "CombatLogCloseButton": {}
                        },
                        "CombatLogInset": {
                            "CombatLogSpinner": {},
                            "CombatLogLinesContainer": {}
                        },
                        "CombatLogControls": {
                            "CombatLogDropdownContainer": {
                                "CombatLogAttackerSelector": {
                                    "AttackerLabel": {},
                                    "AttackerDropdown": {}
                                },
                                "CombatLogTargetSelector": {
                                    "TargetLabel": {},
                                    "TargetDropdown": {}
                                }
                            },
                            "CombatLogTickBoxesContainer": {
                                "CombatLogTickBoxesTopRow": {
                                    "ToggleDamageLabel": {},
                                    "ToggleDamage": {},
                                    "ToggleHealingLabel": {},
                                    "ToggleHealing": {}
                                },
                                "CombatLogTickBoxesMiddleRow": {
                                    "ToggleAbilitiesLabel": {},
                                    "ToggleAbilities": {},
                                    "ToggleItemsLabel": {},
                                    "ToggleItems": {}
                                },
                                "CombatLogTickBoxesBottomRow": {
                                    "ToggleModifiersLabel": {},
                                    "ToggleModifiers": {},
                                    "ToggleDeathsLabel": {},
                                    "ToggleDeaths": {}
                                }
                            },
                            "CombatLogRefreshControls": {}
                        }
                    },
                    "spectator_item": {},
                    "spectator_talents": {},
                    "river_vial": { "RiverVialSlideout": {} },
                    "KillCam": {
                        "TotalDamageLabel": {},
                        "MainKillerContainer": {
                            "KillerInfo": {
                                "KillCamHeroImageOrMovie": { "KillerHeroGradient": {} },
                                "KillerInfoRight": {}
                            },
                            "TotalDamageColumnBG": {},
                            "HeroDmgContainer": {}
                        },
                        "InspectHero": {},
                        "ExpandButton": {},
                        "KillgraphButton": {}
                    },
                    "shop": {
                        "GuidesButton": { "GuidesButtonIcon": {} },
                        "GuideFlyout": {
                            "GuideFlyoutContainer": {},
                            "ItemsArea": {
                                "ItemBuildContainer": {
                                    "ItemBuild": {
                                        "BuildTitleContainer": {
                                            "BuildTitleRow": {
                                                "DotaPlusIcon": {},
                                                "EditBuildTitle": {},
                                                "EditButton": {}
                                            }
                                        },
                                        "Categories": {}
                                    }
                                }
                            }
                        },
                        "Main": {
                            "ItemCombinesAndBasicItemsContainer": {
                                "CommonItems": {
                                    "CommonItemTitleContainer": { "EditButton": {} },
                                    "ItemList": {}
                                },
                                "NewPlayerShopConsumables": { "NewPlayerShopConsumablesList": {} },
                                "ItemCombines": {
                                    "ConnectorsContainer": {},
                                    "ItemsContainer": {}
                                }
                            },
                            "HeightLimiter": {
                                "HeightLimiterContainer": {},
                                "titles": {
                                    "main_shop_title": {},
                                    "secret_title": {},
                                    "side_title": {},
                                    "custom_title": {},
                                    "ShopTabs": {
                                        "MainShopButton": {},
                                        "SecretShopButton": {},
                                        "SideShopButton": {}
                                    }
                                },
                                "GridMainShop": {
                                    "GridShopHeaders": {
                                        "SearchAndButtonsContainer": {
                                            "SearchContainer": {
                                                "SearchBox": {
                                                    "ShopSearchIcon": {},
                                                    "SearchTextEntry": { "PlaceholderText": {} },
                                                    "ClearSearchButton": {}
                                                }
                                            },
                                            "RequestSuggestion": {
                                                "RequestSuggestionIcon": {},
                                                "RequestSuggestionHeroImage": {}
                                            },
                                            "PopularItems": { "PopularItemsIcon": {} },
                                            "ToggleMinimalShop": {},
                                            "ToggleAdvancedShop": { "SimpleShopIcon": {} }
                                        },
                                        "GridMainTabs": {
                                            "GridBasicsTab": {},
                                            "GridNewShopTab": {},
                                            "GridUpgradesTab": {}
                                        }
                                    },
                                    "MainShopBasicHotkeys": {
                                        "HotkeyConsumables": {},
                                        "HotkeyAttributes": {},
                                        "HotkeyArmaments": {},
                                        "HotkeyArcane": {},
                                        "HotkeySecret": {}
                                    },
                                    "MainShopUpgradesHotkeys": {
                                        "HotkeyBasics": {},
                                        "HotkeySupport": {},
                                        "HotkeyCaster": {},
                                        "HotkeyArmor": {},
                                        "HotkeyWeapons": {},
                                        "HotkeyArtifacts": {}
                                    },
                                    "GridMainShopContents": {
                                        "GridNewShopCategory": {
                                            "NewPlayerShopItemContainer": {
                                                "NewPlayerShopItemContainerItems": {},
                                                "NewPlayerShopSkipButton": {}
                                            },
                                            "NewPlayerShopItemCombinerContainer": {
                                                "NewShopCombiningItem": {
                                                    "NewShopItemBuilding": {
                                                        "ItemImage": {},
                                                        "CanPurchaseOverlay": {},
                                                        "PopularOverlay": { "PopularIcon": {} },
                                                        "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                        "PlayerSuggestedOverlay": {},
                                                        "OwnedTick": {},
                                                        "SecretShop": {},
                                                        "StockAmount": {},
                                                        "OutOfStockOverlay": {},
                                                        "AvailableAtOtherShopOverlay": {},
                                                        "AvailableAtOtherShopNeedGoldOverlay": {},
                                                        "SuggestionPct": {},
                                                        "SequenceArrow": {},
                                                        "DotaSuggest": {}
                                                    }
                                                },
                                                "NewShopItemComplete": {
                                                    "ItemImage": {},
                                                    "CanPurchaseOverlay": {},
                                                    "PopularOverlay": { "PopularIcon": {} },
                                                    "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                    "PlayerSuggestedOverlay": {},
                                                    "OwnedTick": {},
                                                    "SecretShop": {},
                                                    "StockAmount": {},
                                                    "OutOfStockOverlay": {},
                                                    "AvailableAtOtherShopOverlay": {},
                                                    "AvailableAtOtherShopNeedGoldOverlay": {},
                                                    "SuggestionPct": {},
                                                    "SequenceArrow": {},
                                                    "DotaSuggest": {}
                                                },
                                                "NewShopItemComponents": {},
                                                "NewPlayerBackButton": {}
                                            }
                                        },
                                        "GridBasicItemsCategory": {
                                            "GridBasicItems": {
                                                "ShopItems_consumables": {
                                                    "ShopItemsHeader": {},
                                                    "ShopItemsContainer": {}
                                                },
                                                "ShopItems_attributes": {
                                                    "ShopItemsHeader": {},
                                                    "ShopItemsContainer": {}
                                                },
                                                "ShopItems_weapons_armor": {
                                                    "ShopItemsHeader": {},
                                                    "ShopItemsContainer": {}
                                                },
                                                "ShopItems_misc": {
                                                    "ShopItemsHeader": {},
                                                    "ShopItemsContainer": {}
                                                },
                                                "ShopItems_secretshop": {
                                                    "ShopItemsHeader": {},
                                                    "ShopItemsContainer": {}
                                                }
                                            }
                                        },
                                        "GridUpgradesCategory": {
                                            "GridUpgradeItems": {
                                                "ShopItems_basics": {
                                                    "ShopItemsHeader": {},
                                                    "ShopItemsContainer": {}
                                                },
                                                "ShopItems_support": {
                                                    "ShopItemsHeader": {},
                                                    "ShopItemsContainer": {}
                                                },
                                                "ShopItems_magics": {
                                                    "ShopItemsHeader": {},
                                                    "ShopItemsContainer": {}
                                                },
                                                "ShopItems_defense": {
                                                    "ShopItemsHeader": {},
                                                    "ShopItemsContainer": {}
                                                },
                                                "ShopItems_weapons": {
                                                    "ShopItemsHeader": {},
                                                    "ShopItemsContainer": {}
                                                },
                                                "ShopItems_artifacts": {
                                                    "ShopItemsHeader": {},
                                                    "ShopItemsContainer": {}
                                                }
                                            }
                                        },
                                        "GridNeutralsCategory": {}
                                    }
                                },
                                "SideShopHotkeys": {
                                    "HotkeySide1": {},
                                    "HotkeySide2": {}
                                },
                                "GridSideShop": {
                                    "GridSideShopItems": {
                                        "ShopItems_sideshop1": {
                                            "ShopItemsHeader": {},
                                            "ShopItemsContainer": {}
                                        },
                                        "ShopItems_sideshop2": {
                                            "ShopItemsHeader"
                                                : {},
                                            "ShopItemsContainer": {}
                                        }
                                    }
                                },
                                "SecretShopHotkeys": { "HotkeySecret": {} },
                                "GridSecretShop": {
                                    "GridSecretShopItems": {
                                        "ShopItems_secretshop": {
                                            "ShopItemsHeader": {},
                                            "ShopItemsContainer": {}
                                        }
                                    }
                                },
                                "GridCustomShop": {
                                    "CustomShopTitle": {},
                                    "GridCustomShopItems": {}
                                },
                                "SearchResults": {
                                    "SearchResultsTitle": {},
                                    "SearchResultsContents": {
                                        "SearchResult0": {
                                            "ShopItem": {
                                                "ItemImage": {},
                                                "CanPurchaseOverlay": {},
                                                "PopularOverlay":
                                                    { "PopularIcon": {} },
                                                "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                "PlayerSuggestedOverlay": {},
                                                "OwnedTick": {},
                                                "SecretShop": {},
                                                "StockAmount": {},
                                                "OutOfStockOverlay": {},
                                                "AvailableAtOtherShopOverlay": {},
                                                "AvailableAtOtherShopNeedGoldOverlay": {},
                                                "SuggestionPct": {},
                                                "SequenceArrow": {},
                                                "DotaSuggest": {}
                                            },
                                            "ItemName": {},
                                            "ItemCost": {}
                                        },
                                        "SearchResult1": {
                                            "ShopItem": {
                                                "ItemImage": {},
                                                "CanPurchaseOverlay": {},
                                                "PopularOverlay": { "PopularIcon": {} },
                                                "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                "PlayerSuggestedOverlay": {},
                                                "OwnedTick": {},
                                                "SecretShop": {},
                                                "StockAmount": {},
                                                "OutOfStockOverlay": {},
                                                "AvailableAtOtherShopOverlay": {},
                                                "AvailableAtOtherShopNeedGoldOverlay": {},
                                                "SuggestionPct": {},
                                                "SequenceArrow": {},
                                                "DotaSuggest": {}
                                            },
                                            "ItemName": {},
                                            "ItemCost": {}
                                        },
                                        "SearchResult2": {
                                            "ShopItem": {
                                                "ItemImage": {},
                                                "CanPurchaseOverlay": {},
                                                "PopularOverlay": { "PopularIcon": {} },
                                                "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                "PlayerSuggestedOverlay": {},
                                                "OwnedTick": {},
                                                "SecretShop": {},
                                                "StockAmount": {},
                                                "OutOfStockOverlay": {},
                                                "AvailableAtOtherShopOverlay": {},
                                                "AvailableAtOtherShopNeedGoldOverlay": {},
                                                "SuggestionPct": {},
                                                "SequenceArrow": {},
                                                "DotaSuggest": {}
                                            },
                                            "ItemName": {},
                                            "ItemCost": {}
                                        },
                                        "SearchResult3": {
                                            "ShopItem": {
                                                "ItemImage": {},
                                                "CanPurchaseOverlay": {},
                                                "PopularOverlay": { "PopularIcon": {} },
                                                "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                "PlayerSuggestedOverlay": {},
                                                "OwnedTick": {},
                                                "SecretShop": {},
                                                "StockAmount": {},
                                                "OutOfStockOverlay": {},
                                                "AvailableAtOtherShopOverlay": {},
                                                "AvailableAtOtherShopNeedGoldOverlay": {},
                                                "SuggestionPct": {},
                                                "SequenceArrow": {},
                                                "DotaSuggest": {}
                                            },
                                            "ItemName": {},
                                            "ItemCost": {}
                                        },
                                        "SearchResult4": {
                                            "ShopItem": {
                                                "ItemImage": {},
                                                "CanPurchaseOverlay": {},
                                                "PopularOverlay": { "PopularIcon": {} },
                                                "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                "PlayerSuggestedOverlay": {},
                                                "OwnedTick": {},
                                                "SecretShop": {},
                                                "StockAmount": {},
                                                "OutOfStockOverlay": {},
                                                "AvailableAtOtherShopOverlay": {},
                                                "AvailableAtOtherShopNeedGoldOverlay": {},
                                                "SuggestionPct": {},
                                                "SequenceArrow": {},
                                                "DotaSuggest": {}
                                            },
                                            "ItemName": {},
                                            "ItemCost": {}
                                        },
                                        "SearchResult5": {
                                            "ShopItem": {
                                                "ItemImage": {},
                                                "CanPurchaseOverlay": {},
                                                "PopularOverlay": { "PopularIcon": {} },
                                                "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                "PlayerSuggestedOverlay": {},
                                                "OwnedTick": {},
                                                "SecretShop": {},
                                                "StockAmount": {},
                                                "OutOfStockOverlay": {},
                                                "AvailableAtOtherShopOverlay": {},
                                                "AvailableAtOtherShopNeedGoldOverlay": {},
                                                "SuggestionPct": {},
                                                "SequenceArrow": {},
                                                "DotaSuggest": {}
                                            },
                                            "ItemName": {},
                                            "ItemCost": {}
                                        },
                                        "SearchResult6": {
                                            "ShopItem": {
                                                "ItemImage": {},
                                                "CanPurchaseOverlay": {},
                                                "PopularOverlay": { "PopularIcon": {} },
                                                "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                "PlayerSuggestedOverlay": {},
                                                "OwnedTick": {},
                                                "SecretShop": {},
                                                "StockAmount": {},
                                                "OutOfStockOverlay": {},
                                                "AvailableAtOtherShopOverlay": {},
                                                "AvailableAtOtherShopNeedGoldOverlay": {},
                                                "SuggestionPct": {},
                                                "SequenceArrow": {},
                                                "DotaSuggest": {}
                                            },
                                            "ItemName": {},
                                            "ItemCost": {}
                                        },
                                        "SearchResult7": {
                                            "ShopItem": {
                                                "ItemImage": {},
                                                "CanPurchaseOverlay": {},
                                                "PopularOverlay": { "PopularIcon": {} },
                                                "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                "PlayerSuggestedOverlay": {},
                                                "OwnedTick": {},
                                                "SecretShop": {},
                                                "StockAmount": {},
                                                "OutOfStockOverlay": {},
                                                "AvailableAtOtherShopOverlay": {},
                                                "AvailableAtOtherShopNeedGoldOverlay": {},
                                                "SuggestionPct": {},
                                                "SequenceArrow": {},
                                                "DotaSuggest": {}
                                            },
                                            "ItemName": {},
                                            "ItemCost": {}
                                        },
                                        "SearchResult8": {
                                            "ShopItem": {
                                                "ItemImage": {},
                                                "CanPurchaseOverlay": {},
                                                "PopularOverlay": { "PopularIcon": {} },
                                                "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                "PlayerSuggestedOverlay": {},
                                                "OwnedTick": {},
                                                "SecretShop": {},
                                                "StockAmount": {},
                                                "OutOfStockOverlay": {},
                                                "AvailableAtOtherShopOverlay": {},
                                                "AvailableAtOtherShopNeedGoldOverlay": {},
                                                "SuggestionPct": {},
                                                "SequenceArrow": {},
                                                "DotaSuggest": {}
                                            },
                                            "ItemName": {},
                                            "ItemCost": {}
                                        },
                                        "SearchResult9": {
                                            "ShopItem": {
                                                "ItemImage": {},
                                                "CanPurchaseOverlay": {},
                                                "PopularOverlay": { "PopularIcon": {} },
                                                "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                "PlayerSuggestedOverlay": {},
                                                "OwnedTick": {},
                                                "SecretShop": {},
                                                "StockAmount": {},
                                                "OutOfStockOverlay": {},
                                                "AvailableAtOtherShopOverlay": {},
                                                "AvailableAtOtherShopNeedGoldOverlay": {},
                                                "SuggestionPct": {},
                                                "SequenceArrow": {},
                                                "DotaSuggest": {}
                                            },
                                            "ItemName": {},
                                            "ItemCost": {}
                                        },
                                        "SearchResult10": {
                                            "ShopItem": {
                                                "ItemImage": {},
                                                "CanPurchaseOverlay": {},
                                                "PopularOverlay": { "PopularIcon": {} },
                                                "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                "PlayerSuggestedOverlay": {},
                                                "OwnedTick": {},
                                                "SecretShop": {},
                                                "StockAmount": {},
                                                "OutOfStockOverlay": {},
                                                "AvailableAtOtherShopOverlay": {},
                                                "AvailableAtOtherShopNeedGoldOverlay": {},
                                                "SuggestionPct": {},
                                                "SequenceArrow": {},
                                                "DotaSuggest": {}
                                            },
                                            "ItemName": {},
                                            "ItemCost": {}
                                        },
                                        "SearchResult11": {
                                            "ShopItem": {
                                                "ItemImage": {},
                                                "CanPurchaseOverlay": {},
                                                "PopularOverlay": { "PopularIcon": {} },
                                                "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                "PlayerSuggestedOverlay": {},
                                                "OwnedTick": {},
                                                "SecretShop": {},
                                                "StockAmount": {},
                                                "OutOfStockOverlay": {},
                                                "AvailableAtOtherShopOverlay": {},
                                                "AvailableAtOtherShopNeedGoldOverlay": {},
                                                "SuggestionPct": {},
                                                "SequenceArrow": {},
                                                "DotaSuggest": {}
                                            },
                                            "ItemName": {},
                                            "ItemCost": {}
                                        }
                                    }
                                },
                                "GridRowHotkeys": {
                                    "ShopSlot13": {},
                                    "ShopSlot14": {}
                                }
                            }
                        }
                    },
                    "inspect": {
                        "HeroInspectBackground": {},
                        "CloseButton": {},
                        "HeroNameContainer": {
                            "HeroBadge": {},
                            "HeroName": {}
                        },
                        "EconItemContainer": {},
                        "InspectHeroModelEffect": {},
                        "HeroModel": {},
                        "HeroModelOverlay": {}
                    },
                    "CursorCooldown": {
                        "CursorCooldownBackground": {},
                        "CursorCooldownRadialSweep": {},
                        "CursorCooldownValue": {},
                        "NotEnoughManaLabel": {}
                    },
                    "HudChat": {
                        "ChatDialogVariablePanel": {},
                        "ChatMessageTempLabel": {}
                    },
                    "NeutralCampPullTimes": {},
                    "AbilityHeroIcons": {},
                    "minimap_container": {
                        "minimap_block": { "minimap": {} },
                        "HUDSkinMinimap": {},
                        "GlyphScanContainer": {
                            "RadarButton": {
                                "NormalRoot": {
                                    "RadarIcon": {},
                                    "CooldownCover": {}
                                },
                                "RadiantRadarRoot": {
                                    "RadiantRadarIcon"
                                        : {},
                                    "RadiantCooldownCover": {}
                                },
                                "DireRadarRoot": {
                                    "DireRadarIcon": {},
                                    "DireCooldownCover": {}
                                },
                                "SpectatorDivider": {}
                            },
                            "glyph": {
                                "NormalRoot": {
                                    "GlyphButton": {},
                                    "GlyphCooldown": {}
                                },
                                "RadiantRoot": {
                                    "RadiantGlyphButton": {},
                                    "RadiantGlyphCooldown": {}
                                },
                                "DireRoot": {
                                    "DireGlyphButton": {},
                                    "DireGlyphCooldown": {}
                                },
                                "SpectatorDivider": {}
                            }
                        },
                        "RoshanTimerContainer": {
                            "RoshanTimer": {
                                "RoshanIconBackground": {},
                                "RoshanIcon": {
                                },
                                "RoshanTimerRadial": {}
                            }
                        }
                    },
                    "splash_screen": {},
                    "lower_hud": {
                        "StatBranchDrawer": {
                            "statbranchdialog": {
                                "DOTAStatBranch": {
                                    "StatBranchOuter": {
                                        "TalentDescriptions": {
                                            "TalentPair4": {
                                                "Upgrade8Container": { "Upgrade8DescriptionContainer": { "Upgrade8Description": { "Description8": {} } } },
                                                "Upgrade7Container": { "Upgrade7DescriptionContainer": { "Upgrade7Description": { "Description7": {} } } }
                                            },
                                            "TalentPair3": {
                                                "Upgrade6Container": { "Upgrade6DescriptionContainer": { "Upgrade6Description": { "Description6": {} } } },
                                                "Upgrade5Container": { "Upgrade5DescriptionContainer": { "Upgrade5Description": { "Description5": {} } } }
                                            },
                                            "TalentPair2": {
                                                "Upgrade4Container": { "Upgrade4DescriptionContainer": { "Upgrade4Description": { "Description4": {} } } },
                                                "Upgrade3Container": { "Upgrade3DescriptionContainer": { "Upgrade3Description": { "Description3": {} } } }
                                            },
                                            "TalentPair1": {
                                                "Upgrade2Container": { "Upgrade2DescriptionContainer": { "Upgrade2Description": { "Description2": {} } } },
                                                "Upgrade1Container": { "Upgrade1DescriptionContainer": { "Upgrade1Description": { "Description1": {} } } }
                                            }
                                        },
                                        "StatUpgradeOption": {
                                            "UpgradeStat": {
                                                "UpgradeStatBG": {},
                                                "UpgradeStatLevelContainer": {
                                                    "StatUp0": {},
                                                    "StatUp1": {},
                                                    "StatUp2": {},
                                                    "StatUp3": {},
                                                    "StatUp4": {},
                                                    "StatUp5": {},
                                                    "StatUp6": {}
                                                },
                                                "UpgradeStatName": {}
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "BuffContainer": {
                            "buffs": {
                                "Buff0": {},
                                "Buff1": {},
                                "Buff2": {},
                                "Buff3": {},
                                "Buff4": {},
                                "Buff5": {},
                                "Buff6": {},
                                "Buff7": {}
                            },
                            "debuffs": {
                                "Buff0": {},
                                "Buff1": {},
                                "Buff2": {},
                                "Buff3": {},
                                "Buff4": {},
                                "Buff5": {},
                                "Buff6": {},
                                "Buff7": {}
                            }
                        },
                        "InvokerSpellCard": {
                            "CloseSpellCard": {},
                            "HideNames": {
                                "HideNamesLabel": {},
                                "ShowNamesLabel": {}
                            },
                            "SpellRowContainer": {
                                "SpellRow0": {
                                    "SpellColumn0": {
                                        "Row0": {
                                            "AbilityIcon": {},
                                            "KeyContainer0": {
                                                "InvokeKey0": {},
                                                "InvokeModifier0": {}
                                            },
                                            "KeyContainer1": {
                                                "InvokeKey1": {},
                                                "InvokeModifier1": {}
                                            },
                                            "KeyContainer2": {
                                                "InvokeKey2": {},
                                                "InvokeModifier2": {}
                                            },
                                            "AbilityName": {}
                                        },
                                        "Row1": {
                                            "AbilityIcon": {},
                                            "KeyContainer0": {
                                                "InvokeKey0": {},
                                                "InvokeModifier0": {}
                                            },
                                            "KeyContainer1": {
                                                "InvokeKey1": {},
                                                "InvokeModifier1": {}
                                            },
                                            "KeyContainer2": {
                                                "InvokeKey2": {},
                                                "InvokeModifier2": {}
                                            },
                                            "AbilityName": {}
                                        },
                                        "Row2": {
                                            "AbilityIcon"
                                                : {},
                                            "KeyContainer0": {
                                                "InvokeKey0": {},
                                                "InvokeModifier0": {}
                                            },
                                            "KeyContainer1": {
                                                "InvokeKey1": {},
                                                "InvokeModifier1": {}
                                            },
                                            "KeyContainer2": {
                                                "InvokeKey2": {},
                                                "InvokeModifier2": {}
                                            },
                                            "AbilityName": {}
                                        }
                                    },
                                    "SpellColumn3": {
                                        "Row3": {
                                            "AbilityIcon": {},
                                            "KeyContainer0": {
                                                "InvokeKey0": {},
                                                "InvokeModifier0": {}
                                            },
                                            "KeyContainer1": {
                                                "InvokeKey1": {},
                                                "InvokeModifier1": {}
                                            },
                                            "KeyContainer2": {
                                                "InvokeKey2": {},
                                                "InvokeModifier2": {}
                                            },
                                            "AbilityName": {}
                                        },
                                        "Row4": {
                                            "AbilityIcon": {},
                                            "KeyContainer0": {
                                                "InvokeKey0": {},
                                                "InvokeModifier0": {}
                                            },
                                            "KeyContainer1": {
                                                "InvokeKey1": {},
                                                "InvokeModifier1": {}
                                            },
                                            "KeyContainer2": {
                                                "InvokeKey2": {},
                                                "InvokeModifier2": {}
                                            },
                                            "AbilityName": {}
                                        },
                                        "Row5": {
                                            "AbilityIcon": {},
                                            "KeyContainer0": {
                                                "InvokeKey0": {},
                                                "InvokeModifier0": {}
                                            },
                                            "KeyContainer1": {
                                                "InvokeKey1": {},
                                                "InvokeModifier1": {}
                                            },
                                            "KeyContainer2": {
                                                "InvokeKey2": {},
                                                "InvokeModifier2": {}
                                            },
                                            "AbilityName": {}
                                        }
                                    },
                                    "SpellColumn6": {
                                        "Row6": {
                                            "AbilityIcon": {},
                                            "KeyContainer0": {
                                                "InvokeKey0": {},
                                                "InvokeModifier0": {}
                                            },
                                            "KeyContainer1": {
                                                "InvokeKey1": {},
                                                "InvokeModifier1": {}
                                            },
                                            "KeyContainer2": {
                                                "InvokeKey2": {},
                                                "InvokeModifier2": {}
                                            },
                                            "AbilityName": {}
                                        },
                                        "Row7": {
                                            "AbilityIcon": {},
                                            "KeyContainer0": {
                                                "InvokeKey0": {},
                                                "InvokeModifier0": {}
                                            },
                                            "KeyContainer1": {
                                                "InvokeKey1": {},
                                                "InvokeModifier1": {}
                                            },
                                            "KeyContainer2": {
                                                "InvokeKey2": {},
                                                "InvokeModifier2": {}
                                            },
                                            "AbilityName": {}
                                        },
                                        "Row8": {
                                            "AbilityIcon": {},
                                            "KeyContainer0": {
                                                "InvokeKey0": {},
                                                "InvokeModifier0": {}
                                            },
                                            "KeyContainer1": {
                                                "InvokeKey1": {},
                                                "InvokeModifier1": {}
                                            },
                                            "KeyContainer2": {
                                                "InvokeKey2": {},
                                                "InvokeModifier2": {}
                                            },
                                            "AbilityName": {}
                                        }
                                    }
                                },
                                "SpellRow9": {
                                    "SpellColumn9": {
                                        "Row9": {
                                            "AbilityIcon": {},
                                            "KeyContainer0": {
                                                "InvokeKey0": {},
                                                "InvokeModifier0": {}
                                            },
                                            "KeyContainer1": {
                                                "InvokeKey1": {},
                                                "InvokeModifier1": {}
                                            },
                                            "KeyContainer2": {
                                                "InvokeKey2": {},
                                                "InvokeModifier2": {}
                                            },
                                            "AbilityName": {}
                                        }
                                    }
                                }
                            }
                        },
                        "center_with_stats": {
                            "center_block": {
                                "left_flare": {},
                                "center_bg": {},
                                "HUDSkinPortrait": {},
                                "HUDSkinXPBackground": {},
                                "multiunit": {
                                    "canvas": {},
                                    "UnitFrames": {
                                        "Unit0": {
                                            "HealthBar": {
                                                "HealthBar_Left": {},
                                                "HealthBar_Right": {}
                                            },
                                            "ManaBar": {
                                                "ManaBar_Left": {},
                                                "ManaBar_Right": {}
                                            },
                                            "ShadowBorder": {},
                                            "ActiveGroupFrame": {},
                                            "MultiUnitHotkey": {}
                                        },
                                        "Unit1": {
                                            "HealthBar": {
                                                "HealthBar_Left": {},
                                                "HealthBar_Right": {}
                                            },
                                            "ManaBar": {
                                                "ManaBar_Left": {},
                                                "ManaBar_Right": {}
                                            },
                                            "ShadowBorder": {},
                                            "ActiveGroupFrame": {},
                                            "MultiUnitHotkey": {}
                                        },
                                        "Unit2": {
                                            "HealthBar": {
                                                "HealthBar_Left": {},
                                                "HealthBar_Right": {}
                                            },
                                            "ManaBar": {
                                                "ManaBar_Left": {},
                                                "ManaBar_Right": {}
                                            },
                                            "ShadowBorder": {},
                                            "ActiveGroupFrame": {},
                                            "MultiUnitHotkey": {}
                                        },
                                        "Unit3": {
                                            "HealthBar": {
                                                "HealthBar_Left": {},
                                                "HealthBar_Right": {}
                                            },
                                            "ManaBar": {
                                                "ManaBar_Left": {},
                                                "ManaBar_Right": {}
                                            },
                                            "ShadowBorder": {},
                                            "ActiveGroupFrame": {},
                                            "MultiUnitHotkey": {}
                                        },
                                        "Unit4": {
                                            "HealthBar": {
                                                "HealthBar_Left": {},
                                                "HealthBar_Right": {}
                                            },
                                            "ManaBar": {
                                                "ManaBar_Left": {},
                                                "ManaBar_Right": {}
                                            },
                                            "ShadowBorder": {},
                                            "ActiveGroupFrame": {},
                                            "MultiUnitHotkey": {}
                                        },
                                        "Unit5": {
                                            "HealthBar": {
                                                "HealthBar_Left": {},
                                                "HealthBar_Right":
                                                    {}
                                            },
                                            "ManaBar": {
                                                "ManaBar_Left": {},
                                                "ManaBar_Right": {}
                                            },
                                            "ShadowBorder": {},
                                            "ActiveGroupFrame": {},
                                            "MultiUnitHotkey": {}
                                        },
                                        "Unit6": {
                                            "HealthBar": {
                                                "HealthBar_Left": {},
                                                "HealthBar_Right": {}
                                            },
                                            "ManaBar": {
                                                "ManaBar_Left": {},
                                                "ManaBar_Right": {}
                                            },
                                            "ShadowBorder": {},
                                            "ActiveGroupFrame": {},
                                            "MultiUnitHotkey": {}
                                        },
                                        "Unit7": {
                                            "HealthBar": {
                                                "HealthBar_Left": {},
                                                "HealthBar_Right": {}
                                            },
                                            "ManaBar": {
                                                "ManaBar_Left": {},
                                                "ManaBar_Right": {
                                                }
                                            },
                                            "ShadowBorder": {},
                                            "ActiveGroupFrame": {},
                                            "MultiUnitHotkey": {}
                                        },
                                        "Unit8": {
                                            "HealthBar": {
                                                "HealthBar_Left": {},
                                                "HealthBar_Right": {}
                                            },
                                            "ManaBar": {
                                                "ManaBar_Left": {},
                                                "ManaBar_Right": {}
                                            },
                                            "ShadowBorder": {},
                                            "ActiveGroupFrame": {},
                                            "MultiUnitHotkey": {}
                                        },
                                        "Unit9": {
                                            "HealthBar": {
                                                "HealthBar_Left": {},
                                                "HealthBar_Right": {}
                                            },
                                            "ManaBar": {
                                                "ManaBar_Left": {},
                                                "ManaBar_Right": {}
                                            },
                                            "ShadowBorder": {},
                                            "ActiveGroupFrame": {},
                                            "MultiUnitHotkey": {}
                                        },
                                        "Unit10": {
                                            "HealthBar": {
                                                "HealthBar_Left": {},
                                                "HealthBar_Right": {}
                                            },
                                            "ManaBar": {
                                                "ManaBar_Left": {},
                                                "ManaBar_Right": {}
                                            },
                                            "ShadowBorder": {},
                                            "ActiveGroupFrame": {},
                                            "MultiUnitHotkey": {}
                                        },
                                        "Unit11": {
                                            "HealthBar": {
                                                "HealthBar_Left": {},
                                                "HealthBar_Right": {}
                                            },
                                            "ManaBar": {
                                                "ManaBar_Left": {},
                                                "ManaBar_Right": {}
                                            },
                                            "ShadowBorder": {},
                                            "ActiveGroupFrame": {},
                                            "MultiUnitHotkey": {}
                                        }
                                    },
                                    "PageButtons": {
                                        "PageButton0": {},
                                        "PageButton1": {},
                                        "PageButton2": {},
                                        "PageButton3": {},
                                        "PageButton4": {}
                                    }
                                },
                                "PortraitGroup": {
                                    "PortraitStreakParticle": {},
                                    "PortraitStreakParticleBorder": {},
                                    "PortraitBacker": {},
                                    "PortraitBackerColor": {},
                                    "PortraitContainer": {
                                        "portraitHUD": {
                                            "LowerOverlay": {},
                                            "InspectButton": {},
                                            "HeroViewButton": {},
                                            "ReportUserButton": {}
                                        },
                                        "portraitHUDOverlay": {
                                            "LowerOverlay": {},
                                            "InspectButton": {},
                                            "HeroViewButton": {},
                                            "ReportUserButton": {}
                                        },
                                        "RightSideHeroBlur": {},
                                        "SilenceIcon": {},
                                        "MutedIcon": {},
                                        "DeathGradient": {}
                                    }
                                },
                                "death_panel_buyback": {
                                    "RespawnBacker": {},
                                    "RespawnLabel": {},
                                    "BuybackButton": {
                                        "BuybackLabel": {},
                                        "NoBuybackLabel": {},
                                        "BuybackStatusContainer": {
                                            "BuybackCostIcon": {},
                                            "BuybackCostIconCooldown": {},
                                            "BuybackCostLabel": {},
                                            "BuybackCooldownLabel": {}
                                        },
                                        "Cooldown": {},
                                        "Cost": {}
                                    }
                                },
                                "xp": {
                                    "LevelBackground": {},
                                    "LevelLabel": {},
                                    "XPProgress": {
                                        "XPProgress_Left": {},
                                        "XPProgress_Right": {},
                                        "XPLabel": {}
                                    },
                                    "LifetimeLabel": {},
                                    "LifetimeProgress": {
                                        "LifetimeProgress_Left": {},
                                        "LifetimeProgress_Right": {}
                                    }
                                },
                                "stats_container": {
                                    "stats_container_bg": {},
                                    "HUDSkinStatBranchBG": {},
                                    "HUDSkinStatBranchGlow": {},
                                    "stats": {
                                        "Aligner": {
                                            "StatContainer": {
                                                "Damage": { "DamageIcon": {} },
                                                "Armor": { "ArmorIcon": {} },
                                                "MoveSpeed": {
                                                    "MoveSpeedLabelBase": {},
                                                    "MoveSpeedModifierLabel": {},
                                                    "MoveSpeedIcon": {}
                                                }
                                            }
                                        }
                                    },
                                    "stragiint": {
                                        "Strength": {
                                            "StrengthLabel": {},
                                            "StrengthModifierLabel": {},
                                            "StrengthIcon": {}
                                        },
                                        "Agility": {
                                            "AgilityLabel": {},
                                            "AgilityModifierLabel": {},
                                            "AgilityIcon": {}
                                        },
                                        "Intelligence": {
                                            "IntelligenceLabel": {},
                                            "IntelligenceModifierLabel": {},
                                            "IntelligenceIcon": {}
                                        }
                                    },
                                    "stats_tooltip_region": {}
                                },
                                "RecommendedUpgradeOverlay": {},
                                "unitname": { "UnitNameLabel": {} },
                                "KillGraphButton"
                                    : {},
                                "unitbadge": {
                                    "PortraitHeroBadge": {},
                                    "PortraitHeroBadgeOverlay": {}
                                },
                                "level_stats_frame": {
                                    "LevelUpBurstFX": {},
                                    "LevelUpTab": {
                                        "LevelUpButton": { "LevelUpIcon": {} },
                                        "LearnModeButton": {}
                                    },
                                    "LevelUpGlow": {},
                                    "ButtonWell": { "RecommendedUpgradeOverlay": {} }
                                },
                                "levelup": {
                                    "LevelUpButton": { "LevelUpLabel": {} },
                                    "LevelUpHotkey": {}
                                },
                                "health_mana": {
                                    "HealthManaContainer": {
                                        "HealthContainer": {
                                            "HealthLabel": {},
                                            "HealthProgress": {
                                                "HealthProgress_Left": {},
                                                "HealthProgress_Right": {}
                                            },
                                            "HealthTicks": {},
                                            "HealthRegenLabel": {}
                                        },
                                        "BarSpacer": {},
                                        "ManaContainer": {
                                            "ManaLabel": {},
                                            "ManaProgress": {
                                                "ManaProgress_Left": {},
                                                "ManaProgress_Right": {}
                                            },
                                            "ManaTicks": {},
                                            "ManaRegenLabel": {}
                                        }
                                    }
                                },
                                "HUDSkinAbilityContainerBG": {},
                                "StatBranchHotkey": {},
                                "SecondaryAbilityContainer": { "SecondaryAbilitiesBar": { "Contents": { "AbilityButtons": {} } } },
                                "AbilitiesAndStatBranch": {
                                    "MorphProgress": {
                                        "MorphProgress_Left": {},
                                        "MorphProgress_Right": {}
                                    }
                                },
                                "econ_item": {
                                    "EconItemContainer": {
                                        "EconItem": {
                                            "BottomLayer": { "BottomLayerOverlay": {} },
                                            "EconItemIcon": {},
                                            "MultiStyle": {
                                                "MultiStyleIcon": {},
                                                "MultiStyleSelectedStyle": {},
                                                "MultiStyleDropDownIcon": {}
                                            },
                                            "Inspect": {},
                                            "Equipped": {},
                                            "Shuffled": {},
                                            "NewItem": {},
                                            "TopLayer": {},
                                            "ClearCollection": {},
                                            "PlayerCard": {
                                                "Inset": {
                                                    "Headshot": {},
                                                    "PlayerName": {}
                                                }
                                            }
                                        }
                                    }
                                },
                                "inventory": {
                                    "inventory_items": {
                                        "InventoryContainer": {
                                            "InventoryBG": {},
                                            "HUDSkinInventoryBG": {},
                                            "inventory_list_container": {
                                                "inventory_list": {
                                                    "inventory_slot_0": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": {
                                                                    "AbilityChargesBorder": {}
                                                                }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    },
                                                    "inventory_slot_1": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": {
                                                                    "AbilityChargesBorder":
                                                                        {}
                                                                }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    },
                                                    "inventory_slot_2": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    }
                                                },
                                                "inventory_list2": {
                                                    "inventory_slot_3": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    },
                                                    "inventory_slot_4": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {}
                                                                        , "ManaCost": {},
                                                                        "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    },
                                                    "inventory_slot_5": {
                                                        "ButtonAndLevel": {
                                                            "LevelUpBurstFXContainer": {},
                                                            "ButtonWithLevelUpTab": {
                                                                "LevelUpTab": {
                                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                                    "LearnModeButton": {}
                                                                },
                                                                "LevelUpLight": {},
                                                                "ButtonWell": {
                                                                    "AutocastableBorder": {},
                                                                    "AutoCastingContainer": {},
                                                                    "ButtonSize": {
                                                                        "AbilityButton": {
                                                                            "AbilityImage": {},
                                                                            "ItemImage": {},
                                                                            "AbilityBevel": {},
                                                                            "ShineContainer": { "Shine": {} },
                                                                            "TopBarUltimateCooldown": {},
                                                                            "Cooldown": {
                                                                                "CooldownOverlay": {},
                                                                                "CooldownTimer": {}
                                                                            },
                                                                            "ActiveAbility": {},
                                                                            "InactiveOverlay": {},
                                                                            "ItemCharges": {},
                                                                            "ItemAltCharges": {}
                                                                        },
                                                                        "ActiveAbilityBorder": {},
                                                                        "PassiveAbilityBorder": {},
                                                                        "AutocastableAbilityBorder": {},
                                                                        "RubickArcanaContainer": {},
                                                                        "GoldCostBG": {},
                                                                        "GoldCost": {},
                                                                        "ManaCostBG": {},
                                                                        "ManaCost": {}
                                                                        , "AgiValue": {},
                                                                        "StrValue": {},
                                                                        "CombineLockedOverlay": {},
                                                                        "SilencedOverlay": {},
                                                                        "AbilityStatusOverlay": {},
                                                                        "UpgradeOverlay": {},
                                                                        "RecommendedUpgradeOverlay": {},
                                                                        "RecommendedUpgradePct": {},
                                                                        "DropTargetHighlight": {}
                                                                    }
                                                                },
                                                                "HotkeyContainer": {
                                                                    "Hotkey": { "HotkeyText": {} },
                                                                    "HotkeyModifier": { "AltText": {} },
                                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                                },
                                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                                            },
                                                            "QueryLevelGradient": {},
                                                            "AbilityLevelContainer": {}
                                                        },
                                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                        "SpellCardButton": { "SpellsLabel": {} }
                                                    }
                                                }
                                            },
                                            "inventory_backpack_list": {
                                                "inventory_slot_6": {
                                                    "ButtonAndLevel": {
                                                        "LevelUpBurstFXContainer": {},
                                                        "ButtonWithLevelUpTab": {
                                                            "LevelUpTab": {
                                                                "LevelUpButton": { "LevelUpIcon": {} },
                                                                "LearnModeButton": {}
                                                            },
                                                            "LevelUpLight": {},
                                                            "ButtonWell": {
                                                                "AutocastableBorder": {},
                                                                "AutoCastingContainer": {},
                                                                "ButtonSize": {
                                                                    "AbilityButton": {
                                                                        "AbilityImage": {},
                                                                        "ItemImage": {},
                                                                        "AbilityBevel": {},
                                                                        "ShineContainer": { "Shine": {} },
                                                                        "TopBarUltimateCooldown": {},
                                                                        "Cooldown": {
                                                                            "CooldownOverlay": {},
                                                                            "CooldownTimer": {}
                                                                        },
                                                                        "ActiveAbility": {},
                                                                        "InactiveOverlay": {},
                                                                        "ItemCharges": {},
                                                                        "ItemAltCharges": {}
                                                                    },
                                                                    "ActiveAbilityBorder": {},
                                                                    "PassiveAbilityBorder": {},
                                                                    "AutocastableAbilityBorder": {},
                                                                    "RubickArcanaContainer": {},
                                                                    "GoldCostBG": {},
                                                                    "GoldCost": {},
                                                                    "ManaCostBG": {
                                                                    },
                                                                    "ManaCost": {},
                                                                    "AgiValue": {},
                                                                    "StrValue": {},
                                                                    "CombineLockedOverlay": {},
                                                                    "SilencedOverlay": {},
                                                                    "AbilityStatusOverlay": {},
                                                                    "UpgradeOverlay": {},
                                                                    "RecommendedUpgradeOverlay": {},
                                                                    "RecommendedUpgradePct": {},
                                                                    "DropTargetHighlight": {}
                                                                }
                                                            },
                                                            "HotkeyContainer": {
                                                                "Hotkey": { "HotkeyText": {} },
                                                                "HotkeyModifier": { "AltText": {} },
                                                                "HotkeyCtrlModifier": { "CtrlText": {} }
                                                            },
                                                            "AbilityCharges": { "AbilityChargesBorder": {} }
                                                        },
                                                        "QueryLevelGradient": {},
                                                        "AbilityLevelContainer": {}
                                                    },
                                                    "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                    "SpellCardButton": { "SpellsLabel": {} }
                                                },
                                                "inventory_slot_7": {
                                                    "ButtonAndLevel": {
                                                        "LevelUpBurstFXContainer": {},
                                                        "ButtonWithLevelUpTab": {
                                                            "LevelUpTab": {
                                                                "LevelUpButton": { "LevelUpIcon": {} },
                                                                "LearnModeButton": {}
                                                            },
                                                            "LevelUpLight": {},
                                                            "ButtonWell": {
                                                                "AutocastableBorder": {},
                                                                "AutoCastingContainer": {},
                                                                "ButtonSize": {
                                                                    "AbilityButton": {
                                                                        "AbilityImage": {},
                                                                        "ItemImage": {},
                                                                        "AbilityBevel": {},
                                                                        "ShineContainer": { "Shine": {} },
                                                                        "TopBarUltimateCooldown": {},
                                                                        "Cooldown": {
                                                                            "CooldownOverlay": {},
                                                                            "CooldownTimer": {}
                                                                        },
                                                                        "ActiveAbility": {},
                                                                        "InactiveOverlay": {},
                                                                        "ItemCharges": {},
                                                                        "ItemAltCharges": {}
                                                                    },
                                                                    "ActiveAbilityBorder": {},
                                                                    "PassiveAbilityBorder": {},
                                                                    "AutocastableAbilityBorder": {},
                                                                    "RubickArcanaContainer": {},
                                                                    "GoldCostBG": {},
                                                                    "GoldCost": {},
                                                                    "ManaCostBG": {},
                                                                    "ManaCost": {
                                                                    },
                                                                    "AgiValue": {},
                                                                    "StrValue": {},
                                                                    "CombineLockedOverlay": {},
                                                                    "SilencedOverlay": {},
                                                                    "AbilityStatusOverlay": {},
                                                                    "UpgradeOverlay": {},
                                                                    "RecommendedUpgradeOverlay": {},
                                                                    "RecommendedUpgradePct": {},
                                                                    "DropTargetHighlight": {}
                                                                }
                                                            },
                                                            "HotkeyContainer": {
                                                                "Hotkey": { "HotkeyText": {} },
                                                                "HotkeyModifier": { "AltText": {} },
                                                                "HotkeyCtrlModifier": { "CtrlText": {} }
                                                            },
                                                            "AbilityCharges": { "AbilityChargesBorder": {} }
                                                        },
                                                        "QueryLevelGradient": {},
                                                        "AbilityLevelContainer": {}
                                                    },
                                                    "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                    "SpellCardButton": { "SpellsLabel": {} }
                                                },
                                                "inventory_slot_8": {
                                                    "ButtonAndLevel": {
                                                        "LevelUpBurstFXContainer": {},
                                                        "ButtonWithLevelUpTab": {
                                                            "LevelUpTab": {
                                                                "LevelUpButton": { "LevelUpIcon": {} },
                                                                "LearnModeButton": {}
                                                            },
                                                            "LevelUpLight": {},
                                                            "ButtonWell": {
                                                                "AutocastableBorder": {},
                                                                "AutoCastingContainer": {},
                                                                "ButtonSize": {
                                                                    "AbilityButton": {
                                                                        "AbilityImage": {},
                                                                        "ItemImage": {},
                                                                        "AbilityBevel": {},
                                                                        "ShineContainer": { "Shine": {} },
                                                                        "TopBarUltimateCooldown": {},
                                                                        "Cooldown": {
                                                                            "CooldownOverlay": {},
                                                                            "CooldownTimer": {}
                                                                        },
                                                                        "ActiveAbility": {},
                                                                        "InactiveOverlay": {},
                                                                        "ItemCharges": {},
                                                                        "ItemAltCharges": {}
                                                                    },
                                                                    "ActiveAbilityBorder": {},
                                                                    "PassiveAbilityBorder": {},
                                                                    "AutocastableAbilityBorder": {},
                                                                    "RubickArcanaContainer": {},
                                                                    "GoldCostBG": {},
                                                                    "GoldCost": {},
                                                                    "ManaCostBG": {},
                                                                    "ManaCost": {},
                                                                    "AgiValue": {
                                                                    },
                                                                    "StrValue": {},
                                                                    "CombineLockedOverlay": {},
                                                                    "SilencedOverlay": {},
                                                                    "AbilityStatusOverlay": {},
                                                                    "UpgradeOverlay": {},
                                                                    "RecommendedUpgradeOverlay": {},
                                                                    "RecommendedUpgradePct": {},
                                                                    "DropTargetHighlight": {}
                                                                }
                                                            },
                                                            "HotkeyContainer": {
                                                                "Hotkey": { "HotkeyText": {} },
                                                                "HotkeyModifier": { "AltText": {} },
                                                                "HotkeyCtrlModifier": { "CtrlText": {} }
                                                            },
                                                            "AbilityCharges": { "AbilityChargesBorder": {} }
                                                        },
                                                        "QueryLevelGradient": {},
                                                        "AbilityLevelContainer": {}
                                                    },
                                                    "InvokerSpellCardButton": { "SpellsLabel": {} },
                                                    "SpellCardButton": { "SpellsLabel": {} }
                                                }
                                            },
                                            "BackpackShadow": {}
                                        }
                                    }
                                },
                                "right_flare": {},
                                "inventory_composition_layer_container": {
                                    "inventory_tpscroll_container": {
                                        "inventory_tpscroll_slot": {
                                            "ButtonAndLevel": {
                                                "LevelUpBurstFXContainer": {},
                                                "ButtonWithLevelUpTab": {
                                                    "LevelUpTab": {
                                                        "LevelUpButton": { "LevelUpIcon": {} },
                                                        "LearnModeButton": {}
                                                    },
                                                    "LevelUpLight": {},
                                                    "ButtonWell": {
                                                        "AutocastableBorder": {},
                                                        "AutoCastingContainer": {},
                                                        "ButtonSize": {
                                                            "AbilityButton": {
                                                                "AbilityImage": {},
                                                                "ItemImage": {},
                                                                "AbilityBevel": {},
                                                                "ShineContainer": { "Shine": {} },
                                                                "TopBarUltimateCooldown": {},
                                                                "Cooldown": {
                                                                    "CooldownOverlay": {},
                                                                    "CooldownTimer": {}
                                                                },
                                                                "ActiveAbility": {},
                                                                "InactiveOverlay": {},
                                                                "ItemCharges": {},
                                                                "ItemAltCharges": {}
                                                            },
                                                            "ActiveAbilityBorder": {},
                                                            "PassiveAbilityBorder": {},
                                                            "AutocastableAbilityBorder": {},
                                                            "RubickArcanaContainer": {},
                                                            "GoldCostBG": {},
                                                            "GoldCost": {},
                                                            "ManaCostBG": {},
                                                            "ManaCost": {},
                                                            "AgiValue": {},
                                                            "StrValue": {},
                                                            "CombineLockedOverlay": {},
                                                            "SilencedOverlay": {},
                                                            "AbilityStatusOverlay": {},
                                                            "UpgradeOverlay": {},
                                                            "RecommendedUpgradeOverlay": {},
                                                            "RecommendedUpgradePct": {},
                                                            "DropTargetHighlight": {}
                                                        }
                                                    },
                                                    "HotkeyContainer": {
                                                        "Hotkey": { "HotkeyText": {} },
                                                        "HotkeyModifier": { "AltText": {} },
                                                        "HotkeyCtrlModifier":
                                                            { "CtrlText": {} }
                                                    },
                                                    "AbilityCharges": { "AbilityChargesBorder": {} }
                                                },
                                                "QueryLevelGradient": {},
                                                "AbilityLevelContainer": {}
                                            },
                                            "InvokerSpellCardButton": { "SpellsLabel": {} },
                                            "SpellCardButton": { "SpellsLabel": {} }
                                        },
                                        "inventory_tpscroll_HotkeyContainer": {
                                            "Hotkey": { "HotkeyText": {} },
                                            "HotkeyModifier": { "AltText": {} },
                                            "HotkeyCtrlModifier": { "CtrlText": {} }
                                        },
                                        "tpCharges": {}
                                    },
                                    "inventory_neutral_slot_container": {
                                        "inventory_neutral_slot": {
                                            "ButtonAndLevel": {
                                                "LevelUpBurstFXContainer": {},
                                                "ButtonWithLevelUpTab": {
                                                    "LevelUpTab": {
                                                        "LevelUpButton": { "LevelUpIcon": {} },
                                                        "LearnModeButton": {}
                                                    },
                                                    "LevelUpLight": {},
                                                    "ButtonWell": {
                                                        "AutocastableBorder": {},
                                                        "AutoCastingContainer": {},
                                                        "ButtonSize": {
                                                            "AbilityButton": {
                                                                "AbilityImage": {},
                                                                "ItemImage": {},
                                                                "AbilityBevel": {},
                                                                "ShineContainer": { "Shine": {} },
                                                                "TopBarUltimateCooldown": {},
                                                                "Cooldown": {
                                                                    "CooldownOverlay": {},
                                                                    "CooldownTimer": {}
                                                                },
                                                                "ActiveAbility": {},
                                                                "InactiveOverlay": {},
                                                                "ItemCharges": {},
                                                                "ItemAltCharges": {}
                                                            },
                                                            "ActiveAbilityBorder": {},
                                                            "PassiveAbilityBorder": {},
                                                            "AutocastableAbilityBorder": {},
                                                            "RubickArcanaContainer": {},
                                                            "GoldCostBG": {},
                                                            "GoldCost": {},
                                                            "ManaCostBG": {},
                                                            "ManaCost": {},
                                                            "AgiValue": {},
                                                            "StrValue": {},
                                                            "CombineLockedOverlay": {},
                                                            "SilencedOverlay": {},
                                                            "AbilityStatusOverlay": {},
                                                            "UpgradeOverlay": {},
                                                            "RecommendedUpgradeOverlay": {},
                                                            "RecommendedUpgradePct": {},
                                                            "DropTargetHighlight": {}
                                                        }
                                                    },
                                                    "HotkeyContainer": {
                                                        "Hotkey": { "HotkeyText": {} },
                                                        "HotkeyModifier": { "AltText": {} },
                                                        "HotkeyCtrlModifier": { "CtrlText": {} }
                                                    },
                                                    "AbilityCharges": { "AbilityChargesBorder": {} }
                                                },
                                                "QueryLevelGradient": {},
                                                "AbilityLevelContainer": {}
                                            },
                                            "InvokerSpellCardButton": { "SpellsLabel": {} },
                                            "SpellCardButton": { "SpellsLabel": {} }
                                        },
                                        "inventory_neutral_slot_HotkeyContainer": {
                                            "Hotkey": { "HotkeyText": {} },
                                            "HotkeyModifier": { "AltText": {} },
                                            "HotkeyCtrlModifier": { "CtrlText": {} }
                                        },
                                        "neutralCharges": {}
                                    }
                                }
                            }
                        },
                        "shop_launcher_block": {
                            "shop_launcher_bg": {},
                            "stash": {
                                "stash_bg": {
                                    "stash_upper": {},
                                    "stash_lower": {},
                                    "stash_active_lower": {},
                                    "title": {}
                                },
                                "grab_all_button": {},
                                "stash_row": {
                                    "inventory_slot_0": {
                                        "ButtonAndLevel": {
                                            "LevelUpBurstFXContainer": {},
                                            "ButtonWithLevelUpTab": {
                                                "LevelUpTab": {
                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                    "LearnModeButton": {}
                                                },
                                                "LevelUpLight": {},
                                                "ButtonWell": {
                                                    "AutocastableBorder": {},
                                                    "AutoCastingContainer": {},
                                                    "ButtonSize": {
                                                        "AbilityButton": {
                                                            "AbilityImage": {},
                                                            "ItemImage": {},
                                                            "AbilityBevel": {},
                                                            "ShineContainer": { "Shine": {} },
                                                            "TopBarUltimateCooldown": {},
                                                            "Cooldown": {
                                                                "CooldownOverlay": {},
                                                                "CooldownTimer": {}
                                                            },
                                                            "ActiveAbility": {},
                                                            "InactiveOverlay": {},
                                                            "ItemCharges":
                                                                {},
                                                            "ItemAltCharges": {}
                                                        },
                                                        "ActiveAbilityBorder": {},
                                                        "PassiveAbilityBorder": {},
                                                        "AutocastableAbilityBorder": {},
                                                        "RubickArcanaContainer": {},
                                                        "GoldCostBG": {},
                                                        "GoldCost": {},
                                                        "ManaCostBG": {},
                                                        "ManaCost": {},
                                                        "AgiValue": {},
                                                        "StrValue": {},
                                                        "CombineLockedOverlay": {},
                                                        "SilencedOverlay": {},
                                                        "AbilityStatusOverlay": {},
                                                        "UpgradeOverlay": {},
                                                        "RecommendedUpgradeOverlay": {},
                                                        "RecommendedUpgradePct": {},
                                                        "DropTargetHighlight": {}
                                                    }
                                                },
                                                "HotkeyContainer": {
                                                    "Hotkey": { "HotkeyText": {} },
                                                    "HotkeyModifier": { "AltText": {} },
                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                },
                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                            },
                                            "QueryLevelGradient": {},
                                            "AbilityLevelContainer": {}
                                        },
                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                        "SpellCardButton": { "SpellsLabel": {} }
                                    },
                                    "inventory_slot_1": {
                                        "ButtonAndLevel": {
                                            "LevelUpBurstFXContainer": {},
                                            "ButtonWithLevelUpTab": {
                                                "LevelUpTab": {
                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                    "LearnModeButton": {}
                                                },
                                                "LevelUpLight": {},
                                                "ButtonWell": {
                                                    "AutocastableBorder": {},
                                                    "AutoCastingContainer": {},
                                                    "ButtonSize": {
                                                        "AbilityButton": {
                                                            "AbilityImage": {},
                                                            "ItemImage": {},
                                                            "AbilityBevel": {},
                                                            "ShineContainer": { "Shine": {} },
                                                            "TopBarUltimateCooldown": {},
                                                            "Cooldown": {
                                                                "CooldownOverlay": {},
                                                                "CooldownTimer": {}
                                                            },
                                                            "ActiveAbility": {},
                                                            "InactiveOverlay": {},
                                                            "ItemCharges": {},
                                                            "ItemAltCharges": {}
                                                        },
                                                        "ActiveAbilityBorder": {},
                                                        "PassiveAbilityBorder": {},
                                                        "AutocastableAbilityBorder": {},
                                                        "RubickArcanaContainer": {},
                                                        "GoldCostBG": {},
                                                        "GoldCost": {},
                                                        "ManaCostBG": {},
                                                        "ManaCost": {},
                                                        "AgiValue": {},
                                                        "StrValue": {},
                                                        "CombineLockedOverlay": {},
                                                        "SilencedOverlay": {},
                                                        "AbilityStatusOverlay": {},
                                                        "UpgradeOverlay": {},
                                                        "RecommendedUpgradeOverlay": {},
                                                        "RecommendedUpgradePct": {},
                                                        "DropTargetHighlight": {}
                                                    }
                                                },
                                                "HotkeyContainer": {
                                                    "Hotkey": { "HotkeyText": {} },
                                                    "HotkeyModifier": { "AltText": {} },
                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                },
                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                            },
                                            "QueryLevelGradient": {},
                                            "AbilityLevelContainer": {}
                                        },
                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                        "SpellCardButton": { "SpellsLabel": {} }
                                    },
                                    "inventory_slot_2": {
                                        "ButtonAndLevel": {
                                            "LevelUpBurstFXContainer": {},
                                            "ButtonWithLevelUpTab": {
                                                "LevelUpTab": {
                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                    "LearnModeButton": {}
                                                },
                                                "LevelUpLight": {},
                                                "ButtonWell": {
                                                    "AutocastableBorder": {},
                                                    "AutoCastingContainer": {},
                                                    "ButtonSize": {
                                                        "AbilityButton": {
                                                            "AbilityImage": {},
                                                            "ItemImage": {},
                                                            "AbilityBevel": {},
                                                            "ShineContainer": { "Shine": {} },
                                                            "TopBarUltimateCooldown": {},
                                                            "Cooldown": {
                                                                "CooldownOverlay": {},
                                                                "CooldownTimer": {}
                                                            },
                                                            "ActiveAbility": {},
                                                            "InactiveOverlay": {},
                                                            "ItemCharges": {},
                                                            "ItemAltCharges": {}
                                                        },
                                                        "ActiveAbilityBorder": {},
                                                        "PassiveAbilityBorder": {},
                                                        "AutocastableAbilityBorder": {},
                                                        "RubickArcanaContainer": {},
                                                        "GoldCostBG": {},
                                                        "GoldCost": {},
                                                        "ManaCostBG": {},
                                                        "ManaCost": {},
                                                        "AgiValue": {},
                                                        "StrValue": {},
                                                        "CombineLockedOverlay": {},
                                                        "SilencedOverlay": {},
                                                        "AbilityStatusOverlay": {},
                                                        "UpgradeOverlay": {},
                                                        "RecommendedUpgradeOverlay": {},
                                                        "RecommendedUpgradePct": {},
                                                        "DropTargetHighlight": {}
                                                    }
                                                },
                                                "HotkeyContainer": {
                                                    "Hotkey": {
                                                        "HotkeyText": {}
                                                    },
                                                    "HotkeyModifier": { "AltText": {} },
                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                },
                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                            },
                                            "QueryLevelGradient": {},
                                            "AbilityLevelContainer": {}
                                        },
                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                        "SpellCardButton": { "SpellsLabel": {} }
                                    },
                                    "inventory_slot_3": {
                                        "ButtonAndLevel": {
                                            "LevelUpBurstFXContainer": {},
                                            "ButtonWithLevelUpTab": {
                                                "LevelUpTab": {
                                                    "LevelUpButton": {
                                                        "LevelUpIcon": {}
                                                    },
                                                    "LearnModeButton": {}
                                                },
                                                "LevelUpLight": {},
                                                "ButtonWell": {
                                                    "AutocastableBorder": {},
                                                    "AutoCastingContainer": {},
                                                    "ButtonSize": {
                                                        "AbilityButton": {
                                                            "AbilityImage": {},
                                                            "ItemImage": {},
                                                            "AbilityBevel": {},
                                                            "ShineContainer": { "Shine": {} },
                                                            "TopBarUltimateCooldown": {},
                                                            "Cooldown": {
                                                                "CooldownOverlay": {},
                                                                "CooldownTimer": {}
                                                            },
                                                            "ActiveAbility": {},
                                                            "InactiveOverlay": {},
                                                            "ItemCharges": {},
                                                            "ItemAltCharges": {}
                                                        },
                                                        "ActiveAbilityBorder": {},
                                                        "PassiveAbilityBorder": {},
                                                        "AutocastableAbilityBorder": {},
                                                        "RubickArcanaContainer": {},
                                                        "GoldCostBG": {},
                                                        "GoldCost": {},
                                                        "ManaCostBG": {},
                                                        "ManaCost": {},
                                                        "AgiValue": {},
                                                        "StrValue": {},
                                                        "CombineLockedOverlay": {},
                                                        "SilencedOverlay": {},
                                                        "AbilityStatusOverlay": {},
                                                        "UpgradeOverlay": {},
                                                        "RecommendedUpgradeOverlay": {},
                                                        "RecommendedUpgradePct": {},
                                                        "DropTargetHighlight": {}
                                                    }
                                                },
                                                "HotkeyContainer": {
                                                    "Hotkey": {
                                                        "HotkeyText": {
                                                        }
                                                    },
                                                    "HotkeyModifier": { "AltText": {} },
                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                },
                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                            },
                                            "QueryLevelGradient": {},
                                            "AbilityLevelContainer": {}
                                        },
                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                        "SpellCardButton": { "SpellsLabel": {} }
                                    },
                                    "inventory_slot_4": {
                                        "ButtonAndLevel": {
                                            "LevelUpBurstFXContainer": {},
                                            "ButtonWithLevelUpTab": {
                                                "LevelUpTab": {
                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                    "LearnModeButton": {}
                                                },
                                                "LevelUpLight": {},
                                                "ButtonWell": {
                                                    "AutocastableBorder": {},
                                                    "AutoCastingContainer": {},
                                                    "ButtonSize": {
                                                        "AbilityButton": {
                                                            "AbilityImage": {},
                                                            "ItemImage": {},
                                                            "AbilityBevel": {},
                                                            "ShineContainer": { "Shine": {} },
                                                            "TopBarUltimateCooldown": {},
                                                            "Cooldown": {
                                                                "CooldownOverlay": {},
                                                                "CooldownTimer": {}
                                                            },
                                                            "ActiveAbility": {},
                                                            "InactiveOverlay": {},
                                                            "ItemCharges": {},
                                                            "ItemAltCharges": {}
                                                        },
                                                        "ActiveAbilityBorder": {},
                                                        "PassiveAbilityBorder": {},
                                                        "AutocastableAbilityBorder": {},
                                                        "RubickArcanaContainer": {},
                                                        "GoldCostBG": {},
                                                        "GoldCost": {},
                                                        "ManaCostBG": {},
                                                        "ManaCost": {},
                                                        "AgiValue": {},
                                                        "StrValue": {},
                                                        "CombineLockedOverlay": {},
                                                        "SilencedOverlay": {},
                                                        "AbilityStatusOverlay": {},
                                                        "UpgradeOverlay": {},
                                                        "RecommendedUpgradeOverlay": {},
                                                        "RecommendedUpgradePct": {},
                                                        "DropTargetHighlight": {}
                                                    }
                                                },
                                                "HotkeyContainer": {
                                                    "Hotkey": { "HotkeyText": {} },
                                                    "HotkeyModifier": { "AltText": {} },
                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                },
                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                            },
                                            "QueryLevelGradient": {},
                                            "AbilityLevelContainer": {}
                                        },
                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                        "SpellCardButton": { "SpellsLabel": {} }
                                    },
                                    "inventory_slot_5": {
                                        "ButtonAndLevel": {
                                            "LevelUpBurstFXContainer": {},
                                            "ButtonWithLevelUpTab": {
                                                "LevelUpTab": {
                                                    "LevelUpButton": { "LevelUpIcon": {} },
                                                    "LearnModeButton": {}
                                                }
                                                , "LevelUpLight": {},
                                                "ButtonWell": {
                                                    "AutocastableBorder": {},
                                                    "AutoCastingContainer": {},
                                                    "ButtonSize": {
                                                        "AbilityButton": {
                                                            "AbilityImage": {},
                                                            "ItemImage": {},
                                                            "AbilityBevel": {},
                                                            "ShineContainer": { "Shine": {} },
                                                            "TopBarUltimateCooldown": {},
                                                            "Cooldown": {
                                                                "CooldownOverlay": {},
                                                                "CooldownTimer": {}
                                                            },
                                                            "ActiveAbility": {},
                                                            "InactiveOverlay": {},
                                                            "ItemCharges": {},
                                                            "ItemAltCharges": {}
                                                        },
                                                        "ActiveAbilityBorder": {},
                                                        "PassiveAbilityBorder": {},
                                                        "AutocastableAbilityBorder": {},
                                                        "RubickArcanaContainer": {},
                                                        "GoldCostBG": {},
                                                        "GoldCost": {},
                                                        "ManaCostBG": {},
                                                        "ManaCost": {},
                                                        "AgiValue": {},
                                                        "StrValue": {},
                                                        "CombineLockedOverlay": {},
                                                        "SilencedOverlay": {},
                                                        "AbilityStatusOverlay": {},
                                                        "UpgradeOverlay": {},
                                                        "RecommendedUpgradeOverlay": {},
                                                        "RecommendedUpgradePct": {},
                                                        "DropTargetHighlight": {}
                                                    }
                                                },
                                                "HotkeyContainer": {
                                                    "Hotkey": { "HotkeyText": {} },
                                                    "HotkeyModifier": {
                                                        "AltText": {}
                                                    },
                                                    "HotkeyCtrlModifier": { "CtrlText": {} }
                                                },
                                                "AbilityCharges": { "AbilityChargesBorder": {} }
                                            },
                                            "QueryLevelGradient": {},
                                            "AbilityLevelContainer": {}
                                        },
                                        "InvokerSpellCardButton": { "SpellsLabel": {} },
                                        "SpellCardButton": { "SpellsLabel": {} }
                                    }
                                }
                            },
                            "quickbuy": {
                                "QuickBuyRows": {
                                    "Hint": {},
                                    "Row0": {
                                        "QuickBuySlot0": {
                                            "ItemImage": {},
                                            "CanPurchaseOverlay": {},
                                            "PopularOverlay": { "PopularIcon": {} },
                                            "SuggestedNeutralOverlay": {
                                                "SuggestedNeutralIcon": {}
                                            },
                                            "PlayerSuggestedOverlay": {},
                                            "OwnedTick": {},
                                            "SecretShop": {},
                                            "StockAmount": {},
                                            "OutOfStockOverlay": {},
                                            "AvailableAtOtherShopOverlay": {},
                                            "AvailableAtOtherShopNeedGoldOverlay": {},
                                            "SuggestionPct": {},
                                            "SequenceArrow": {},
                                            "DotaSuggest": {}
                                        },
                                        "QuickBuySlot1": {
                                            "ItemImage": {},
                                            "CanPurchaseOverlay": {},
                                            "PopularOverlay": { "PopularIcon": {} },
                                            "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                            "PlayerSuggestedOverlay": {},
                                            "OwnedTick": {},
                                            "SecretShop": {},
                                            "StockAmount": {},
                                            "OutOfStockOverlay": {},
                                            "AvailableAtOtherShopOverlay": {},
                                            "AvailableAtOtherShopNeedGoldOverlay": {},
                                            "SuggestionPct": {},
                                            "SequenceArrow": {},
                                            "DotaSuggest": {}
                                        },
                                        "QuickBuySlot2": {
                                            "ItemImage": {},
                                            "CanPurchaseOverlay": {},
                                            "PopularOverlay": { "PopularIcon": {} },
                                            "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                            "PlayerSuggestedOverlay": {},
                                            "OwnedTick": {},
                                            "SecretShop": {},
                                            "StockAmount": {},
                                            "OutOfStockOverlay": {},
                                            "AvailableAtOtherShopOverlay": {},
                                            "AvailableAtOtherShopNeedGoldOverlay": {},
                                            "SuggestionPct": {},
                                            "SequenceArrow": {},
                                            "DotaSuggest": {}
                                        },
                                        "QuickBuySlot3": {
                                            "ItemImage": {},
                                            "CanPurchaseOverlay": {},
                                            "PopularOverlay": { "PopularIcon": {} },
                                            "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                            "PlayerSuggestedOverlay": {},
                                            "OwnedTick": {},
                                            "SecretShop":
                                                {},
                                            "StockAmount": {},
                                            "OutOfStockOverlay": {},
                                            "AvailableAtOtherShopOverlay": {},
                                            "AvailableAtOtherShopNeedGoldOverlay": {},
                                            "SuggestionPct": {},
                                            "SequenceArrow": {},
                                            "DotaSuggest": {}
                                        }
                                    },
                                    "Row1": {
                                        "QuickBuySlot4": {
                                            "ItemImage": {},
                                            "CanPurchaseOverlay": {},
                                            "PopularOverlay": { "PopularIcon": {} },
                                            "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                            "PlayerSuggestedOverlay": {},
                                            "OwnedTick": {},
                                            "SecretShop": {},
                                            "StockAmount"
                                                : {},
                                            "OutOfStockOverlay": {},
                                            "AvailableAtOtherShopOverlay": {},
                                            "AvailableAtOtherShopNeedGoldOverlay": {},
                                            "SuggestionPct": {},
                                            "SequenceArrow": {},
                                            "DotaSuggest": {}
                                        },
                                        "QuickBuySlot5": {
                                            "ItemImage": {},
                                            "CanPurchaseOverlay": {},
                                            "PopularOverlay": { "PopularIcon": {} },
                                            "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                            "PlayerSuggestedOverlay": {},
                                            "OwnedTick": {},
                                            "SecretShop": {},
                                            "StockAmount": {},
                                            "OutOfStockOverlay": {
                                            },
                                            "AvailableAtOtherShopOverlay": {},
                                            "AvailableAtOtherShopNeedGoldOverlay": {},
                                            "SuggestionPct": {},
                                            "SequenceArrow": {},
                                            "DotaSuggest": {}
                                        },
                                        "QuickBuySlot6": {
                                            "ItemImage": {},
                                            "CanPurchaseOverlay": {},
                                            "PopularOverlay": { "PopularIcon": {} },
                                            "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                            "PlayerSuggestedOverlay": {},
                                            "OwnedTick": {},
                                            "SecretShop": {},
                                            "StockAmount": {},
                                            "OutOfStockOverlay": {},
                                            "AvailableAtOtherShopOverlay": {},
                                            "AvailableAtOtherShopNeedGoldOverlay": {},
                                            "SuggestionPct": {},
                                            "SequenceArrow": {},
                                            "DotaSuggest": {}
                                        },
                                        "QuickBuySlot7": {
                                            "ItemImage": {},
                                            "CanPurchaseOverlay": {},
                                            "PopularOverlay": { "PopularIcon": {} },
                                            "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                            "PlayerSuggestedOverlay": {},
                                            "OwnedTick": {},
                                            "SecretShop": {},
                                            "StockAmount": {},
                                            "OutOfStockOverlay": {},
                                            "AvailableAtOtherShopOverlay": {},
                                            "AvailableAtOtherShopNeedGoldOverlay": {},
                                            "SuggestionPct": {},
                                            "SequenceArrow": {},
                                            "DotaSuggest": {}
                                        }
                                    },
                                    "StickyItemSlotContainer": {
                                        "QuickBuySlot8": {
                                            "ItemImage": {},
                                            "CanPurchaseOverlay": {},
                                            "PopularOverlay": { "PopularIcon": {} },
                                            "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                            "PlayerSuggestedOverlay": {},
                                            "OwnedTick": {},
                                            "SecretShop": {},
                                            "StockAmount": {},
                                            "OutOfStockOverlay": {},
                                            "AvailableAtOtherShopOverlay": {},
                                            "AvailableAtOtherShopNeedGoldOverlay": {},
                                            "SuggestionPct": {},
                                            "SequenceArrow": {},
                                            "DotaSuggest": {}
                                        }
                                    },
                                    "SuggestItems": {
                                        "ItemImage": {},
                                        "CanPurchaseOverlay": {},
                                        "PopularOverlay": { "PopularIcon": {} },
                                        "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                        "PlayerSuggestedOverlay": {},
                                        "OwnedTick": {},
                                        "SecretShop": {},
                                        "StockAmount": {},
                                        "OutOfStockOverlay": {},
                                        "AvailableAtOtherShopOverlay": {},
                                        "AvailableAtOtherShopNeedGoldOverlay"
                                            : {},
                                        "SuggestionPct": {},
                                        "SequenceArrow": {},
                                        "DotaSuggest": {}
                                    },
                                    "ClearQuickBuy": {}
                                },
                                "ShopCourierControls": {
                                    "ShopButton": {
                                        "GoldLabel": {},
                                        "GoldIcon": {},
                                        "BuybackHeader": {
                                            "BuybackLabel": {},
                                            "NoBuybackLabel": {},
                                            "BuybackDelta": {
                                                "Plus": {},
                                                "NoPlus": {},
                                                "BuybackGoldSurplus": {},
                                                "BuybackCooldown": {}
                                            }
                                        }
                                    },
                                    "courier": {
                                        "CourierControls": {
                                            "SelectCourierButton": {},
                                            "ItemsOnCourierBackground": { "ItemsOnCourier": {} },
                                            "CourierBurstButton": { "BurstCooldownLabel": {} },
                                            "CourierShieldButton": { "ShieldCooldownLabel": {} },
                                            "DeliverItemsButton": {
                                                "Spinner": {},
                                                "HeroImage": {},
                                                "OtherHeroDeliver": {}
                                            }
                                        },
                                        "DeadCourierPanel": {
                                            "CourierDeadIcon": {},
                                            "CourierRespawnTimer": {}
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "NetGraph": {
                        "LeftColumn": {},
                        "RightColumn_1": {
                            "NetGraph_FPS": {},
                            "NetGraph_LOSS_IN": {}
                        },
                        "RightColumn_2": {
                            "NetGraph_PING": {},
                            "NetGraph_LOSS_OUT": {}
                        }
                    },
                    "NetDisconnect": {
                        "TimeoutCountLabel": {},
                        "DisconnectIconState": {
                            "DisconnectIconLeft": {},
                            "DisconnectIconX": {},
                            "DisconnectIconRight": {}
                        },
                        "TimeoutCount": {}
                    },
                    "stackable_side_panels": {
                        "quickstats": { "QuickStatsContainer": {} },
                        "PlusStatus": {
                            "QuestStatusContainer": {
                                "QuestHeader": {
                                    "QuestExpandButton1": {},
                                    "PrimaryProgress": {},
                                    "ChallengeStars": {}
                                },
                                "ChallengeDesc": {}
                            }
                        },
                        "GuildStatus": { "ChallengeContainer": {} },
                        "HeroDisplay": {
                            "HeroDisplayRowContainer": {}
                        }
                    },
                    "mutations": {
                        "Name0": {},
                        "Name1": {},
                        "Name2": {},
                        "Name3": {},
                        "Name4": {},
                        "Name5": {},
                        "Name6": {},
                        "Name7": {},
                        "Name8": {},
                        "Name9": {}
                    },
                    "Wagering": {},
                    "MenuButtons": {
                        "ButtonBar": {
                            "DashboardButton": {},
                            "SettingsButton": {},
                            "ToggleScoreboardButton": {},
                            "AntiAddictionWarning": {}
                        },
                        "SpectatorButtonBar": {
                            "SpectatorItemsButton": {},
                            "GoldGraphButton": {},
                            "XPGraphButton": {},
                            "WinGraphButton": {},
                            "SpectatorOptionsButton": {},
                            "DisconnectButton": {}
                        }
                    },
                    "QueryUnit": {
                        "QueryContainer": {},
                        "hero_statue": {
                            "StatueBackground": {
                                "TopBar": {},
                                "TopLeftCorner": {},
                                "TopRightCorner": {},
                                "BottomLeftCorner": {},
                                "BottomRightCorner": {}
                            },
                            "Tournament": {
                                "TournamentLogos": {
                                    "TeamLogo0": {},
                                    "TournamentLogo": {},
                                    "TeamLogo1": {}
                                },
                                "TournamentEvent": {},
                                "TournamentEventDetails": {}
                            },
                            "Normal": {
                                "EffigyTypeHeader": {},
                                "NoInscription": {},
                                "Inscription": {},
                                "CreatedByHeader": {},
                                "CreatedBy": {}
                            },
                            "LikeButton": {},
                            "LikesLabel": {}
                        },
                        "international_hall_of_fame": {
                            "TooltipBackground": {
                                "TopBar": {},
                                "TopLeftCorner": {},
                                "TopRightCorner": {},
                                "BottomLeftCorner": {},
                                "BottomRightCorner": {},
                                "TeamLogo": {},
                                "TooltipCountry": { "TooltipFlag": {} },
                                "TI1Winners": {},
                                "TI2Winners": {},
                                "TI3Winners": {},
                                "TI4Winners": {},
                                "TI5Winners": {},
                                "TI6Winners": {},
                                "TI7Winners": {},
                                "TI8Winners": {},
                                "TI9Winners": {}
                            },
                            "StatueBackground": {
                                "TopBar": {},
                                "TopLeftCorner": {},
                                "TopRightCorner": {},
                                "BottomLeftCorner": {},
                                "BottomRightCorner": {},
                                "BottomCenter": {},
                                "DarkStrip": {},
                                "LogoContainer": {
                                    "InternationalLogo": {},
                                    "HeadTitle": {
                                        "Year": {},
                                        "Title": {}
                                    }
                                },
                                "3DLogo": {},
                                "CurrentChampionName": {},
                                "Country": {
                                    "CurrentChampionFlag": {},
                                    "CurrentChampionCountry": {}
                                },
                                "PreviousChampions": {}
                            }
                        },
                        "pa_gravestone": {
                            "title": {},
                            "hero": {},
                            "player": {},
                            "damageRow": {
                                "coup": {},
                                "colon": {},
                                "critDamage": {},
                                "damage": {}
                            },
                            "contract": {}
                        }
                    },
                    "scoreboard": {
                        "Background": {
                            "RadiantHeader": {
                                "RadiantScoreLabel": {},
                                "RadiantTeamLabel": {},
                                "TalentTreeLabel": {},
                                "LvlLabel": {},
                                "GoldLabel": {},
                                "KillsLabel": {},
                                "DeathsLabel": {},
                                "AssistsLabel": {},
                                "UltLabel": {},
                                "MuteLabel": {},
                                "WKArcanaLabel": {},
                                "TippingLabel": {},
                                "BountyLabel": {},
                                "AllStarLabel": {}
                            },
                            "RadiantTeamContainer": {},
                            "DireHeader": {
                                "DireScoreLabel": {},
                                "DireTeamLabel": {}
                            },
                            "DireTeamContainer": {},
                            "NestedMenuButtons": {
                                "CoachMuteContainer": {},
                                "NestContainer": {
                                    "CoachesButton": {},
                                    "CombatLogButton": {},
                                    "SharedContentButton": {},
                                    "SharedUnitsButton": {},
                                    "ShowItemsButton": {}
                                }
                            }
                        },
                        "TeamInventories": {
                            "RadiantTeamInventory": {
                                "TeamInventoryBackground": {},
                                "RadiantTeamInventoryHeaders": {},
                                "RadiantTeamInventoryContainer": {}
                            },
                            "DireTeamInventory": {
                                "TeamInventoryBackground": {},
                                "DireTeamInventoryHeaders": {},
                                "DireTeamInventoryContainer": {}
                            }
                        },
                        "SharedUnitControl": {
                            "SharedUnitHeaders": {
                                "UnitLabel": {},
                                "HeroLabel": {},
                                "DisableHelpLabel": {}
                            },
                            "PlayersContainer": {}
                        },
                        "SharedContent": {
                            "SharedContentHeader": {
                                "SharedContentTitle": {},
                                "SharedContentCloseButton": {}
                            },
                            "SharedContentContents": {
                                "SharedContentAnnouncers": {
                                    "AnnouncersHeader": {},
                                    "AnnouncersItemContainer": {}
                                },
                                "SharedContentMegaKillAnnouncers": {
                                    "MegaKillAnnouncersHeader": {},
                                    "MegaKillAnnouncersItemContainer": {}
                                },
                                "SharedContentHUDSkins": {
                                    "HUDSkinsHeader": {},
                                    "HUDSkinsItemContainer": {}
                                }
                            }
                        },
                        "ScoreboardCoaches": {
                            "RadiantCoaches": { "RadiantCoachesCarousel": {} },
                            "DireCoaches": { "DireCoachesCarousel": {} }
                        }
                    },
                    "GG": {
                        "Header": {},
                        "LoseCounter": {},
                        "Time": {},
                        "Cancel": {}
                    }
                },
                "predictions_button": {
                    "PredictionsButton": { "PredictionsLabel": {} },
                    "PredictionsCloseButton": {}
                },
                "OrdersContainer": {
                    "ChannelBar": {
                        "CustomChannelbarContainer": {},
                        "ChannelbarContainer": {
                            "ChannelBarChannel": {
                                "ChannelProgressContainer": { "ChannelBarProgress": {} },
                                "ChannelBarLabel": {}
                            },
                            "IconBorder": {},
                            "BuffIcon": {}
                        },
                        "ChannelBarOverlay": {}
                    },
                    "QueuedOrders": {}
                },
                "spectator_game_stats": {
                    "Header": {
                        "StatsDropDown": {
                            "StatCategory_None": {}
                        },
                        "StatSortingButton": {}
                    },
                    "PlayerRows": {}
                },
                "spectator_options": {
                    "Contents": {
                        "SpectatorCount": {},
                        "LiveSpectatorLabel": {},
                        "CameraDropDown": { "SimpleCamera_0": {} },
                        "AudioDropDown": { "BroadcasterNone": {} },
                        "FogDropDown": { "FogBoth": {} },
                        "CopyToClipboardButton": {},
                        "SkipControls": {
                            "SkipBackward": {},
                            "SkipForward": {}
                        },
                        "JumpAheadButton": {},
                        "SpectatorChatToggleButton": {}
                    }
                },
                "SpectatorGraph": {
                    "GraphContainer": {
                        "DetailsBasicGraphsTopTeam": {},
                        "DetailsBasicGraphsBottomTeam": {},
                        "DetailsBasicGraphsTopY1": {},
                        "DetailsBasicGraphsTopY2": {},
                        "DetailsBasicGraphsTopY3": {},
                        "DetailsBasicGraphsBottomY1": {},
                        "DetailsBasicGraphsBottomY2": {},
                        "DetailsBasicGraphsBottomY3": {},
                        "GraphCanvas": {}
                    },
                    "EventsContainer": {},
                    "GraphTimeline": {},
                    "TeamTotalsTitle": {},
                    "TeamTotals": {},
                    "CloseButton": {}
                },
                "CoachingControls": {
                    "ToggleCoachingPanelButton": {}
                },
                "spectator_quickstats": { "QuickStatsContainer": {} },
                "QuestPicker": {
                    "QuestPickerContainer": {
                        "QuestPickerPanel": {
                            "QuestPickerCurrentQuest": {
                                "QuestPickerHeader": { "QuestLinePicker": { "QuestPickerQuestLineName": {} } },
                                "BottomQuestBlock": {
                                    "QuestInfo": {
                                        "CurrentLabel": {},
                                        "CurrentQuestNumGames": {},
                                        "CurrentQuestDesc": {}
                                    }
                                },
                                "QuestChallengeProgress": {
                                    "QuestChallengeProgress_Left": {},
                                    "QuestChallengeProgress_Right": {}
                                },
                                "QuestPickerQuestMap": { "QuestLine": {} }
                            },
                            "QuestPickerBottom": {
                                "SideQuestContainer": {
                                    "DailyHeroQuestStatus": { "HeroMovie": {} },
                                    "WeeklyQuestStatus1": {
                                        "ChallengeProgress": {
                                            "ChallengeProgress_Left": {},
                                            "ChallengeProgress_Right": {}
                                        }
                                    },
                                    "WeeklyQuestStatus2": {
                                        "ChallengeProgress": {
                                            "ChallengeProgress_Left": {},
                                            "ChallengeProgress_Right": {}
                                        }
                                    }
                                },
                                "ActiveContainer": {}
                            },
                            "QuestLineOptions": {}
                        },
                        "QuestSlideThumb": {}
                    }
                },
                "PreGame": {
                    "PreGameBackgroundImage": {},
                    "PregameBGStatic": {},
                    "PregameBG": {},
                    "NemesticeBG": {},
                    "ConnectionFailed": { "ConnectionErrorIcon": {} },
                    "MainContents": {
                        "ScreenContainer": {
                            "HeroPickScreen": {
                                "TitlesContainer": { "HeroSelectionText": {} },
                                "HeroPickScreenContents": {
                                    "MainHeroPickScreenContents": {
                                        "HeroPickLeftColumn": {
                                            "HeroGrid": {
                                                "MainContents": {
                                                    "GridCategories": {},
                                                    "GridOverlay": {
                                                        "LoadingOverlay": {},
                                                        "FailedToLoadOverlay": {},
                                                        "PlusRestrictedOverlay": {},
                                                        "RolesOverlay": { "RolesOverlayRankTiers": {} },
                                                        "MissingHeroesOverlay": {
                                                            "MissingHeroesList": {},
                                                            "MissingHeroesButton": {}
                                                        },
                                                        "QuickSearch": {}
                                                    }
                                                },
                                                "Footer": {
                                                    "ViewModeControls": {
                                                        "ArrangeContainer": {
                                                            "ArrangeButton": {
                                                                "ArrangePlusIcon": {},
                                                                "ArrangeButtonIcon": {}
                                                            },
                                                            "EditCurrentConfigButton": {}
                                                        },
                                                        "Filters": {
                                                            "AttackTypeCategory": {},
                                                            "PlusCategory": {},
                                                            "BattlePassCategory": {},
                                                            "GuildCategory": { "GuildNotificationsPip": {} }
                                                        }
                                                    },
                                                    "EditModeControls": {
                                                        "EditingConfigName": {},
                                                        "ConfirmEditButton": {},
                                                        "DiscardEditButton": {},
                                                        "AddCategoryButton": {},
                                                        "DeleteButton": {}
                                                    }
                                                }
                                            }
                                        },
                                        "HeroPickRightColumn": {
                                            "CaptainsModePicksBans": {
                                                "Titles": {
                                                    "RadiantTitle": {},
                                                    "DireTitle": {}
                                                },
                                                "Phases": {}
                                            },
                                            "AlreadyBanned": {
                                                "BanOuter": {},
                                                "BanHeroName": {},
                                                "BanBar": {}
                                            },
                                            "BanButton": {
                                                "BanTitle": {},
                                                "BanOuter": {},
                                                "BanHeroName": {},
                                                "BanBar": {}
                                            },
                                            "HeroPickControls": {
                                                "LockInButton": {},
                                                "BanInfo": {
                                                    "BanInfoTitle": {},
                                                    "BanInfoHeroName": {}
                                                },
                                                "RandomButton": {},
                                                "RepickButton": {},
                                                "ReRandomButton": {},
                                                "CaptainsModeBecomeCaptainButton": {},
                                                "CaptainsModeSelectButton": { "CaptainsModeSelectButtonHeroIcon": {} },
                                                "CaptainsModeBanButton": {
                                                    "CaptainsModeBanButtonHeroIcon": {},
                                                    "BanButtonGradient": {}
                                                },
                                                "CaptainsModeSuggest": {
                                                    "CaptainsModeSuggestPickButton": { "CaptainsModeSuggestHeroIcon": {} },
                                                    "CaptainsModeSuggestBanButton": { "CaptainsModeSuggestBanHeroIcon": {} }
                                                }
                                            },
                                            "HitBlocker": {}
                                        }
                                    },
                                    "CaptainsModeHeroPickScreenContents": {
                                        "CaptainsModeHeroPickModels": {
                                            "CaptainsModeHeroPickModel1": {},
                                            "CaptainsModeHeroPickModel2": {},
                                            "CaptainsModeHeroPickModel3": {},
                                            "CaptainsModeHeroPickModel4": {},
                                            "CaptainsModeHeroPickModel5": {}
                                        },
                                        "CaptainsModeHeroPickOptions": {
                                            "CaptainsModeHeroPickOption1": {
                                                "CaptainsModeHeroPickButton": {},
                                                "CaptainsModeHeroPickedDetails": {
                                                    "CaptainsModeHeroPickAvatarImage": {
                                                        "BorderImage": {},
                                                        "AvatarImage": {}
                                                    }
                                                },
                                                "CaptainsModeHeroPickPending": { "CaptainsModeHeroPickPendingContents": {} }
                                            },
                                            "CaptainsModeHeroPickOption2": {
                                                "CaptainsModeHeroPickButton": {},
                                                "CaptainsModeHeroPickedDetails": {
                                                    "CaptainsModeHeroPickAvatarImage": {
                                                        "BorderImage": {},
                                                        "AvatarImage": {}
                                                    }
                                                },
                                                "CaptainsModeHeroPickPending": { "CaptainsModeHeroPickPendingContents": {} }
                                            },
                                            "CaptainsModeHeroPickOption3": {
                                                "CaptainsModeHeroPickButton": {},
                                                "CaptainsModeHeroPickedDetails": {
                                                    "CaptainsModeHeroPickAvatarImage": {
                                                        "BorderImage": {},
                                                        "AvatarImage": {}
                                                    }
                                                },
                                                "CaptainsModeHeroPickPending": { "CaptainsModeHeroPickPendingContents": {} }
                                            },
                                            "CaptainsModeHeroPickOption4": {
                                                "CaptainsModeHeroPickButton": {},
                                                "CaptainsModeHeroPickedDetails": {
                                                    "CaptainsModeHeroPickAvatarImage": {
                                                        "BorderImage": {},
                                                        "AvatarImage": {}
                                                    }
                                                },
                                                "CaptainsModeHeroPickPending": { "CaptainsModeHeroPickPendingContents": {} }
                                            },
                                            "CaptainsModeHeroPickOption5": {
                                                "CaptainsModeHeroPickButton": {},
                                                "CaptainsModeHeroPickedDetails": {
                                                    "CaptainsModeHeroPickAvatarImage": {
                                                        "BorderImage": {},
                                                        "AvatarImage": {}
                                                    }
                                                },
                                                "CaptainsModeHeroPickPending": {
                                                    "CaptainsModeHeroPickPendingContents": {}
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "StrategyScreen": {
                                "SelectedHeroDetails": {
                                    "EnterBattle": {},
                                    "SelectedHeroName": {},
                                    "CoachName": {},
                                    "SelectedHeroAbilities": {}
                                },
                                "StrategyHeroRelicsThumbnail": {
                                    "Rare0": {},
                                    "Rare1": {},
                                    "Rare2": {},
                                    "Rare3": {},
                                    "Common0": {},
                                    "Common1": {},
                                    "Common2": {},
                                    "Common3": {},
                                    "Common4": {},
                                    "Common5": {},
                                    "Common6": {},
                                    "Common7": {},
                                    "Common8": {},
                                    "Common9": {}
                                },
                                "StrategyHeroBadge": {},
                                "HeroModel": {
                                    "PreviewRaysBackground": {},
                                    "EconSetPreview1": {
                                        "Preview3DItems": {},
                                        "Preview2DItems": {},
                                        "PreviewLoadingScreen": {},
                                        "PreviewSounds": { "PreviewSoundList": {} },
                                        "PreviewMusic": {}
                                    },
                                    "EconSetPreview2": {
                                        "Preview3DItems": {},
                                        "Preview2DItems": {},
                                        "PreviewLoadingScreen": {},
                                        "PreviewSounds": { "PreviewSoundList": {} },
                                        "PreviewMusic": {}
                                    },
                                    "PreviewRaysForeground": {}
                                },
                                "HeroModelOverlay": {},
                                "StrategyHeroRelicsThumbnailTooltips": {
                                    "Rare0": {},
                                    "Rare1": {},
                                    "Rare2": {},
                                    "Rare3": {},
                                    "Common0": {},
                                    "Common1": {},
                                    "Common2": {},
                                    "Common3": {},
                                    "Common4": {},
                                    "Common5": {},
                                    "Common6": {},
                                    "Common7": {},
                                    "Common8": {},
                                    "Common9": {}
                                },
                                "HeroRelicsContainer": {},
                                "SelectedHeroAbilitiesHitTargets": {},
                                "EnterGameRepickButton": {},
                                "EnterGameReRandomButton": {},
                                "SkipIntoGame": {},
                                "RightContainer": {
                                    "RightContainerMain": {
                                        "HeroLockedNav": {
                                            "StrategyTabButton": {},
                                            "LoadoutTabButton": {},
                                            "GuidesTabButton": {}
                                        },
                                        "StrategyTab": {
                                            "StrategyTabTopRow": {
                                                "StrategyMap": {
                                                    "StrategyMapContents": {
                                                        "StrategyMinimap": {
                                                            "RadiantBuildings": {},
                                                            "DireBuildings": {},
                                                            "LaneGlows": {
                                                                "BottomRadiantGlow": {},
                                                                "TopRadiantGlow": {},
                                                                "JungleRadiantGlow": {},
                                                                "BottomDireGlow": {},
                                                                "TopDireGlow": {},
                                                                "JungleDireGlow": {},
                                                                "MidRadiantGlow": {},
                                                                "MidDireGlow": {}
                                                            },
                                                            "LaneHitBoxes": {
                                                                "BottomRadiant": {},
                                                                "TopRadiant": {},
                                                                "TopRadiant2": {},
                                                                "JungleRadiant": {},
                                                                "BottomDire": {},
                                                                "BottomDire2": {},
                                                                "TopDire": {},
                                                                "JungleDire": {},
                                                                "JungleDire2": {},
                                                                "MidRadiant": {},
                                                                "MidDire": {}
                                                            },
                                                            "HeroImages": {},
                                                            "WardPlacements": {},
                                                            "LaneNames": {
                                                                "TopDireName": {},
                                                                "MidDireName": {},
                                                                "BottomDireName": {},
                                                                "JungleDireName": {},
                                                                "TopRadiantName": {},
                                                                "MidRadiantName": {},
                                                                "BottomRadiantName": {},
                                                                "JungleRadiantName": {}
                                                            }
                                                        },
                                                        "StrategyMapControls": {
                                                            "AllyHeroesStrategyControl":
                                                                { "AllyHeroes": {} },
                                                            "PredictEnemyHeroesStrategyControl": { "PredictEnemyHeroes": {} },
                                                            "DesiredWardPlacementStrategyControl": { "DesiredWardPlacements": {} }
                                                        }
                                                    }
                                                },
                                                "StrategyTeamCompPanel": {
                                                    "StrategyTeamComposition": {
                                                        "RoleColumnContainer": {},
                                                        "TypeCountContainer": {
                                                            "MeleeLabel": {},
                                                            "RangedLabel": {}
                                                        }
                                                    }
                                                },
                                                "StrategyFriendsAndFoes": {
                                                    "BattlePassHeroUpsell": {
                                                        "UpsellMessaging": {
                                                            "UpsellText": {},
                                                            "BattlePassText": {}
                                                        }
                                                    },
                                                    "NoData"
                                                        : {},
                                                    "RequestingData": { "DataSpinner": {} },
                                                    "BattlePassHeroData": {}
                                                }
                                            },
                                            "StartingItems": {
                                                "StartingItemsContents": {
                                                    "StartingItemsLeftColumn": {
                                                        "StartingGoldContainer": {
                                                            "RemainingGoldContainer": {
                                                                "StartingGold": {},
                                                                "StartingItemsGoldIcon": {}
                                                            }
                                                        },
                                                        "InventoryStrategyControl": { "StartingItemsInventory": { "StartingItemsBackpackRow": { "StartingItemsBackpackRowContents": {} } } }
                                                    },
                                                    "StartingItemsRightColumn": {
                                                        "StartingItemsRightColumnRow": {
                                                            "TeamPurchasesStrategyControl": {
                                                                "TeamPurchases": {
                                                                    "TeamCourierItem": {
                                                                        "ShopItem": {
                                                                            "ItemImage": {},
                                                                            "CanPurchaseOverlay": {},
                                                                            "PopularOverlay": { "PopularIcon": {} },
                                                                            "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                                            "PlayerSuggestedOverlay": {},
                                                                            "OwnedTick": {},
                                                                            "SecretShop": {},
                                                                            "StockAmount": {},
                                                                            "OutOfStockOverlay": {},
                                                                            "AvailableAtOtherShopOverlay": {},
                                                                            "AvailableAtOtherShopNeedGoldOverlay": {},
                                                                            "SuggestionPct": {},
                                                                            "SequenceArrow": {},
                                                                            "DotaSuggest": {}
                                                                        },
                                                                        "HeroImage": {}
                                                                    },
                                                                    "TeamWardItem0": {
                                                                        "ShopItem": {
                                                                            "ItemImage": {},
                                                                            "CanPurchaseOverlay": {},
                                                                            "PopularOverlay": { "PopularIcon": {} },
                                                                            "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                                            "PlayerSuggestedOverlay": {},
                                                                            "OwnedTick": {},
                                                                            "SecretShop": {},
                                                                            "StockAmount": {},
                                                                            "OutOfStockOverlay": {},
                                                                            "AvailableAtOtherShopOverlay": {},
                                                                            "AvailableAtOtherShopNeedGoldOverlay": {}
                                                                            , "SuggestionPct": {},
                                                                            "SequenceArrow": {},
                                                                            "DotaSuggest": {}
                                                                        },
                                                                        "HeroImage": {}
                                                                    },
                                                                    "TeamWardItem1": {
                                                                        "ShopItem": {
                                                                            "ItemImage": {},
                                                                            "CanPurchaseOverlay": {},
                                                                            "PopularOverlay": { "PopularIcon": {} },
                                                                            "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                                            "PlayerSuggestedOverlay": {},
                                                                            "OwnedTick": {},
                                                                            "SecretShop": {},
                                                                            "StockAmount": {},
                                                                            "OutOfStockOverlay": {},
                                                                            "AvailableAtOtherShopOverlay": {},
                                                                            "AvailableAtOtherShopNeedGoldOverlay"
                                                                                : {},
                                                                            "SuggestionPct": {},
                                                                            "SequenceArrow": {},
                                                                            "DotaSuggest": {}
                                                                        },
                                                                        "HeroImage": {}
                                                                    },
                                                                    "TeamSentryWardItem0": {
                                                                        "ShopItem": {
                                                                            "ItemImage": {},
                                                                            "CanPurchaseOverlay": {},
                                                                            "PopularOverlay": { "PopularIcon": {} },
                                                                            "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                                            "PlayerSuggestedOverlay": {},
                                                                            "OwnedTick": {},
                                                                            "SecretShop": {},
                                                                            "StockAmount": {},
                                                                            "OutOfStockOverlay": {},
                                                                            "AvailableAtOtherShopOverlay": {},
                                                                            "AvailableAtOtherShopNeedGoldOverlay": {},
                                                                            "SuggestionPct": {},
                                                                            "SequenceArrow": {},
                                                                            "DotaSuggest": {}
                                                                        },
                                                                        "HeroImage": {}
                                                                    },
                                                                    "TeamSentryWardItem1": {
                                                                        "ShopItem": {
                                                                            "ItemImage": {},
                                                                            "CanPurchaseOverlay": {},
                                                                            "PopularOverlay": { "PopularIcon": {} },
                                                                            "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                                            "PlayerSuggestedOverlay": {},
                                                                            "OwnedTick": {},
                                                                            "SecretShop": {},
                                                                            "StockAmount": {},
                                                                            "OutOfStockOverlay": {},
                                                                            "AvailableAtOtherShopOverlay": {},
                                                                            "AvailableAtOtherShopNeedGoldOverlay": {},
                                                                            "SuggestionPct": {},
                                                                            "SequenceArrow": {},
                                                                            "DotaSuggest": {}
                                                                        },
                                                                        "HeroImage": {}
                                                                    },
                                                                    "TeamSmokeItem": {
                                                                        "ShopItem": {
                                                                            "ItemImage": {},
                                                                            "CanPurchaseOverlay": {},
                                                                            "PopularOverlay": { "PopularIcon": {} },
                                                                            "SuggestedNeutralOverlay": { "SuggestedNeutralIcon": {} },
                                                                            "PlayerSuggestedOverlay": {},
                                                                            "OwnedTick": {},
                                                                            "SecretShop": {},
                                                                            "StockAmount": {},
                                                                            "OutOfStockOverlay": {},
                                                                            "AvailableAtOtherShopOverlay": {},
                                                                            "AvailableAtOtherShopNeedGoldOverlay": {},
                                                                            "SuggestionPct": {},
                                                                            "SequenceArrow": {},
                                                                            "DotaSuggest": {}
                                                                        },
                                                                        "HeroImage": {}
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        "StartingItemsOtherOptionsStrategyControl": { "StartingItemsOtherOptions": {} },
                                                        "TeamSharedItemsStrategyControl": { "TeamSharedItemsContainer": {} }
                                                    }
                                                }
                                            }
                                        },
                                        "LoadoutTab": {
                                            "HeroLoadoutItems": {
                                                "HeroLoadoutSetPicker": {
                                                    "Header": {
                                                        "PickerSetCount": {},
                                                        "PickerTitle": {},
                                                        "ShuffleButton": {}
                                                    },
                                                    "CurrentSetContainer": {
                                                        "CurrentSetPanel": {
                                                            "ScenePanel": {},
                                                            "HeroSetName": {},
                                                            "EditSavedSetButton": {},
                                                            "BundleIcon": {},
                                                            "Equipped": {},
                                                            "Shuffled": {}
                                                        },
                                                        "MenuArrowContainer": { "MenuArrow": {} }
                                                    },
                                                    "SaveSetButton": {}
                                                },
                                                "HeroLoadoutSlots": {}
                                            },
                                            "GlobalLoadoutSlots": { "GlobalLoadoutItems": {} }
                                        },
                                        "GuidesTab": {
                                            "GuideBrowser": {
                                                "LeftColumn": {
                                                    "GuidePicker": {
                                                        "GuideList": {},
                                                        "PrioritizeUpdatedGuidesToggle": {},
                                                        "LanguageDropdown": { "schinese": {} }
                                                    }
                                                },
                                                "RightColumn": {
                                                    "GuideArea": {
                                                        "GuidePlusAssistant": {},
                                                        "AbilityBuild": { "AbilitiesContainer": {} },
                                                        "GuideTop": {
                                                            "ItemBuild": { "ItemCategoryList": {} },
                                                            "GuideRightColumn": {
                                                                "TalentDisplay": {
                                                                    "TalentName3": {},
                                                                    "TalentName2": {},
                                                                    "TalentName1": {},
                                                                    "TalentName0": {}
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "TeamPicker": {
                        "TeamPickerTitle": {},
                        "TeamPickerButtons": {
                            "PickRadiantTeamButton": {},
                            "PickDireTeamButton": {}
                        }
                    },
                    "HeroPickViewStrategy": {},
                    "BacktoHeroGrid": {
                    },
                    "HeaderCaptainsMode": {
                        "HeaderCaptainsModeRadiant": { "RadiantReserveTime": {} },
                        "HeaderCaptainsModeDire": { "DireReserveTime": {} }
                    },
                    "Header": {
                        "RadiantTeamPlayers": {},
                        "RadiantCoachPlayer": { "RadiantCoachIcon": {} },
                        "HeaderCenter": {
                            "ClockLabel": {},
                            "HeaderSubtitle": {
                                "PickModeSubtitle": {
                                    "PickModeSubtitleInfo": {
                                        "PickModePickPhase": {
                                            "RadiantPip1": {},
                                            "RadiantPip2": {},
                                            "DirePip1": {},
                                            "DirePip2": {}
                                        },
                                        "HeaderPenaltyTime": {
                                            "PenaltyTimeInfoIcon": {},
                                            "PenaltyTimeLabel": {}
                                        },
                                        "ReserveTimeLabel": {}
                                    }
                                },
                                "StrategyTimeLabel": {}
                            }
                        },
                        "DireCoachPlayer": { "DireCoachIcon": {} },
                        "DireTeamPlayers": {}
                    },
                    "ConnectingLabelContainer": { "ConnectionClock": {} },
                    "SpectateHeroSelection": {
                        "Row0": {
                            "RadiantScene": {},
                            "HeroFocus": {},
                            "TeamMembersContainer0": {
                                "TeamMemberList0": {
                                    "TeamMember0_0": {
                                        "UserName": {},
                                        "LeaderIcon": {}
                                    },
                                    "TeamMember0_1": {
                                        "UserName": {
                                        },
                                        "LeaderIcon": {}
                                    },
                                    "TeamMember0_2": {
                                        "UserName": {},
                                        "LeaderIcon": {}
                                    },
                                    "TeamMember0_3": {
                                        "UserName": {},
                                        "LeaderIcon": {}
                                    },
                                    "TeamMember0_4": {
                                        "UserName": {},
                                        "LeaderIcon": {}
                                    }
                                },
                                "TeamLogoBlur0": {}
                            },
                            "TeamLogo0": {},
                            "RadiantSeriesWins": {
                                "RadiantSeriesPip1": {},
                                "RadiantSeriesPip2": {},
                                "RadiantSeriesPip3": {}
                            }
                        },
                        "Row1": {
                            "DireScene": {},
                            "HeroFocus": {},
                            "TeamMembersContainer1": {
                                "TeamMemberList1": {
                                    "TeamMember1_0": {
                                        "UserName"
                                            : {},
                                        "LeaderIcon": {}
                                    },
                                    "TeamMember1_1": {
                                        "UserName": {},
                                        "LeaderIcon": {}
                                    },
                                    "TeamMember1_2": {
                                        "UserName": {},
                                        "LeaderIcon": {}
                                    },
                                    "TeamMember1_3": {
                                        "UserName": {},
                                        "LeaderIcon": {}
                                    },
                                    "TeamMember1_4": {
                                        "UserName": {},
                                        "LeaderIcon": {}
                                    }
                                },
                                "TeamLogoBlur1": {}
                            },
                            "TeamLogo1": {},
                            "DireSeriesWins": {
                                "DireSeriesPip1": {},
                                "DireSeriesPip2": {},
                                "DireSeriesPip3": {}
                            }
                        },
                        "HeroPickTimelineBG": {},
                        "HeroPickTimeline": {
                            "ReserveContainer": {
                                "Time0"
                                    : {},
                                "ReserveTime": {},
                                "Time1": {}
                            },
                            "AegisIcon": {},
                            "BattleBegins": {},
                            "TimelineSegments": {}
                        },
                        "BansBackground": {
                            "PhaseTimeLabel": {},
                            "ReserveTimeLabel": {}
                        },
                        "HeroPickedContainerRadiant": {
                            "HeroPickedRadiant": {
                                "HeroNameBrush": {},
                                "HeroPickedName": {}
                            }
                        },
                        "HeroPickedContainerDire": {
                            "HeroPickedDire": {
                                "HeroNameBrush": {},
                                "HeroPickedName": {}
                            }
                        },
                        "BansContainer0": {
                            "BansLabel0": {},
                            "BanList0": {
                                "BannedHero0_0": {
                                    "BannedHeroImage": {},
                                    "CrossLine": {},
                                    "BanPhaseTimeLabel": {},
                                    "BanReserveTimeLabel": {}
                                },
                                "BannedHero0_1": {
                                    "BannedHeroImage": {},
                                    "CrossLine": {},
                                    "BanPhaseTimeLabel": {},
                                    "BanReserveTimeLabel": {}
                                },
                                "BannedHero0_2": {
                                    "BannedHeroImage": {},
                                    "CrossLine": {},
                                    "BanPhaseTimeLabel": {},
                                    "BanReserveTimeLabel": {}
                                },
                                "BannedHero0_3": {
                                    "BannedHeroImage": {},
                                    "CrossLine": {},
                                    "BanPhaseTimeLabel": {},
                                    "BanReserveTimeLabel": {}
                                },
                                "BannedHero0_4": {
                                    "BannedHeroImage": {},
                                    "CrossLine": {},
                                    "BanPhaseTimeLabel": {},
                                    "BanReserveTimeLabel": {}
                                },
                                "BannedHero0_5": {
                                    "BannedHeroImage": {},
                                    "CrossLine": {},
                                    "BanPhaseTimeLabel": {},
                                    "BanReserveTimeLabel": {}
                                },
                                "BannedHero0_6": {
                                    "BannedHeroImage": {},
                                    "CrossLine": {},
                                    "BanPhaseTimeLabel": {},
                                    "BanReserveTimeLabel": {}
                                }
                            }
                        },
                        "BansContainer1": {
                            "BansLabel1": {},
                            "BanList1": {
                                "BannedHero1_0": {
                                    "BannedHeroImage": {},
                                    "CrossLine": {},
                                    "BanPhaseTi                                meLabel": {},
                                    "BanReserveTimeLabel": {}
                                },
                                "BannedHero1_1": {
                                    "BannedHeroImage": {},
                                    "CrossLine": {},
                                    "BanPhaseTimeLabel": {},
                                    "BanReserveTimeLabel": {}
                                },
                                "BannedHero1_2": {
                                    "BannedHeroImage": {},
                                    "CrossLine": {},
                                    "BanPhaseTimeLabel": {},
                                    "BanReserveTimeLabel": {}
                                },
                                "BannedHero1_3": {
                                    "BannedHeroImage": {},
                                    "CrossLine": {},
                                    "BanPhaseTimeLabel": {},
                                    "BanReserveTimeLabel": {}
                                },
                                "BannedHero1_4": {
                                    "BannedHeroImage": {},
                                    "CrossLine": {},
                                    "Ba                                nPhaseTimeLabel": {},
                                    "BanReserveTimeLabel": {}
                                },
                                "BannedHero1_5": {
                                    "BannedHeroImage": {},
                                    "CrossLine": {},
                                    "BanPhaseTimeLabel": {},
                                    "BanReserveTimeLabel": {}
                                },
                                "BannedHero1_6": {
                                    "BannedHeroImage": {},
                                    "CrossLine": {},
                                    "BanPhaseTimeLabel": {},
                                    "BanReserveTimeLabel": {}
                                }
                            }
                        },
                        "HeroPool": { "HeroList": {} },
                        "Header": {
                            "TournamentLogoBlur": {},
                            "Title": { "TournamentLogo": {} },
                            "GameMode": {}
                        },
                        "PhaseStatus": {
                            "PhaseTimer": {},
                            "Phase0": {}
                            , "Phase1": {},
                            "PhaseStrat": {},
                            "PhaseBan": {}
                        },
                        "ToggleChatButton": {}
                    },
                    "AbilityDraft": {
                        "MainContainer": {
                            "AbilitiesScene": {},
                            "AbilityDraftUltimatesHitbox": {},
                            "AbilityDraftAbilitiesHitbox": { "CenterBlock": {} },
                            "AbilityCorners": {
                                "TopLeftCorner": {},
                                "TopRightCorner": {},
                                "AbilityLabelContainer": { "AbilityLabel": {} },
                                "BottomLeftCorner": {},
                                "BottomRightCorner": {}
                            },
                            "UltimateCorners": {
                                "TopLeftCorner": {},
                                "TopRightCorner": {},
                                "UltLabelContainer": { "UltLabel": {} },
                                "BottomLeftCorner": {},
                                "BottomRightCorner": {}
                            },
                            "UIElements": {
                                "PickingGlowContainer": { "PickingGlow": {} },
                                "RadiantHeroes": {},
                                "DireHeroes": {}
                            },
                            "Header": {
                                "TimerContainer": {
                                    "TimerLabel": {},
                                    "Timer": {}
                                },
                                "HeroStripContainer": { "HeroStripClipPanel": { "HeroStrip": {} } }
                            },
                            "TopRightContainer": {
                                "ADTitle": {},
                                "ADLogButtonContainer": {
                                    "ADLogPing": { "ADLogPingCircle": {} },
                                    "ADLog":
                                        {}
                                }
                            }
                        },
                        "LoadingContainer": { "ADLoadingTitle": {} },
                        "ChangeLogContainer": {}
                    },
                    "BottomPanelsContainer": {
                        "PreMinimapContainer": {
                            "HeroPickMinimap": {
                                "RadiantBuildings": {},
                                "DireBuildings": {},
                                "LaneGlows": {
                                    "BottomRadiantGlow": {},
                                    "TopRadiantGlow": {},
                                    "JungleRadiantGlow": {},
                                    "BottomDireGlow": {},
                                    "TopDireGlow": {},
                                    "JungleDireGlow": {},
                                    "MidRadiantGlow": {},
                                    "MidDireGlow": {}
                                },
                                "LaneHitBoxes": {
                                    "BottomRadiant": {},
                                    "TopRadiant": {},
                                    "TopRadiant2": {},
                                    "JungleRadiant": {},
                                    "BottomDire": {},
                                    "BottomDire2": {},
                                    "TopDire": {},
                                    "JungleDire": {},
                                    "JungleDire2": {},
                                    "MidRadiant": {},
                                    "MidDire": {}
                                },
                                "HeroImages": {},
                                "WardPlacements": {},
                                "LaneNames": {
                                    "TopDireName": {},
                                    "MidDireName": {},
                                    "BottomDireName": {},
                                    "JungleDireName": {},
                                    "TopRadiantName": {},
                                    "MidRadiantName": {},
                                    "BottomRadiantName": {},
                                    "JungleRadiantName": {}
                                }
                            }
                        },
                        "AvailableItemsContainer": {
                            "AvailableItems": {
                                "AvailableItemsCarousel": {},
                                "AvailableItemsFooter": { "AvailableItemsTitle": {} }
                            }
                        },
                        "BottomPanels": {
                            "FriendsAndFoes": {
                                "BattlePassHeroUpsell": {
                                    "UpsellMessaging": {
                                        "UpsellText": {},
                                        "BattlePassText": {}
                                    }
                                },
                                "NoData": {},
                                "RequestingData": { "DataSpinner": {} },
                                "BattlePassHeroData": {}
                            },
                            "HeroPickTeamComposition": {
                                "RoleColumnContainer": {},
                                "TypeCountContainer": {
                                    "MeleeLabel": {},
                                    "RangedLabel": {}
                                }
                            },
                            "Chat": {
                                "ChatDialogVariablePanel": {},
                                "ChatMessageTempLabel": {}
                            },
                            "BattlePassContainer": {
                                "BattlePassActive": {},
                                "BattlePassUpsell": { "QuestsTitle": {} },
                                "BattlePassNotActive": { "QuestsTitle": {} }
                            },
                            "PlusChallengeContainer": {
                                "Header": {
                                    "HeaderLogo": {},
                                    "HeaderText": {},
                                    "DropDownCarrot": {}
                                }
                            }
                        }
                    },
                    "QuestPickerHolder": {
                        "QuestPicker": {
                            "QuestPickerContainer": {
                                "QuestPickerPanel": {
                                    "QuestPickerCurrentQuest": {
                                        "QuestPickerHeader": {
                                            "QuestLinePicker": { "QuestPickerQuestLineName": {} }
                                        },
                                        "BottomQuestBlock": {
                                            "QuestInfo": {
                                                "CurrentLabel": {},
                                                "CurrentQuestNumGames": {},
                                                "CurrentQuestDesc": {}
                                            }
                                        },
                                        "QuestChallengeProgress": {
                                            "QuestChallengeProgress_Left": {},
                                            "QuestChallengeProgress_Right": {}
                                        },
                                        "QuestPickerQuestMap": { "QuestLine": {} }
                                    },
                                    "QuestPickerBottom": {
                                        "SideQuestContainer": {
                                            "DailyHeroQuestStatus": { "HeroMovie": {} },
                                            "WeeklyQuestStatus1": {
                                                "ChallengeProgress": {
                                                    "ChallengeProgress_Left": {},
                                                    "ChallengeProgress_Right": {}
                                                }
                                            },
                                            "WeeklyQuestStatus2": {
                                                "ChallengeProgress": {
                                                    "ChallengeProgress_Left": {},
                                                    "ChallengeProgress_Right": {}
                                                }
                                            }
                                        },
                                        "ActiveContainer": {}
                                    },
                                    "QuestLineOptions": {}
                                },
                                "QuestSlideThumb": {}
                            }
                        },
                        "QuestPickerCloseButton": {}
                    },
                    "DashboardButton": {},
                    "SettingsButton": {},
                    "ToGameTransition": {},
                    "VersusScreen2": {
                        "RadiantScene": {},
                        "DireScene": {}
                    },
                    "WaitingForMapLoad": {
                        "ReconnectBlack": {},
                        "WaitingForMapLoadContents": {}
                    },
                    "RandomConfirm": {
                        "RandomConfirmPopUp": {
                            "RandomConfirmTitle": {},
                            "RandomConfirmHeroName": {},
                            "RandomConfirmHeroMovie": {},
                            "RandomConfirmPopupButtons": {
                                "RandomCancelButton": {},
                                "RandomConfirmButton": {}
                            },
                            "RandomAutoConfirmLabel": {}
                        }
                    },
                    "PreConnectContainer": {
                        "PreLoadingRootBackground": {},
                        "PreLoadingRootVignette": {},
                        "TransitionContainer": {},
                        "TestCircle": {},
                        "DebugTextContainer": {
                            "ReconnectLabel": {},
                            "PreloadLabel": {},
                            "BecomeActiveLabel": {},
                            "WaitingLabel": {},
                            "MapLoadLabel": {},
                            "HiddenLabel": {},
                            "MapLoadingOutroLabel": {},
                            "MapLoadingLabel": {},
                            "StartPregameIntroLabel": {},
                            "EndPregameIntroLabel": {},
                            "FinishedLabel": {}
                        }
                    },
                    "DebugInfoBlock": {}
                },
                "CustomUIRoot": {
                    "CustomHudElements": {},
                    "CustomUI": {},
                    "CustomUIContainer_Hud": {},
                    "CustomUIContainer_HeroSelection": {},
                    "CustomUIContainer_PregameStrategy": {},
                    "CustomUIContainer_GameInfo": {
                        "GameInfoPanel": {
                            "GameInfoPanelScrollArea": {
                                "GameInfoPanelPaddingTop": {},
                                "CustomUIContainer": {},
                                "GameInfoPanelPaddingBottom": {}
                            },
                            "GameInfoGradientOverlayTop": {},
                            "GameInfoGradientOverlayBottom": {}
                        },
                        "GameInfoButton": {
                            "GameInfoIcon": {},
                            "GameInfoOpenClose": {}
                        }
                    },
                    "CustomUIContainer_GameSetup": {
                        "CustomUIContainer": {
                            "DefaultCustomUI_GameSetup": {
                                "TeamSelectContainer": {
                                    "TeamsSelectEmptySpace": {},
                                    "TeamsList": {
                                        "TeamsListGroup": {
                                            "TeamListHeader": {
                                                "TeamListHeaderLabel": {},
                                                "TeamListLockedIcon": {}
                                            },
                                            "TeamsListRoot": {},
                                            "ShuffleTeamAssignmentButton": {}
                                        }
                                    },
                                    "GameAndPlayersRoot": {
                                        "GameInfoPanel": {
                                            "CustomGameModeName": { "GameModeNameLabel": {} },
                                            "MapInfo": { "MapInfoLabel": {} },
                                            "StartGameCountdownTimer": {
                                                "TimerBg": {},
                                                "TimerRing": {},
                                                "TeamSelectTimer": {},
                                                "TimerLabelBox": {
                                                    "TimerLabelAutoStart": {},
                                                    "TimerLabelGameStart": {}
                                                }
                                            }
                                        },
                                        "UnassignedPlayerPanel": {
                                            "UnassignedPlayersButton": {
                                                "UnassignedPlayersHeader": {},
                                                "UnassignedPlayersDivider": {},
                                                "UnassignedPlayersContainer": {}
                                            },
                                            "AutoAssignButton": {}
                                        },
                                        "LockAndStartButton": {},
                                        "CancelAndUnlockButton": {}
                                    }
                                }
                            }
                        }
                    },
                    "CustomUIContainer_FlyoutScoreboard": {},
                    "CustomUIContainer_HudTopBar": {},
                    "CustomUIContainer_EndScreen": {}
                },
                "VoiceChat": {
                    "Captions": {},
                    "SelfVoice": {
                        "PartyLabel": {},
                        "CoachingLabel": {},
                        "OpenMicMutedLabel": {}
                    }
                },
                "KillGraph": {
                    "PopupFrame": {
                        "TitleBar": { "TitleBarBG": { "TargetHero": {} } },
                        "Content": {},
                        "CollapseArrow": {}
                    }
                },
                "player_performance_container": {
                    "KillStreak": { "StreakContainer": {} },
                    "EsArcanaCombo": {
                        "ComboCountContainer": {
                            "ComboDetail": { "ComboAmbientFX": {} },
                            "ComboCountContents": {
                                "ComboContain": {
                                    "ComboCountDigit1": {},
                                    "ComboCountDigit2": {},
                                    "ComboCountDigit3": {}
                                }
                            }
                        },
                        "ComboSummaryContainer": {
                            "ComboSummaryFX": {},
                            "ComboDetail2": {},
                            "ComboSummaryContents": {}
                        }
                    },
                    "OmArcanaCombo": {
                        "ComboCountContainer": {
                            "ComboDetail": { "ComboAmbientFX": {} },
                            "ComboCountContents": {
                                "ComboContain": {
                                    "ComboCountDigit1": {},
                                    "ComboCountDigit2": {},
                                    "ComboCountDigit3": {}
                                }
                            }
                        },
                        "ComboSummaryContainer": {
                            "ComboSummaryFX": {},
                            "ComboDetail2": {},
                            "ComboSummaryContents": {}
                        }
                    },
                    "QoPArcana": {
                        "SummaryContainer": {
                            "QoPCrown": {},
                            "SummaryFX": {},
                            "MeterBG": {},
                            "MeterNeedle": {}
                        }
                    },
                    "WrArcana": {},
                    "SpectreArcana": {
                        "ProgressPanel": {
                            "ParticleBG": {},
                            "ParticleBurst": {}
                        }
                    }
                },
                "WKArcana": {
                    "HeroesPanel": {
                        "SealScene": {},
                        "Contents": {
                            "WkHeroKillList": {
                                "Hero1": {},
                                "Hero2": {},
                                "Hero3": {},
                                "Hero4": {},
                                "Hero5": {}
                            }
                        }
                    },
                    "ProgressPanel": { "SealEmblem": {} }
                },
                "ErrorMessages": { "ErrorMsg": {} },
                "ChatWheel": {
                    "Wheel": {
                        "Arrow": {},
                        "PointerContainer": { "WheelPointer": {} },
                        "WheelBG": { "WheelCenter": { "WheelBG2": {} } },
                        "Bubble": { "HeroImage": {} }
                    },
                    "PhrasesContainer": {}
                },
                "PingWheel": {
                    "Root": {
                        "BG": {},
                        "TopRight": {},
                        "BottomLeft": {},
                        "Left": {},
                        "TopLeft": {},
                        "Right": {},
                        "BottomRight": {},
                        "DefaultPing": {}
                    }
                },
                "SpectatorItems": {
                    "BackgroundContainer": { "SpectatorItemsCloseButton": {} },
                    "MainContainer": {
                        "ItemsLabel": {},
                        "RadiantTeamLabel": {},
                        "RadiantItemsContainer": {},
                        "DireTeamLabel": {},
                        "DireItemsContainer": {}
                    }
                },
                "PausedInfo": {
                    "PausedContainer": { "PausedLabel": {} },
                    "PausedGameContainer": {},
                    "PausedCountdownLabel": {},
                    "PrevTip": {},
                    "TipContainer": { "TipText": {} },
                    "NextTip": {}
                },
                "GuideBrowser": {
                    "LeftColumn": {
                        "GuidePicker": {
                            "GuideList": {},
                            "PrioritizeUpdatedGuidesToggle": {},
                            "LanguageDropdown": { "schinese": {} }
                        }
                    },
                    "RightColumn": {
                        "GuideArea": {
                            "GuidePlusAssistant": {},
                            "AbilityBuild": { "AbilitiesContainer": {} },
                            "GuideTop": {
                                "ItemBuild": { "ItemCategoryList": {} },
                                "GuideRightColumn": {
                                    "TalentDisplay": {
                                        "TalentName3": {},
                                        "TalentName2": {},
                                        "TalentName1": {},
                                        "TalentName0": {}
                                    }
                                }
                            }
                        }
                    }
                },
                "Charms": {
                    "CloseCharmsButton": {},
                    "CharmPaginationControls": {
                        "ItemPips": {},
                        "ItemCount": {},
                        "PreviousItemButton": {},
                        "NextItemButton": {}
                    },
                    "PageLeftButton": {},
                    "CharmsCarousel": {},
                    "PageRightButton": {}
                },
                "Cameraman": {},
                "BotDebug": {
                    "LaneColumns": {},
                    "LaneValues": {
                        "PushLaneContainer": {
                            "PushTop": {
                                "Value": {},
                                "Bar": {}
                            },
                            "PushMid": {
                                "Value": {},
                                "Bar": {}
                            },
                            "PushBot": {
                                "Value": {},
                                "Bar": {}
                            }
                        },
                        "DefendLaneContainer": {
                            "DefendTop": {
                                "Value": {},
                                "Bar": {}
                            },
                            "DefendMid": {
                                "Value": {},
                                "Bar": {}
                            },
                            "DefendBot": {
                                "Value": {},
                                "Bar": {}
                            }
                        },
                        "FarmLaneContainer": {
                            "FarmTop": {
                                "Value": {},
                                "Bar": {}
                            },
                            "FarmMid": {
                                "Value": {},
                                "Bar": {}
                            },
                            "FarmBot": {
                                "Value": {},
                                "Bar": {}
                            }
                        }
                    },
                    "RoshanValue": {
                        "RoshanContainer": {
                            "Roshan": {
                                "Value": {},
                                "Bar": {}
                            }
                        }
                    },
                    "Runes": {},
                    "BotContainer": {
                        "Bot0": {
                            "PowerContainer": {
                                "PowerCurrent": { "PowerBarCurrent": {} },
                                "PowerMax": { "PowerBarMax": {} }
                            },
                            "ModeContainer": {
                                "ActiveModeLabel": {},
                                "ModeList": {}
                            },
                            "ActionContainer": { "ActiveActionLabel": {} }
                        },
                        "Bot1": {
                            "PowerContainer": {
                                "PowerCurrent": { "PowerBarCurrent": {} },
                                "PowerMax": { "PowerBarMax": {} }
                            },
                            "ModeContainer": {
                                "ActiveModeLabel": {},
                                "ModeList": {}
                            },
                            "ActionContainer": { "ActiveActionLabel": {} }
                        },
                        "Bot2": {
                            "PowerContainer": {
                                "PowerCurrent": { "PowerBarCurrent": {} },
                                "PowerMax": { "PowerBarMax": {} }
                            },
                            "ModeContainer": {
                                "ActiveModeLabel": {},
                                "ModeList": {}
                            },
                            "ActionContainer": { "ActiveActionLabel": {} }
                        },
                        "Bot3": {
                            "PowerContainer": {
                                "PowerCurrent": { "PowerBarCurrent": {} },
                                "PowerMax": {
                                    "PowerBarMax": {}
                                }
                            },
                            "ModeContainer": {
                                "ActiveModeLabel": {},
                                "ModeList": {}
                            },
                            "ActionContainer": { "ActiveActionLabel": {} }
                        },
                        "Bot4": {
                            "PowerContainer": {
                                "PowerCurrent": { "PowerBarCurrent": {} },
                                "PowerMax": { "PowerBarMax": {} }
                            },
                            "ModeContainer": {
                                "ActiveModeLabel": {},
                                "ModeList": {}
                            },
                            "ActionContainer": { "ActiveActionLabel": {} }
                        }
                    }
                },
                "spectator_overwatch": {
                    "FullScreenFade": { "FadeText": {} },
                    "FocusHeroPanel": { "FocusHero": {} },
                    "HudOverwatchFocus": { "FocusTop": {} },
                    "ConvictionPanel": {
                        "ReviewOverwatchCaseUI": {
                            "HeaderDetails": {
                                "HeaderDetailsSubHeader": {},
                                "HelpText": {}
                            }
                        }
                    },
                    "OverwatchControls": { "OverwatchAutoPlayToggle": {} }
                },
                "spectator_dvr": {
                    "DVRControls": {
                        "TimeDisplay": {
                            "CurrentTime": {},
                            "TimeSeparator": {},
                            "TotalTime": {}
                        },
                        "SliderAndMarkers": {},
                        "PlaybackSpeedLabel": {},
                        "GoLiveButton": { "GoLiveLabel": {} },
                        "SkipBackButton": {},
                        "PlayButton"
                            : {}
                    },
                    "ExpandButton": { "ExpandButtonIcon": {} }
                },
                "BroadcasterSelection": {
                    "SelectBroadcaster": {},
                    "BroadcastersContainer": {},
                    "NoBroadcaster": {
                        "NoBroadcasterImage": {},
                        "NoBroadcasterLabel": {}
                    }
                },
                "GameEndContainer": {},
                "PopupManager": {
                    "DimBackground": {},
                    "BlurBackground": {}
                },
                "ContextMenuManager": {},
                "HelpTipsManager": {
                    "DimBackground": {
                        "DimTop": {},
                        "DimBottom": {},
                        "DimRight": {},
                        "DimLeft": {},
                        "DimCenter": {}
                    },
                    "TipTargets": {},
                    "TipContainer": {
                        "TopArrow": {},
                        "BottomArrow": {}
                    }
                },
                "SpectatorToastManager": {},
                "Tooltips": {},
                "IngamePredictionsContainer": {},
                "PredictionToastManager": {},
                "BroadcastToastManager": {},
                "BroadcastToastManagerAlpha": {},
                "BountyToastManager": {}
            },
            "__react_panorama_temporary_host__": {},
            "__react_panorama_temporary_scene_host__": {}
        }
    }
}