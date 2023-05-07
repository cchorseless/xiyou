
import React from "react";

import { CSSHelper } from "../../../helper/CSSHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { TipsHelper } from "../../../helper/TipsHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCItemImage.less";
import { CCItemLockStars } from "./CCItemLockStars";

interface ICCItemImage extends NodePropsData {
    itemname?: string,
    iUnlockStar?: number,
    contextEntityIndex?: ItemEntityIndex,
    showtooltip?: boolean,
    iLevel?: number,
    bShowAllLevelData?: boolean,
}

export class CCItemImage extends CCPanel<ICCItemImage> {

    static defaultProps = {
        itemname: "",
        contextEntityIndex: -1,
        iLevel: -1,
        showtooltip: false,
        iUnlockStar: -1,
    }

    getLevel() {
        const contextEntityIndex = this.props.contextEntityIndex!;
        const itemname = this.props.itemname!;
        const iLevel = this.props.iLevel!;
        if (iLevel == -1) {
            if (contextEntityIndex == -1) {
                return GToNumber(KVHelper.KVItems()[itemname]?.ItemBaseLevel) || 1;
            } else {
                return Abilities.GetLevel(contextEntityIndex);
            }
        }
        return iLevel;
    }




    render() {
        const contextEntityIndex = this.props.contextEntityIndex!;
        const itemname = this.props.itemname!;
        const iUnlockStar = this.props.iUnlockStar!;
        // 是否是多级物品
        const bIsMultiLevelItem = Items.IsMultiLevelItem(contextEntityIndex) || Items.IsMultiLevelItem(itemname);
        // 如果是召唤卡 稀有度
        const sCardRarity = (itemname.indexOf("item_building_") != -1) && Abilities.GetAbilityRarity(itemname!);
        // 物品等级
        const m_Level = this.getLevel();
        const m_ItemName = itemname ? itemname : Abilities.GetAbilityName(contextEntityIndex as any);
        return < Panel className="CCItemImage" ref={this.__root__}
            onmouseover={(self) => {
                if (this.props.showtooltip && m_ItemName != "item_blank") {
                    TipsHelper.ShowAbilityTooltip(self, m_ItemName, contextEntityIndex);
                }
            }}
            onmouseout={(self) => {
                if (this.props.showtooltip && m_ItemName != "item_blank") {
                    TipsHelper.HideAbilityTooltip(self);
                }
            }}
            {...this.initRootAttrs()}>
            {(m_ItemName != "" || contextEntityIndex > -1) && <DOTAItemImage id="DOTAItemImage" itemname={m_ItemName} contextEntityIndex={contextEntityIndex} showtooltip={false} scaling="stretch-to-fit-y-preserve-aspect" />}
            {
                // sCardTower && <Panel id="UniqueItemBorder" hittest={false}>
                //     <Image id="UniqueItemTower" src={sCardTower} scaling="stretch-to-cover-preserve-aspect" />
                // </Panel>
            }
            {sCardRarity && <Image id="CardRarityOverlay" className={"CardRarity_" + sCardRarity} />}
            {
                // sStarCardRarity && <Image id="StarCardRarityOverlay" className={"StarCardRarity_" + sStarCardRarity} />
            }
            {
                bIsMultiLevelItem && <Panel id="ItemRarityBorder" className={"RarityLevel" + m_Level} hittest={false}>
                    <Panel id="ItemRarityStars" hittest={false}>
                        {
                            [...Array(m_Level)].map((_, index) => {
                                return <Image id={"ItemStar" + (index + 1)} key={index} className={CSSHelper.ClassMaker(m_Level < 6 ? "ItemStar" : "ItemStar" + m_Level)} />
                            })
                        }
                    </Panel>
                </Panel>
            }
            {
                iUnlockStar > 0 && iUnlockStar < 10 &&
                <>
                    {/* <CCPanel id="ItemLockBg" hittest={false} />
                    <CCIcon_Lock align="center center" /> */}
                    <CCItemLockStars hittest={true} iUnlockStar={iUnlockStar} />
                </>

            }
        </Panel >

    }
}