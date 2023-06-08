import React from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { NetHelper } from "../../helper/NetHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCDebugTool_SelectContainer } from "./CCDebugTool";

import { GameEnum } from "../../../../scripts/tscripts/shared/GameEnum";
import { CCEconItemImage } from "../AllUIElement/CCEconItem/CCEconItemImage";
import "./CCDebugTool_WearableBundlePicker.less";

/** 技能选择 */
interface ICCDebugTool_WearableBundlePicker {
    /** 窗口标题 */
    title: string;
    /** 分类 */
    toggleList?: {
        /** type是分类，后面实际显示的描述 */
        [toggleType: string]: string;
    };
    /** 过滤器 */
    filterFunc?: (toggleType: string, itemName: string) => boolean;
}
export class CCDebugTool_WearableBundlePicker extends CCPanel<ICCDebugTool_WearableBundlePicker> {
    state = {
        filterWord: "",
        toggleType: "",
        rawMode: false,
    };

    onInitUI() {
        this.addEvent();
    }
    addEvent() {
        const eventList = [
            GameEnum.GameEvent.dota_player_update_selected_unit,
            GameEnum.GameEvent.dota_player_update_query_unit,
        ]
        eventList.forEach(event => {
            this.addGameEvent(event, (e) => {
                this.UpdateSelf();
            });
        })
    }



    render() {
        const entityindex = Players.GetLocalPlayerPortraitUnit();
        const unitname = Entities.GetUnitName(entityindex).replace("_enemy_", "_hero_").replace("building_", "npc_dota_")
        const bundleNames: string[] = [];
        GJSONConfig.WearableConfig.getDataList().forEach(v => {
            if (v.usedByHeroes == unitname) {
                bundleNames.push(v.id)
            }
        })
        return (<Panel ref={this.__root__}   {...this.initRootAttrs()} hittest={false}>
            <CCDebugTool_SelectContainer
                title={this.props.title}
                toggleList={this.props.toggleList}
                onSearch={text => this.setState({ filterWord: text })}
                onToggleType={text => this.setState({ toggleType: text })}
                onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
                DomainPanel={this}

            >
                <CCPanel flowChildren="right-wrap" width="100%" scroll="y" >
                    {bundleNames.map((bundlename, index) => {
                        if (this.props.filterFunc) {
                            if (!this.props.filterFunc(this.state.toggleType, bundlename)) {
                                return;
                            }
                        }
                        if (this.state.filterWord != "") {
                            if (bundlename.search(new RegExp(this.state.filterWord, "gim")) == -1 && $.Localize("#DOTA_Tooltip_ability_" + bundlename).search(new RegExp(this.state.filterWord, "gim")) == -1) {
                                return;
                            }
                        }
                        return (<CCEconItemImage key={Math.random() + ""} marginLeft={"5px"} marginTop={"5px"} itemdef={bundlename} showName={true} onactivate={self => {
                            GLogHelper.print(bundlename, 11111111)
                            NetHelper.SendToLua(GameProtocol.Protocol.req_DebugAddWearableBundle, {
                                entityindex: entityindex,
                                bundlename: bundlename
                            })
                        }} />
                        );
                    })}
                </CCPanel>
            </CCDebugTool_SelectContainer>
        </Panel>
        );
    }
}