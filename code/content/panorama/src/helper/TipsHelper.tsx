import { GEventHelper } from "../../../scripts/tscripts/shared/lib/GEventHelper";
import { CCTipsPanel } from "../view/AllUIElement/CCTips/CCTipsPanel";
import { KVHelper } from "./KVHelper";

export module TipsHelper {
    export enum ToolTipType {
        DOTARefreshAbilityTooltip = "DOTARefreshAbilityTooltip",
        UIShowCustomLayoutTooltip = 'UIShowCustomLayoutTooltip',
        UIShowCustomLayoutParametersTooltip = 'UIShowCustomLayoutParametersTooltip',
        DOTAShowAbilityInventoryItemTooltip = "DOTAShowAbilityInventoryItemTooltip",
        DOTAShowAbilityShopItemTooltip = "DOTAShowAbilityShopItemTooltip",
        DOTAShowAbilityTooltip = "DOTAShowAbilityTooltip",
        DOTAShowAbilityTooltipForEntityIndex = "DOTAShowAbilityTooltipForEntityIndex",
        DOTAShowAbilityTooltipForGuide = "DOTAShowAbilityTooltipForGuide",
        DOTAShowAbilityTooltipForHero = "DOTAShowAbilityTooltipForHero",
        DOTAShowAbilityTooltipForLevel = "DOTAShowAbilityTooltipForLevel",
        DOTAShowDroppedItemTooltip = "DOTAShowDroppedItemTooltip",
        DOTAShowBuffTooltip = "DOTAShowBuffTooltip",
        DOTAShowEconItemTooltip = "DOTAShowEconItemTooltip",
        DOTAShowProfileCardBattleCupTooltip = "DOTAShowProfileCardBattleCupTooltip",
        DOTAShowProfileCardTooltip = "DOTAShowProfileCardTooltip",
        DOTAShowRankTierTooltip = "DOTAShowRankTierTooltip",
        DOTAShowRuneTooltip = "DOTAShowRuneTooltip",
        DOTAShowTextTooltip = "DOTAShowTextTooltip",
        DOTAShowTextTooltipStyled = "DOTAShowTextTooltipStyled",
        DOTAShowTI10EventGameTooltip = "DOTAShowTI10EventGameTooltip",
        DOTAShowTitleImageTextTooltip = "DOTAShowTitleImageTextTooltip",
        DOTAShowTitleImageTextTooltipStyled = "DOTAShowTitleImageTextTooltipStyled",
        /** 标题,文本 */
        DOTAShowTitleTextTooltip = "DOTAShowTitleTextTooltip",
        DOTAShowTitleTextTooltipStyled = "DOTAShowTitleTextTooltipStyled",
        //#region 隐藏
        UIHideCustomLayoutTooltip = 'UIHideCustomLayoutTooltip',
        UIHideCustomLayoutParametersTooltip = 'UIHideCustomLayoutParametersTooltip',
        DOTAHideAbilityInventoryItemTooltip = "DOTAHideAbilityInventoryItemTooltip",
        DOTAHideAbilityShopItemTooltip = "DOTAHideAbilityShopItemTooltip",
        DOTAHideAbilityTooltip = "DOTAHideAbilityTooltip",
        DOTAHideAbilityTooltipForEntityIndex = "DOTAHideAbilityTooltipForEntityIndex",
        DOTAHideAbilityTooltipForGuide = "DOTAHideAbilityTooltipForGuide",
        DOTAHideAbilityTooltipForHero = "DOTAHideAbilityTooltipForHero",
        DOTAHideAbilityTooltipForLevel = "DOTAHideAbilityTooltipForLevel",
        DOTAHideBuffTooltip = "DOTAHideBuffTooltip",
        DOTAHideEconItemTooltip = "DOTAHideEconItemTooltip",
        DOTAHideProfileCardBattleCupTooltip = "DOTAHideProfileCardBattleCupTooltip",
        DOTAHideProfileCardTooltip = "DOTAHideProfileCardTooltip",
        DOTAHideRankTierTooltip = "DOTAHideRankTierTooltip",
        DOTAHideRuneTooltip = "DOTAHideRuneTooltip",
        DOTAHideTextTooltip = "DOTAHideTextTooltip",
        DOTAHideTextTooltipStyled = "DOTAHideTextTooltipStyled",
        DOTAHideTI10EventGameTooltip = "DOTAHideTI10EventGameTooltip",
        DOTAHideTitleImageTextTooltip = "DOTAHideTitleImageTextTooltip",
        DOTAHideTitleImageTextTooltipStyled = "DOTAHideTitleImageTextTooltipStyled",
        DOTAHideTitleTextTooltip = "DOTAHideTitleTextTooltip",
        DOTAHideTitleTextTooltipStyled = "DOTAHideTitleTextTooltipStyled",
        //#endregion
    }

