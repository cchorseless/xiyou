import React from "react";
import { DrawConfig } from "../../../../scripts/tscripts/shared/DrawConfig";
import { KVHelper } from "../../helper/KVHelper";
import { CCIcon_XClose } from "../AllUIElement/CCIcons/CCIcon_XClose";
import { CCItemImage } from "../AllUIElement/CCItem/CCItemImage";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCDrawCardWantItem.less";

interface ICCDrawCardWantItem {
}


export class CCDrawCardWantItem extends CCPanel<ICCDrawCardWantItem> {

    onReady() {
        return GToBoolean(GGameScene.Local.DrawComp);
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.DrawComp)
    }
    render() {
        return (<Panel className="CCDrawCardWantItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            {
                [...Array(DrawConfig.iWashCardMax)].map((_, index) => {
                    const cardname = GGameScene.Local.DrawComp.tWashCards[index];
                    let itemname: string | null = null;
                    if (cardname) {
                        itemname = KVHelper.GetUnitDataForKey(cardname, "CardName") as string;
                    }
                    return <CCPanel className="CardWantSlotItem" key={index + ""}>
                        <Panel id="BackPackSlotBorder" />
                        {(itemname != null && itemname != "") && <CCItemImage itemname={itemname} />}
                        {(itemname != null && itemname != "") && <CCIcon_XClose
                            width="20px" height="20px"
                            tooltip="移除心愿单"
                            align="right bottom" onactivate={() => {
                                GGameScene.Local.DrawComp.WantedChess(cardname, false)
                            }} />}
                    </CCPanel>
                })
            }
        </Panel>)
    }
}