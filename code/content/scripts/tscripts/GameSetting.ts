import { GameServiceConfig } from "./shared/GameServiceConfig";
@GReloadable
export class GameSetting {
    public static init() {
        GameSetting.gameRulesInit();
        GameSetting.gameModeInit();
        GameSetting.gameFilterInit();
        // DEBUG
        if (IsInToolsMode()) {
            GameRules.SetCustomGameSetupAutoLaunchDelay(30);
            GameRules.LockCustomGameSetupTeamAssignment(true);
            GameRules.EnableCustomGameSetupAutoLaunch(true);
        } else {
            GameRules.SetCustomGameSetupAutoLaunchDelay(0);
            GameRules.LockCustomGameSetupTeamAssignment(true);
            GameRules.EnableCustomGameSetupAutoLaunch(true);
            GameRules.Addon.Instance.SetBuybackEnabled(false);
        }
    }
    public static GetServerKey(): string {
        if (IsInToolsMode()) {
            return "90C865A2E432539702FEA672E1C9C7029242B5D7";
        }
        return GetDedicatedServerKeyV2(GameServiceConfig.GAME_VERSION);
    }
    public static gameRulesInit() {
        GameRules.SetHeroRespawnEnabled(false);
        GameRules.SetSameHeroSelectionEnabled(true);
        GameRules.SetHeroSelectionTime(99999);
        GameRules.SetHeroSelectPenaltyTime(0);
        GameRules.SetStrategyTime(0.5);
        GameRules.SetShowcaseTime(0);
        GameRules.SetPreGameTime(3);
        GameRules.SetPostGameTime(3000);
        GameRules.SetTreeRegrowTime(10);
        GameRules.SetGoldPerTick(0);
        GameRules.SetGoldTickTime(1);
        GameRules.SetUseBaseGoldBountyOnHeroes(false);
        GameRules.SetFirstBloodActive(false);
        GameRules.SetHideKillMessageHeaders(true);
        GameRules.SetUseUniversalShopMode(true);
        GameRules.SetStartingGold(GameServiceConfig.GAME_START_GOLD);
        GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_GOODGUYS, GameServiceConfig.GAME_MAX_PLAYER);
        GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_BADGUYS, 0);
        // GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_1, GameServiceConfig.GAME_MAX_PLAYER);
        // GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_2, GameServiceConfig.GAME_MAX_PLAYER);
        // GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_3, GameServiceConfig.GAME_MAX_PLAYER);
        // GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_4, GameServiceConfig.GAME_MAX_PLAYER);
        // GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_5, GameServiceConfig.GAME_MAX_PLAYER);
        // GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_6, GameServiceConfig.GAME_MAX_PLAYER);
        // GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_7, GameServiceConfig.GAME_MAX_PLAYER);
        // GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_8, GameServiceConfig.GAME_MAX_PLAYER);
        GameRules.SetUseCustomHeroXPValues(true);
    }

    public static gameModeInit() {
        // 默认英雄,跳过英雄选择界面
        // GameRules.Addon.Instance.SetCustomGameForceHero(GameSetting.DEFAULT_PICKED_HERO);
        //#region  開啓后閃退
        GameRules.Addon.Instance.SetUseCustomHeroLevels(true)
        //#endregion
        GameRules.Addon.Instance.SetCustomHeroMaxLevel(GameServiceConfig.HERO_MAX_LEVEL)
        GameRules.Addon.Instance.SetCustomXPRequiredToReachNextLevel(GameServiceConfig.HERO_XP_PER_LEVEL_TABLE)
        // 设置背包物品交换后冷却时间
        GameRules.Addon.Instance.SetCustomBackpackSwapCooldown(0);
        /**天气 */
        GameRules.Addon.Instance.SetWeatherEffectsDisabled(true);
        GameRules.Addon.Instance.SetAlwaysShowPlayerNames(true);
        GameRules.Addon.Instance.SetRecommendedItemsDisabled(true);
        GameRules.Addon.Instance.SetGoldSoundDisabled(true);
        GameRules.Addon.Instance.SetFogOfWarDisabled(true);
        // 战争迷雾
        GameRules.Addon.Instance.SetUnseenFogOfWarEnabled(false);
        GameRules.Addon.Instance.SetLoseGoldOnDeath(false);
        GameRules.Addon.Instance.SetCustomBuybackCooldownEnabled(true);
        GameRules.Addon.Instance.SetCustomBuybackCostEnabled(true);
        GameRules.Addon.Instance.SetMinimumAttackSpeed(GameServiceConfig.MINIMUM_ATTACK_SPEED);
        GameRules.Addon.Instance.SetMaximumAttackSpeed(GameServiceConfig.MAXIMUM_ATTACK_SPEED);
        GameRules.Addon.Instance.SetStashPurchasingDisabled(false);
        GameRules.Addon.Instance.SetStickyItemDisabled(true);
        GameRules.Addon.Instance.SetDaynightCycleDisabled(false);
        GameRules.Addon.Instance.SetAnnouncerDisabled(true);
        GameRules.Addon.Instance.SetKillingSpreeAnnouncerDisabled(true);
        GameRules.Addon.Instance.SetPauseEnabled(true);
        GameRules.Addon.Instance.SetDaynightCycleDisabled(false);
        GameRules.Addon.Instance.SetSelectionGoldPenaltyEnabled(false);


    }

    // 指令过滤器
    public static gameFilterInit() {
        let GameMode = GameRules.Addon.Instance;
        GameMode.SetExecuteOrderFilter((event: ExecuteOrderFilterEvent) => {
            // let iOrderType = event.order_type
            // let iPlayerID = event.issuer_player_id_const; // 发出指令的玩家id
            // if (GameRules.IsGamePaused()) {
            //     GNotificationSystem.ErrorMessage("dota_hud_error_game_is_paused", iPlayerID);
            //     return false
            // }
            // let queue = event.queue;
            // if (event.units == null || event.units["0"] == null) {
            //     return false
            // }
            // let hCaster = EntIndexToHScript(event.units["0"]) as IBaseNpc_Plus;
            // if (!IsValid(hCaster) || !hCaster.IsAlive()) {
            //     return false
            // }
            return true
        }, this);

        GameMode.SetDamageFilter((event: DamageFilterEvent) => {
            // let hAbility = EntIndexToHScript(event.entindex_inflictor_const || -1 as any)
            let hVictim = EntIndexToHScript(event.entindex_victim_const || -1 as any) as IBaseNpc_Plus;
            let hAttacker = EntIndexToHScript(event.entindex_attacker_const || -1 as any) as IBaseNpc_Plus;
            if (IsValid(hAttacker) && hAttacker != hVictim && event.damage > 0) {
                let fDamage = event.damage;
                let iDamageType = event.damagetype_const;
                [hAttacker, hVictim].forEach(unit => {
                    let battleroot = unit.ETRoot as IBattleUnitEntityRoot;
                    if (battleroot && battleroot.IsBattleUnit && battleroot.IsBattleUnit() && battleroot.IsFriendly()) {
                        let iPlayerID = battleroot.BelongPlayerid;
                        if (PlayerResource.IsValidPlayerID(iPlayerID)) {
                            // let hHero = PlayerResource.GetSelectedHeroEntity(iPlayerID)
                            // if (hHero == unit) {
                            //     return
                            // }
                            if (iDamageType == DAMAGE_TYPES.DAMAGE_TYPE_NONE) {
                                iDamageType = DAMAGE_TYPES.DAMAGE_TYPE_PURE
                            }
                            let round = battleroot.GetPlayer().RoundManagerComp().getCurrentBoardRound();
                            let entityindex = unit.GetEntityIndex() + "";
                            if (battleroot.IsIllusion() || battleroot.IsSummon()) {
                                entityindex = (battleroot as IBattleUnitIllusionEntityRoot).SourceEntityId + "";
                            }
                            round.AddRoundDamage(entityindex, unit.GetUnitName(), unit == hAttacker, iDamageType, fDamage)
                        }
                    }

                })
            }
            return true
        }, this)
        GameMode.SetItemAddedToInventoryFilter((event: ItemAddedToInventoryFilterEvent) => {
            // item_entindex_const	-- 物品
            // inventory_parent_entindex_const	-- 单位
            // suggested_slot	-1 -- 默认-1 如果指定了数字，对应物品栏为空则放入，不为空则直接掉在地上
            // item_parent_entindex_const	物品容器
            // let hTarget = EntIndexToHScript(event.inventory_parent_entindex_const) as IBaseNpc_Plus;
            // let hItem = EntIndexToHScript(event.item_entindex_const) as IBaseItem_Plus;
            // let hItemParent = EntIndexToHScript(event.item_parent_entindex_const) as IBaseNpc_Plus;
            // let iPlayerID = hTarget.GetPlayerOwnerID();
            // let suggested_slot = event.suggested_slot;
            // if (!IsValid(hItem)) { return true }
            // // 处理组件
            // let itemroot = hItem.ETRoot;
            // let npcroot = hTarget.ETRoot;
            // if (itemroot && npcroot) {
            //     let InventoryComp = npcroot.As<IBattleUnitEntityRoot>().InventoryComp();
            //     if (InventoryComp) {
            //         GLogHelper.print("ItemAddedToInventoryFilter", suggested_slot)
            //         if (suggested_slot == -1) {
            //             InventoryComp.dropGroundItem(itemroot as IItemEntityRoot);
            //         } else {
            //             InventoryComp.putInItem(itemroot as IItemEntityRoot);
            //         }
            //     }
            // }
            return true
        }, this)
        // GameMode:SetBountyRunePickupFilter(Dynamic_Wrap(public, "BountyRunePickupFilter"), public)
        // GameMode:SetAbilityTuningValueFilter(Dynamic_Wrap(public, "AbilityTuningValueFilter"), public)
        // GameMode:SetHealingFilter(Dynamic_Wrap(public, "HealingFilter"), public)
        // GameMode:SetModifierGainedFilter(Dynamic_Wrap(public, "ModifierGainedFilter"), public)
        // GameMode:SetModifyExperienceFilter(Dynamic_Wrap(public, "ModifyExperienceFilter"), public)
        // GameMode:SetModifyGoldFilter(Dynamic_Wrap(public, "ModifyGoldFilter"), public)
        // GameMode:SetRuneSpawnFilter(Dynamic_Wrap(public, "RuneSpawnFilter"), public)
        // GameMode:SetTrackingProjectileFilter(Dynamic_Wrap(public, "TrackingProjectileFilter"), public)
    }
}
