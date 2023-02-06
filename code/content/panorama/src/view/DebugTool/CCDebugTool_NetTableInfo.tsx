import React from "react";
import { ETEntitySystem } from "../../../../scripts/tscripts/shared/lib/Entity";
import { BaseEntityRoot } from "../../libs/BaseEntityRoot";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCDebugTool_SelectContainer } from "./CCDebugTool";

/** 网表信息面板 */
export class CCDebugTool_NetTableInfo extends CCPanel {
    state = { unitIndex: -1 as EntityIndex };
    onInitUI() { }

    render() {
        const allkeys = Object.keys(ETEntitySystem.AllTypeEntity);
        allkeys.sort()
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_DebugTool_NetTableInfo"   {...this.initRootAttrs()} hittest={false}>
                <CCDebugTool_SelectContainer
                    title={"网表信息面板"}
                    width="480px"
                    height="620px"
                    hasRawMode={false}
                    hasToggleSize={false}
                    hasFilter={false}
                    DomainPanel={this}
                >
                    <CCPanel flowChildren="down" scroll={"y"} width="100%">
                        {
                            allkeys.map((key, index) => {
                                const entitys = ETEntitySystem.AllTypeEntity[key];
                                const entity = entitys[0];
                                const isroot = entity instanceof BaseEntityRoot;
                                return <Label key={index + ""} text={`${key}  count=[${ETEntitySystem.AllTypeEntity[key].length}] `} >
                                    {
                                        isroot && <CCPanel flowChildren="down">
                                            {
                                                entitys.map((_entity, _index) => {
                                                    const _en = _entity as BaseEntityRoot;
                                                    const marginTop = _index == 0 ? "20px" : "0px";
                                                    return <CCLabel key={_index + ""} color="#FFFFFF" marginTop={marginTop} text={`------EntityId:${_en.EntityId}  configid:${_en.ConfigID}`} />
                                                })
                                            }
                                        </CCPanel>
                                    }
                                </Label>
                            })


                        }
                    </CCPanel>
                </CCDebugTool_SelectContainer>
            </Panel>
        );
    }
}