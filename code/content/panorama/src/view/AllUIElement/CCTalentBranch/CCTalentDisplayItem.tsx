import React, { createRef } from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import { CCTalentBranch } from "./CCTalentBranch";
import "./CCTalentDisplayItem.less";
export interface ICCTalentDisplayItem {
    CurSelectUnit: EntityIndex;
}

export class CCTalentDisplayItem extends CCPanel<ICCTalentDisplayItem> {

    activeTalent(talentIndex: number, isactive: boolean) {

        let p: Panel = this.talentpanel.current!;
        let cls = talentIndex % 2 == 0 ? "LeftBranchPip" : "RightBranchPip";;
        switch (talentIndex) {
            case 0:
            case 1:
                p = p.FindChildTraverse("StatRow10")!;
                break;
            case 2:
            case 3:
                p = p.FindChildTraverse("StatRow15")!;
                break;
            case 4:
            case 5:
                p = p.FindChildTraverse("StatRow20")!;
                break;
            case 6:
            case 7:
                p = p.FindChildTraverse("StatRow25")!;
                break;
        }
        p.FindChildrenWithClassTraverse(cls).forEach(e => {
            e.style.opacity = isactive ? "1" : "0";
        })
    }

    talentpanel = createRef<Panel>();

    onStartUI() {
        this.talentpanel.current!.style.marginBottom = "0px";
        this.talentpanel.current!.style.verticalAlign = "bottom";
    }

    render() {
        const iLocalPortraitUnit = this.props.CurSelectUnit;
        const showLearned = Entities.GetPlayerOwnerID(iLocalPortraitUnit) == Players.GetLocalPlayer();
        return (
            <Panel className="CCTalentDisplayItem" ref={this.__root__}      {...this.initRootAttrs()}>
                <CCPanel dialogTooltip={{
                    cls: CCTalentBranch,
                    props: { unitName: Entities.GetUnitName(iLocalPortraitUnit), showLearned: showLearned },
                    posRight: false,

                }}>
                    <GenericPanel type="DOTAHudTalentDisplay" id="StatBranch" className="ShowStatBranch" ref={this.talentpanel} />
                </CCPanel>
                {/* <CCPanel flowChildren="down">
                    <CCPanel className="StatBranchContainer">
                        <Panel id="StatBranchBG" />
                        <Panel id="StatBranchGraphics" require-composition-layer={true} always-cache-composition-layer={true}>
                            <Panel id="StatBranchChannel">
                                <Panel id="StatPipContainer" className="">
                                    <Panel id="StatRow25" className="StatBranchRow">
                                        <Panel className="StatBranchPip LeftBranchPip" />
                                        <Panel className="StatBranchPip RightBranchPip" />
                                    </Panel>
                                    <Panel id="StatRow20" className="StatBranchRow">
                                        <Panel className="StatBranchPip LeftBranchPip" />
                                        <Panel className="StatBranchPip RightBranchPip" />
                                    </Panel>
                                    <Panel id="StatRow15" className="StatBranchRow">
                                        <Panel className="StatBranchPip LeftBranchPip" />
                                        <Panel className="StatBranchPip RightBranchPip" />
                                    </Panel>
                                    <Panel id="StatRow10" className="StatBranchRow">
                                        <Panel className="StatBranchPip LeftBranchPip" />
                                        <Panel className="StatBranchPip RightBranchPip" />
                                    </Panel>
                                </Panel>
                            </Panel>
                        </Panel>
                    </CCPanel>
                    <Label id="TalentName3" className="TalentName" text="{s:name_3}" />
                    <Label id="TalentName2" className="TalentName" text="{s:name_2}" />
                    <Label id="TalentName1" className="TalentName" text="{s:name_1}" />
                    <Label id="TalentName0" className="TalentName" text="{s:name_0}" />
                </CCPanel> */}
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}