import { GameEnum } from "./GameEnum";
import { GameFunc } from "./GameFunc";
import { LogHelper } from "./helper/LogHelper";
import { SingletonClass } from "./helper/SingletonHelper";
import { Modifier_Plus } from "./npc/entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "./npc/entityPlus/BaseNpc_Plus";
import { BuildingEntityRoot } from "./rules/Components/Building/BuildingEntityRoot";
export class GameSetting {
    /**版本号 */
    public static readonly GAME_VERSION: string = "1.0.0";

    public static readonly GAME_Name: string = "xiyou";

    public static readonly GAME_ISDEBUG: boolean = true;
    /**最大玩家数量 */
    public static readonly GAME_MAX_PLAYER: number = 5;
    /**每队最大玩家数量 */
    public static readonly TEAM_MAX_PLAYER: number = 1;
    /**开局金币数量 */
    public static readonly GAME_START_GOLD: number = 100;
    /**最小攻击速度 */
    public static readonly MINIMUM_ATTACK_SPEED: number = 20;
    /**最大攻击速度 */
    public static readonly MAXIMUM_ATTACK_SPEED: number = 500;
    /**玩家初始英雄 */
    public static readonly DEFAULT_PICKED_HERO: string = GameEnum.Dota2.enum_HeroName.phoenix;
    /**英雄AI时间间隔 */
    public static readonly AI_TIMER_TICK_TIME_HERO: number = 0.25;
    /**AI时间间隔 */
    public static readonly AI_TIMER_TICK_TIME: number = 0.5;

    public static ServerKey(): string {
        if (IsInToolsMode()) {
            return "wIkOFc3QwBmwwefDKPgxeIele7JuQygD";
        }
        return GetDedicatedServerKeyV2(GameSetting.GAME_VERSION);
    }

    public static init() {
        GameSetting.gameRulesInit();
        GameSetting.gameModeInit();
        // GameSetting.gameFilterInit();
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

    public static gameRulesInit() {
        GameRules.SetHeroRespawnEnabled(true);
        GameRules.SetSameHeroSelectionEnabled(true);
        GameRules.SetHeroSelectionTime(99999);
        GameRules.SetHeroSelectPenaltyTime(0);
        GameRules.SetStrategyTime(0.5);
        GameRules.SetShowcaseTime(0);
        GameRules.SetPreGameTime(0);
        GameRules.SetPostGameTime(3000);
        GameRules.SetTreeRegrowTime(10);
        GameRules.SetGoldPerTick(0);
        GameRules.SetGoldTickTime(1);
        GameRules.SetUseBaseGoldBountyOnHeroes(false);
        GameRules.SetFirstBloodActive(false);
        GameRules.SetHideKillMessageHeaders(true);
        GameRules.SetUseUniversalShopMode(true);
        GameRules.SetStartingGold(GameSetting.GAME_START_GOLD);
        GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_GOODGUYS, GameSetting.GAME_MAX_PLAYER);
        GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_BADGUYS, GameSetting.GAME_MAX_PLAYER);
        GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_1, GameSetting.GAME_MAX_PLAYER);
        GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_2, GameSetting.GAME_MAX_PLAYER);
        GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_3, GameSetting.GAME_MAX_PLAYER);
        GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_4, GameSetting.GAME_MAX_PLAYER);
        GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_5, GameSetting.GAME_MAX_PLAYER);
        GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_6, GameSetting.GAME_MAX_PLAYER);
        GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_7, GameSetting.GAME_MAX_PLAYER);
        GameRules.SetCustomGameTeamMaxPlayers(DOTATeam_t.DOTA_TEAM_CUSTOM_8, GameSetting.GAME_MAX_PLAYER);
        GameRules.SetUseCustomHeroXPValues(true);
    }

    public static gameModeInit() {
        if (GameRules.Addon.Instance == null) {
            throw Error("GameRules.Addon.Instance == null");
        }
        // 默认英雄,跳过英雄选择界面
        GameRules.Addon.Instance.SetCustomGameForceHero(GameSetting.DEFAULT_PICKED_HERO);
        //#region  開啓后閃退
        // GameRules.Addon.Instance.SetUseCustomHeroLevels(true)
        //#endregion
        // GameRules.Addon.Instance.SetCustomHeroMaxLevel(HERO_MAX_LEVEL)
        // GameRules.Addon.Instance.SetCustomXPRequiredToReachNextLevel(HERO_XP_PER_LEVEL_TABLE)
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
        GameRules.Addon.Instance.SetMinimumAttackSpeed(GameSetting.MINIMUM_ATTACK_SPEED);
        GameRules.Addon.Instance.SetMaximumAttackSpeed(GameSetting.MAXIMUM_ATTACK_SPEED);
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
            return true
        }, this);
        GameMode.SetDamageFilter((event: DamageFilterEvent) => {
            let hAbility = EntIndexToHScript(event.entindex_inflictor_const || -1 as any)
            let hVictim = EntIndexToHScript(event.entindex_victim_const || -1 as any)
            let hAttacker = EntIndexToHScript(event.entindex_attacker_const || -1 as any) as BaseNpc_Plus;
            LogHelper.print(event)
            if (GameFunc.IsValid(hAttacker) && hAttacker != hVictim && event.damage > 0) {
                let fDamage = event.damage
                let iDamageType = event.damagetype_const
                let iPlayerID = hAttacker.GetPlayerOwnerID()
                if (PlayerResource.IsValidPlayerID(iPlayerID)) {
                    let hHero = PlayerResource.GetSelectedHeroEntity(iPlayerID)
                    if (hHero != hAttacker) {
                        if (iDamageType == DAMAGE_TYPES.DAMAGE_TYPE_NONE) {
                            iDamageType = DAMAGE_TYPES.DAMAGE_TYPE_PURE
                        }
                        let building = hAttacker.ETRoot as BuildingEntityRoot;
                        if (building && building.IsBattleUnit()) {
                            let round = building.GetPlayer().RoundManagerComp().getCurrentBoardRound();
                            if (building.IsIllusion()) {

                            }
                            round.AddRoundDamage(event.entindex_attacker_const + "", iDamageType, fDamage)
                        }
                    }
                }
            }
            return true
        }, this)
        GameMode.SetItemAddedToInventoryFilter((event: ItemAddedToInventoryFilterEvent) => {
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