    /**
     * 绑定tooltip
     * @param panel
     * @param tipType
     * @param args
     * @returns
     */
    export function Bind(panel: PanelBase, tipType: ToolTipType, ...args: any[]): void {
        if (!panel) { return };
        panel.SetPanelEvent('onmouseover', () => {
            $.DispatchEvent(tipType, panel, ...args)
        });
        panel.SetPanelEvent('onmouseout', () => {
            $.DispatchEvent(tipType.replace('Show', 'Hide'), panel)
        })
    }
    export function showErrorMessage(msg: string, sound = "General.CastFail_Custom") {
        if (Game.GetState() < DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME) {
            CCTipsPanel.ShowOne(msg, sound)
        }
        else {
            GameUI.SendCustomHUDError(msg, sound);
        }
    }


    export function ShowAbilityTooltip(panel: Panel, abilityname: string, abilityEntityIndex: ItemEntityIndex | AbilityEntityIndex = -1 as any, inventoryslot = -1, level = -1) {
        if (typeof (panel) != "object" || typeof (panel.IsValid) != "function" || !panel.IsValid()) {
            throw "ShowAbilityTooltip must have a panel parameter!";
        }
        if (typeof (abilityname) != "string") {
            throw "abilityname is not a string type!";
        }
        // if (GameUI.IsControlDown()) {
        let tAbility = KVHelper.KVAbilitys()[abilityname] as any;
        let tItem = KVHelper.KVItems()[abilityname];
        let tData = tAbility || tItem;
        let bIsItem = (tData != tAbility && tData == tItem);
        let entityindex = abilityEntityIndex as EntityIndex;
        // if (entityindex !== -1) {
        //     entityindex = Abilities.GetCaster(abilityEntityIndex)
        // }
        if (entityindex != -1 && inventoryslot != -1) {
            $.DispatchEvent("DOTAShowAbilityInventoryItemTooltip", panel, entityindex, inventoryslot);
        } else if (entityindex != -1 && bIsItem) {
            $.DispatchEvent("DOTAShowAbilityShopItemTooltip", panel, abilityname, "", entityindex);
        } else if (entityindex != -1) {
            $.DispatchEvent("DOTAShowAbilityTooltipForEntityIndex", panel, abilityname, entityindex);
        } else if (level != -1) {
            $.DispatchEvent("DOTAShowAbilityTooltipForLevel", panel, abilityname, level);
        } else {
            $.DispatchEvent("DOTAShowAbilityTooltip", panel, abilityname);
        }
        return;
        // }
        $.DispatchEvent("UIShowCustomLayoutParametersTooltip", panel, "AbilityTooltiop", "file://{resources}/layout/custom_game/tooltips/tooltip_ability/tooltip_ability.xml", "abilityname=" + abilityname + "&entityindex=" + entityindex + "&inventoryslot=" + inventoryslot + "&level=" + level);
    };

    export function HideAbilityTooltip(panel: Panel) {
        if (typeof (panel) != "object" || typeof (panel.IsValid) != "function" || !panel.IsValid()) {
            throw "ShowAbilityTooltip must have a panel parameter!";
        }
        // if (GameUI.IsControlDown()) {
        $.DispatchEvent("DOTAHideAbilityTooltip", panel);
        return;
        // }
        $.DispatchEvent("UIHideCustomLayoutTooltip", panel, "AbilityTooltiop");
    };
    export function RefreshAbilityTooltip() {
        GEventHelper.FireEvent(TipsHelper.ToolTipType.DOTARefreshAbilityTooltip, null, null)
    }

}
