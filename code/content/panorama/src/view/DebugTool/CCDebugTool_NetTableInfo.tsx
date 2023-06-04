import React from "react";
import { ETEntitySystem } from "../../../../scripts/tscripts/shared/lib/Entity";
import { BaseEntityRoot } from "../../libs/BaseEntityRoot";
import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCDebugTool_SelectContainer } from "./CCDebugTool";

/** 网表信息面板 */
export class CCDebugTool_NetTableInfo extends CCPanel {
    state = {
        unitIndex: -1 as EntityIndex, filterWord: "",
        toggleType: "",
        rawMode: false,
    };
    onInitUI() { }

    render() {
        const curentity = this.GetState<string>("curentity") || "";
        const allkeys = Object.keys(ETEntitySystem.AllTypeEntity);
        const entitys = ETEntitySystem.AllTypeEntity[curentity] || [];
        const entity = entitys[0];
        const isCurroot = entity instanceof BaseEntityRoot;
        allkeys.sort()
        return (<Panel ref={this.__root__} id="CC_DebugTool_NetTableInfo"   {...this.initRootAttrs()} hittest={false}>
            <CCDebugTool_SelectContainer
                title={"网表信息面板"}
                width="800px"
                height="620px"
                hasRawMode={false}
                hasToggleSize={false}
                hasFilter={true}
                onSearch={text => this.setState({ filterWord: text })}
                DomainPanel={this}
            >
                <CCPanel flowChildren="right">
                    <CCPanel flowChildren="down" scroll={"y"} width="400px">
                        {
                            allkeys.map((key, index) => {
                                if (this.props.filterFunc) {
                                    if (!this.props.filterFunc(this.state.toggleType, key)) {
                                        return;
                                    }
                                }
                                if (this.state.filterWord != "") {
                                    if (key.search(new RegExp(this.state.filterWord, "gim")) == -1 && $.Localize("#" + key).search(new RegExp(this.state.filterWord, "gim")) == -1) {
                                        return;
                                    }
                                }
                                // const entitys = ETEntitySystem.AllTypeEntity[key];
                                // const entity = entitys[0];
                                // const isroot = entity instanceof BaseEntityRoot;
                                return <CCIconButton key={index + ""} width="100%" onactivate={() => { this.UpdateState({ curentity: key }) }}>
                                    <Label text={`${key}  count=[${ETEntitySystem.AllTypeEntity[key].length}] `} />
                                </CCIconButton>

                            })


                        }
                    </CCPanel>
                    <CCPanel flowChildren="down" width="400px" scroll={"y"}>
                        {
                            isCurroot ? <CCPanel flowChildren="down">
                                {
                                    entitys.map((_entity, _index) => {
                                        const _en = _entity as BaseEntityRoot;
                                        return <CCLabel key={_index + ""} color="#FFFFFF" marginTop={"20px"} text={`------EntityId:${_en.EntityId}  configid:${_en.ConfigID}`} />
                                    })
                                }
                            </CCPanel> : <CCPanel flowChildren="down">
                                {
                                    entitys.length > 0 && entitys.map((_entity, _index) => {
                                        const _en = _entity;
                                        let str = "";
                                        for (let k in _en) {
                                            str += `${k} = ${(_en as any)[k]} \n`
                                        }
                                        str += "--------------------------\n";
                                        return <CCLabel key={_index + ""} color="#FFFFFF" marginTop={"20px"} text={str} />
                                    })
                                }
                            </CCPanel>
                        }
                    </CCPanel>
                </CCPanel>



            </CCDebugTool_SelectContainer>
        </Panel>
        );
    }
}