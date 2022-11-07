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
        let r = await PlayerScene.Local.DrawComp.SelectCard(index, itemname);
        if (r) {
            let KV_DATA = KVHelper.KVData();
            let config = KV_DATA.building_unit_tower[itemname];
            if (config.HeroSelectSoundEffect) {
                Game.EmitSound(config.HeroSelectSoundEffect);
            }
            this.UpdateState({ ["CardGroup" + index]: "0" });
        }
    }


    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_DrawCardPanel" hittest={false} {...this.initRootAttrs()}>
                <CCPanel id="DrawBgImg" >
                    <CCIconButton horizontalAlign="right" verticalAlign="top" type={this.props.type} icon={<CCIcon_XClose type={this.props.type} />} onactivate={() => { this.close() }} />
                </CCPanel>
                {
                    this.props.cards.map((card, index) => {
                        return (
                            <CCPanel id="DrawCardGroup" key={index + ""} opacity={this.GetState<string>("CardGroup" + index)} >
                                <CCDOTAScenePanel className="DrawCardSceneBox" unit={card} allowrotation={false} rotateonmousemove={false} onactivate={
                                    () => {
                                        this.SelectCard(card, index);
                                    }} />
                                <CCDrawCardBottomItem unitname={card} />
                            </CCPanel>
                        )
                    })
                }
            </Panel>
        )
    }
}

