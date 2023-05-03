
import React from "react";
import { ECombination } from "../../game/components/Combination/ECombination";
import { CCIcon_Scepter } from "../AllUIElement/CCIcons/CCIcon_Scepter";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCCombinationIcon } from "./CCCombinationIcon";
import { CCCombinationInfoDialog } from "./CCCombinationInfoDialog";

interface IProps extends NodePropsData {
    SectName: string;
    ShowScepter?: boolean;
}

export class CCCombinationDesItem extends CCPanel<IProps> {

    render() {

        const sectName = this.props.SectName;
        const ShowScepter = this.props.ShowScepter;
        const playerid = GGameScene.Local.BelongPlayerid;
        let allcombs: ECombination[] = [];
        if (playerid !== -1) {
            allcombs = ECombination.GetCombinationBySectName(playerid, sectName) || [];
        }
        let SectNameHeader = $.Localize("#lang_" + sectName).substring(0, 2);
        if (allcombs.length > 0) {
            let lastcomb = allcombs[0]
            SectNameHeader += `(${lastcomb.uniqueConfigList.length}/${lastcomb.activeNeedCount})`
        }
        return (
            <Panel className="CCCombinationDesItem" ref={this.__root__} {...this.initRootAttrs()}>
                <CCPanel flowChildren="down" dialogTooltip={
                    {
                        cls: CCCombinationInfoDialog,
                        props: {
                            showBg: true,
                            sectName: sectName,
                            playerid: playerid,
                            showSectName: true,
                        }
                    }}
                >
                    <CCLabel horizontalAlign="center" fontSize="16px" text={SectNameHeader} />
                    <CCCombinationIcon id="CombinationIcon" horizontalAlign="center" sectName={sectName} >
                        {
                            ShowScepter && <CCIcon_Scepter on={true} width="25px" height="25px" align="right bottom" />
                        }
                    </CCCombinationIcon>
                </CCPanel>
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}
