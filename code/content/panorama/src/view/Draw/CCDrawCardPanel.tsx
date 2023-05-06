import React from "react";
import { KVHelper } from "../../helper/KVHelper";

import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCDOTAScenePanel } from "../AllUIElement/CCDOTAScenePanel/CCDOTAScenePanel";
import { CCIcon_XClose } from "../AllUIElement/CCIcons/CCIcon_XClose";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCDrawCardBottomItem } from "./CCDrawCardBottomItem";

import { DrawConfig } from "../../../../scripts/tscripts/shared/DrawConfig";
import { ECombination } from "../../game/components/Combination/ECombination";
import "./CCDrawCardPanel.less";
import { CCDrawCardSloganItem } from "./CCDrawCardSloganItem";
import { CCDrawCardWantItem } from "./CCDrawCardWantItem";
interface ICCDrawCardPanel {
    cards: string[];
}


export class CCDrawCardPanel extends CCPanel<ICCDrawCardPanel> {

    onInitUI() {
        this.props.cards.forEach((card, index) => {
            this.UpdateState({ ["CardGroup" + index]: "1" })
        });
        this.ListenClassUpdate(GDrawComponent);
    }

    async SelectCard(itemname: string, index: number, b2Public: 0 | 1 = 0) {
        let r = await GGameScene.Local.DrawComp.SelectCard(index, itemname, b2Public);
        if (r) {
            let KV_DATA = KVHelper.KVData();
            let config = KV_DATA.building_unit_tower[itemname];
            if (config.HeroSelectSoundEffect) {
                Game.EmitSound(config.HeroSelectSoundEffect);
            }
            if (DrawConfig.BOnlySelectOnce) {
                this.props.cards.forEach((card, index) => {
                    this.UpdateState({ ["CardGroup" + index]: "0" })
                })
            }
            else {
                this.UpdateState({ ["CardGroup" + index]: "0" });
                for (let i = 0, len = this.props.cards.length; i < len; i++) {
                    if (i != index && this.GetState<string>("CardGroup" + i) == "1") {
                        return;
                    }
                }
            }
            this.hide();
        }
    }


    render() {
        return (<Panel ref={this.__root__} id="CC_DrawCardPanel" hittest={false} {...this.initRootAttrs()}>
            <CCPanel id="DrawBgImg" hittest={false} />
            <CCIconButton id="DrawCloseButton" marginRight="0px" icon={<CCIcon_XClose />} onactivate={() => { this.hide() }} />
            <CCPanel id="DrawBgBox" hittest={false}>
                {
                    this.props.cards.map((card, index) => {
                        let playerid = GGameScene.Local.BelongPlayerid;
                        let showlight = GBuildingEntityRoot.GetEntityByConfig(playerid, card) != null;
                        const iswanted = GDrawComponent.IsCardWanted(card);
                        const allsect = KVHelper.GetUnitSectLabels(card);
                        let bSect = false;
                        for (let i = 0; i < allsect.length; i++) {
                            let sectName = allsect[i];
                            let allcombs = ECombination.GetCombinationBySectName(playerid, sectName) || [];
                            if (allcombs.length > 0) {
                                bSect = true;
                                break;
                            }
                        }
                        return (
                            <CCPanel id="DrawCardGroup" key={index + ""} opacity={this.GetState<string>("CardGroup" + index)} >
                                <CCDOTAScenePanel className="DrawCardSceneBox"
                                    unit={card.replace("building", "npc_dota")}
                                    allowrotation={false}
                                    rotateonmousemove={false}
                                    // map="maps/scenes/rank_divine_ambient.vmap"
                                    showlight={showlight}
                                    // particleonly={true}
                                    // renderdeferred={false}
                                    onactivate={() => { this.SelectCard(card, index) }} >
                                    <CCDrawCardSloganItem bStarUp={showlight} bSect={(!showlight) && bSect} bWanted={iswanted} />
                                </CCDOTAScenePanel>
                                <CCDrawCardBottomItem
                                    unitname={card}
                                    drawIndex={index}
                                    onShare={() => {
                                        this.SelectCard(card, index, 1);
                                    }}
                                    onWanted={() => {
                                        GGameScene.Local.DrawComp.WantedChess(card, true);
                                    }}
                                    onLocked={(block) => {
                                        GGameScene.Local.DrawComp.LockChess(index, card, block);
                                    }}
                                />
                            </CCPanel>
                        )
                    })
                }
            </CCPanel>
            <CCDrawCardWantItem />
        </Panel>
        )
    }
}

