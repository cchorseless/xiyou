import React from "react";
import { DrawConfig } from "../../../../scripts/tscripts/shared/DrawConfig";
import { NetHelper } from "../../helper/NetHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelBG } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCCombinationInfoDialog } from "../Combination/CCCombinationInfoDialog";
import "./CCDrawSectPanel.less";
interface ICCDrawSectPanel {
    cards: string[];
}


export class CCDrawSectPanel extends CCPanel<ICCDrawSectPanel> {

    onStartUI() {
        this.__root__.current!.AddClass("PopUpEffect")
    }

    onSelectSect(index: number, itemName?: string) {
        NetHelper.SendToLua(DrawConfig.EProtocol.DrawSectSelected, {
            index: index,
            itemName: itemName
        });
        this.close();
    }

    render() {
        const SectSelection = this.props.cards || []
        return (<Panel ref={this.__root__} className="CCDrawSectPanel" hittest={false} {...this.initRootAttrs()}>
            <CCPanelBG type="Tui3">
                <CCPanel flowChildren="down" margin="20px 20px">
                    <CCLabel className="SectTitle" text={"流派倾向"} />
                    <CCPanel flowChildren="right" horizontalAlign="center">
                        {SectSelection.map((itemName, index) => {
                            return (
                                <CCIconButton key={index + ""} className="SectContainer" onactivate={() => this.onSelectSect(index, itemName)}>
                                    <CCCombinationInfoDialog playerid={GGameScene.Local.BelongPlayerid} sectName={itemName} showBg={true} showSectName={true} />
                                </CCIconButton>
                            );
                        })}
                    </CCPanel>
                    <CCPanel flowChildren="right" horizontalAlign="center">
                        {/* <EOM_Button color="Blue" text={"刷新"} onactivate={() => onActive(undefined, 1)} /> */}
                        <CCButton color="Blue" text={"随机"} onactivate={() => this.onSelectSect(-1)} tooltip="#Tooltip_SectRandom" />
                    </CCPanel>
                    <CCLabel type="UnitName" text={"将从选择的流派中随机抽取2个棋子加入场上"} horizontalAlign="center" marginTop={"10px"} color="white" />
                </CCPanel>

            </CCPanelBG>
        </Panel>)
    }
}