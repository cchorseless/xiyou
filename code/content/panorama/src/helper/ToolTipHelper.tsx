export module ToolTipHelper {


    export enum ToolTipType {
        UIShowCustomLayoutTooltip = 'UIShowCustomLayoutTooltip',
        UIShowCustomLayoutParametersTooltip = 'UIShowCustomLayoutParametersTooltip',
        DOTAShowAbilityInventoryItemTooltip = "DOTAShowAbilityInventoryItemTooltip",
        DOTAShowAbilityShopItemTooltip = "DOTAShowAbilityShopItemTooltip",
        DOTAShowAbilityTooltip = "DOTAShowAbilityTooltip",
        DOTAShowAbilityTooltipForEntityIndex = "DOTAShowAbilityTooltipForEntityIndex",
        DOTAShowAbilityTooltipForGuide = "DOTAShowAbilityTooltipForGuide",
        DOTAShowAbilityTooltipForHero = "DOTAShowAbilityTooltipForHero",
        DOTAShowAbilityTooltipForLevel = "DOTAShowAbilityTooltipForLevel",
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

}