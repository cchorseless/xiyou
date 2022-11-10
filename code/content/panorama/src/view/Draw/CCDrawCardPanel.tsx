import React from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { KVHelper } from "../../helper/KVHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCIconButton } from "../allCustomUIElement/CCButton/CCIconButton";
import { CCDOTAScenePanel } from "../allCustomUIElement/CCDOTAScenePanel/CCDOTAScenePanel";
import { CCIcon_XClose } from "../allCustomUIElement/CCIcons/CCIcon_XClose";
import { CCImage } from "../allCustomUIElement/CCImage/CCImage";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCDrawCardBottomItem } from "./CCDrawCardBottomItem";

import "./CCDrawCardPanel.less";
interface ICCDrawCardPanel {
    cards: string[];
}


export class CCDrawCardPanel extends CCPanel<ICCDrawCardPanel> {

    onInitUI() {
        this.props.cards.forEach((card, index) => {
            this.UpdateState({ ["CardGroup" + index]: "1" })
        })
    }

    async SelectCard(itemname: string, index: number, b2Public: number = 0) {
        let r = await PlayerScene.Local.DrawComp.SelectCard(index, itemname, b2Public);
        if (r) {
            let KV_DATA = KVHelper.KVData();
            let config = KV_DATA.building_unit_tower[itemname];
            if (config.HeroSelectSoundEffect) {
                Game.EmitSound(config.HeroSelectSoundEffect);
            }
            this.UpdateState({ ["CardGroup" + index]: "0" });
            for (let i = 0, len = this.props.cards.length; i < len; i++) {
                if (i != index && this.GetState<string>("CardGroup" + i) == "1") {
                    return;
                }
            }
            this.hide();
        }
    }


    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_DrawCardPanel" hittest={false} {...this.initRootAttrs()}>
                <CCPanel id="DrawBgImg" hittest={false} />
                <CCIconButton marginRight="0px" icon={<CCIcon_XClose />} onactivate={() => { this.hide() }} />
                <CCPanel id="DrawBgBox" hittest={false}>
                    {
                        this.props.cards.map((card, index) => {
                            return (
                                <CCPanel id="DrawCardGroup" key={index + ""} opacity={this.GetState<string>("CardGroup" + index)} >
                                    <CCDOTAScenePanel className="DrawCardSceneBox" unit={card.replace("building", "npc_dota")} allowrotation={false} rotateonmousemove={false} onactivate={
                                        () => {
                                            this.SelectCard(card, index);
                                        }} />
                                    <CCDrawCardBottomItem unitname={card} onShare={() => {
                                        this.SelectCard(card, index, 1);
                                    }} onWanted={() => {

                                    }} />
                                </CCPanel>
                            )
                        })
                    }
                </CCPanel>

            </Panel>
        )
    }
}

