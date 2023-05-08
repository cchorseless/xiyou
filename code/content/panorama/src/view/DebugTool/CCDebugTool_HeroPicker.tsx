import React from "react";
import { CombinationConfig } from "../../../../scripts/tscripts/shared/CombinationConfig";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { KVHelper } from "../../helper/KVHelper";
import { NetHelper } from "../../helper/NetHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCDropDownButton } from "../AllUIElement/CCButton/CCDropDownButton";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCTxtTable } from "../AllUIElement/CCTable/CCTxtTable";
import { CCUnitSmallIcon } from "../AllUIElement/CCUnit/CCUnitSmallIcon";
import { CCDebugTool_SelectContainer } from "./CCDebugTool";

/** 英雄选择 */
interface ICCDebugTool_HeroPicker {
    /** 单位名列表 */
    unitNames?: string[];
    /** 窗口标题 */
    title: string;
}
export class CCDebugTool_HeroPicker extends CCPanel<ICCDebugTool_HeroPicker> {
    state = {
        filterWord: "",
        toggleType: "",
        rawMode: false,
    };
    render() {
        const currarity = this.GetState<string>("rarity") || "All";
        const cursect = this.GetState<string>("cursect") || "All";
        const allSect = CombinationConfig.ESectNameList;
        let unitnames = GJSONConfig.BuildingLevelUpConfig.getDataList().map((info) => { return info.Id });
        unitnames.sort((a, b) => {
            return Entities.GetUnitRarityNumber(a) - Entities.GetUnitRarityNumber(b);
        });
        unitnames = unitnames.filter((name) => {
            if (currarity == "All") {
                return true;
            }
            return Entities.GetUnitRarity(name) == currarity;
        });
        unitnames = unitnames.filter((name) => {
            if (cursect == "All") {
                return true;
            }
            return KVHelper.GetUnitSectLabels(name).includes(cursect);
        });
        return (
            <Panel ref={this.__root__} id="CC_DebugTool_HeroPicker"  {...this.initRootAttrs()} hittest={false}>

                <CCDebugTool_SelectContainer
                    title={this.props.title}
                    hasFilter={true}
                    onSearch={text => this.setState({ filterWord: text })}
                    onToggleType={text => this.setState({ toggleType: text })}
                    onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
                    DomainPanel={this}
                >
                    <CCPanel className="CC_DebugTool_AbilityPicker" flowChildren="right-wrap" width="100%" scroll="y" >
                        {unitnames.map((unitName, index) => {
                            if (this.props.filterFunc) {
                                if (!this.props.filterFunc(this.state.toggleType, unitName)) {
                                    return;
                                }
                            }
                            if (this.state.filterWord != "") {
                                if (unitName.search(new RegExp(this.state.filterWord, "gim")) == -1 && $.Localize("#" + unitName).search(new RegExp(this.state.filterWord, "gim")) == -1) {
                                    return;
                                }
                            }
                            return (
                                <CCButton type="Empty" className="CC_DebugTool_AbilityPickerItem" key={index + ""} flowChildren="down" onactivate={self => {
                                    NetHelper.SendToLua(GameProtocol.Protocol.req_DebugAddHero, { unitname: unitName })
                                }}>
                                    {/* <DOTAHeroImage heroimagestyle={"portrait"} heroname={unitName} id="HeroPickerCardImage" scaling="stretch-to-fit-x-preserve-aspect" /> */}
                                    <CCUnitSmallIcon itemname={unitName} />
                                    <Label className="CC_DebugTool_AbilityPickerItemName" text={this.state.rawMode ? unitName : $.Localize("#" + unitName)} />
                                </CCButton>
                            );
                        })}
                    </CCPanel>
                </CCDebugTool_SelectContainer>
                <CCPanel id="HandBookSelect" flowChildren="right" width="500px" height="40px" x="150px" y="150px">
                    <CCLabel text={"稀有度："} marginLeft={"20px"} verticalAlign="center" />
                    <CCTxtTable id="HandBookSelectTable" verticalAlign="center" sepmarginleft={"5px"} list={["All", "C", "B", "A", "S"]}
                        onChange={(index: number, text: string) => {
                            this.UpdateState({ rarity: text })
                        }} />
                    <CCLabel text={"流派："} marginLeft={"10px"} verticalAlign="center" />
                    <CCDropDownButton placeholder={"All"} verticalAlign="center" onChange={(index) => {
                        this.UpdateState({ cursect: index == 0 ? "All" : allSect[index - 1] })
                    }} >
                        <CCLabel key={"all"} width="60px" text={"All"} />
                        {
                            allSect.map((sect) => {
                                return <CCLabel key={sect} width="60px" text={$.Localize("#lang_" + sect)} />
                            })
                        }
                    </CCDropDownButton>
                </CCPanel>
            </Panel>
        );
    }
}