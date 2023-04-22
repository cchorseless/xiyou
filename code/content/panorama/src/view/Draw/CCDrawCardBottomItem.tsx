import React from "react";
import { KVHelper } from "../../helper/KVHelper";
import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCIcon_CoinType } from "../AllUIElement/CCIcons/CCIcon_CoinType";
import { CCIcon_Share } from "../AllUIElement/CCIcons/CCIcon_Share";
import { CCIcon_Wanted } from "../AllUIElement/CCIcons/CCIcon_Wanted";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";

import { CCCombinationDesItem } from "../Combination/CCCombinationDesItem";
import "./CCDrawCardBottomItem.less";

interface ICCDrawCardBottomItem {
    unitname: string;
    drawIndex: number;
    onShare: () => void;
    onWanted: () => void;
    onLocked: (b: boolean) => void;
}
export class CCDrawCardBottomItem extends CCPanel<ICCDrawCardBottomItem> {



    render() {
        const unitname = this.props.unitname;
        // const block = GToBoolean(GGameScene.Local.DrawComp.tLockChess[this.props.drawIndex + ""]);
        let KV_DATA = KVHelper.KVData();
        let cardinfo = KV_DATA.building_unit_tower[unitname];
        if (cardinfo == null) {
            GLogHelper.warn(`${unitname} cant find unitinfo`)
        }
        let iteminfo = KV_DATA.building_item_card[cardinfo!.CardName];
        const Rarity = cardinfo?.Rarity || "A";
        // const iswanted = GDrawComponent.IsCardWanted(unitname);
        return (
            <Panel ref={this.__root__} id="CC_DrawCardBottomItem" className={Rarity} hittest={false} {...this.initRootAttrs()}>
                <CCPanel horizontalAlign="center" flowChildren="right">
                    <CCLabel textAlign={"center"} type="UnitName" localizedText={"#" + unitname} verticalAlign="center" height="20px" />
                    {/* <CCIcon_Wanted width="30px" height="30px" verticalAlign="center" visible={iswanted} tooltip={"#在愿望单内,购买至公共背包与其他玩家分享"} /> */}
                    <CCPanel marginLeft={"10px"} flowChildren="right" verticalAlign="center">
                        <CCIcon_CoinType width="30px" height="30px" verticalAlign="center" cointype={GEEnum.EMoneyType.Gold} />
                        <CCLabel type="Gold" text={"x" + iteminfo?.ItemCost} />
                    </CCPanel>
                </CCPanel>
                <CCPanel horizontalAlign="center" flowChildren="right" marginTop={"3px"}>
                    {
                        [1, 2, 3, 6].map((a, i) => {
                            let abilityname = cardinfo["Ability" + a] as string;
                            if (abilityname && abilityname != "ability_empty") {
                                let sectname = GJsonConfigHelper.GetAbilitySectLabel(abilityname)
                                // return <CCAbilityIcon key={"" + i} abilityname={abilityname} playerid={GGameScene.Local.BelongPlayerid} tipsInfo={{ level: 1 }} />
                                if (sectname) {
                                    return <CCCombinationDesItem key={"" + i} SectName={sectname} marginLeft={"10px"} ShowScepter={a == 6} />
                                }
                            }
                        })
                    }
                </CCPanel>
                <CCPanel horizontalAlign="center" flowChildren="right">
                    {/* <CCIconButton marginLeft={"10px"} icon={<CCIcon_Lock type={block ? "Tui7" : "Unlock"} />}
                        onactivate={() => {
                            this.props.onLocked(!block);
                            this.UpdateSelf();
                        }} tooltip={"#锁定不刷新"} /> */}
                    <CCIconButton marginLeft={"20px"} icon={<CCIcon_Share />} onactivate={() => { this.props.onShare() }} tooltip={"#购买至公共背包"} />
                    <CCIconButton marginLeft={"20px"} icon={<CCIcon_Wanted />} onactivate={() => { this.props.onWanted() }} tooltip={"#加入愿望单,通知其他玩家"} />
                </CCPanel>
            </Panel>
        )
    }
}