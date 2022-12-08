
import React, { useState } from "react";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import { AbilityHelper, ItemHelper, UnitHelper } from "../../../helper/DotaEntityHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";

import "./CCItemImage.less";

interface ICCItemImage extends NodePropsData {
    itemname?: string,
    iUnlockStar?: number,
    contextEntityIndex?: ItemEntityIndex,
    showtooltip?: boolean,
    iLevel?: number,
    bShowAllLevelData?: boolean,
}

export class CCItemImage extends CCPanel<ICCItemImage> {

    render() {
        const contextEntityIndex = this.props.contextEntityIndex;
        const itemname = this.props.itemname;
        const sCardRarity = ItemHelper.GetItemRarity(itemname!);

        const m_ItemName = itemname ? itemname : Abilities.GetAbilityName(contextEntityIndex as any);
        return < Panel className="CC_ItemImage" ref={this.__root__}  {...this.initRootAttrs()}>
            {!(m_ItemName == "" && contextEntityIndex == -1) && <DOTAItemImage id="DOTAItemImage" itemname={m_ItemName} contextEntityIndex={contextEntityIndex} showtooltip={false} scaling="stretch-to-fit-y-preserve-aspect" />}
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
                // bIsMultiLevelItem && <Panel id="ItemRarityBorder" className={"RarityLevel" + m_Level} hittest={false}>
                //     <Panel id="ItemRarityStars" hittest={false}>
                //         <ReactUtils.Repeat iTime={m_Level < 6 ? m_Level : 1} >
                //             {index => <Image id={"ItemStar" + (index + 1)} key={index} className={classNames(m_Level < 6 ? "ItemStar" : "ItemStar" + m_Level)} />}
                //         </ReactUtils.Repeat>
                //     </Panel>
                // </Panel>
            }
            {
                // iUnlockStar && iUnlockStar > 0 &&
                // <Panel id="ItemLockStars" hittest={true}>
                //     <ReactUtils.Repeat iTime={iUnlockStar} >
                //         {index => <Image key={index} className="ItemLockStar" />}
                //     </ReactUtils.Repeat>
                // </Panel>
            }
        </Panel >

    }
}