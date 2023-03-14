import React from "react";
import { ETEntitySystem } from "../../../../scripts/tscripts/shared/lib/Entity";
import { ECombination } from "../../game/components/Combination/ECombination";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCCombinationIcon } from "./CCCombinationIcon";
import { CCCombinationInfoDialog } from "./CCCombinationInfoDialog";
import "./CCCombinationSingleBottomItem.less";
export interface ICCCombinationSingleBottomItem {
    SectName: string;
    InstanceIdList: string[];

}

export class CCCombinationSingleBottomItem extends CCPanel<ICCCombinationSingleBottomItem> {

    onReady() {
        const InstanceIdList: string[] = this.props.InstanceIdList;
        let r = true;
        InstanceIdList.forEach(entityid => {
            let entity = ETEntitySystem.GetEntity(entityid) as ECombination;
            if (entity == null) {
                r = false;
            }
        })
        return r;
    }

    onInitUI() {
        let InstanceIdList: string[] = this.props.InstanceIdList;
        InstanceIdList.forEach(entityid => {
            let entity = ETEntitySystem.GetEntity(entityid) as ECombination;
            entity?.RegRef(this);
        })
    }

    getIcon() {
        const SectName = this.props.SectName;
        if (SectName == null) { return; };
        let data = GJSONConfig.CombinationConfig.getDataList()
        for (let info of data) {
            if (info.SectName == SectName) {
                return info.SectIcon;
            }
        }
        return ""
    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_CombinationSingleBottomItem");
        }
        const entityList = this.props.InstanceIdList.map((entityId, index) => { return this.GetStateEntity(ETEntitySystem.GetEntity(entityId) as ECombination) })
        const lastentity = entityList[entityList.length - 1]!
        if (lastentity.IsEmpty()) {
            return this.defaultRender("CC_CombinationSingleBottomItem");
        }
        const sectName = this.props.SectName;
        return (
            <Panel ref={this.__root__} id="CC_CombinationSingleBottomItem"  {...this.initRootAttrs()}>
                <CCPanel flowChildren="down" brightness={lastentity.IsActive() ? "1" : "0.3"} dialogTooltip={
                    {
                        cls: CCCombinationInfoDialog,
                        props: {
                            sectName: sectName,
                            playerid: lastentity.BelongPlayerid,
                        }
                    }
                } >
                    <CCPanel id="CombinationTagBox" flowChildren="down">
                        {
                            entityList.map((entity, index) => {
                                if (entity) {
                                    let lastCount = 0
                                    if (index < entityList.length - 1) {
                                        lastCount = entityList[index + 1]!.activeNeedCount;
                                    }
                                    const divCount = entity.activeNeedCount - lastCount;
                                    const activeCount = entity.uniqueConfigList.length - lastCount;
                                    return (
                                        <CCPanel id="CombinationTag" key={"" + index} >
                                            {[...Array(divCount)].map((a, b) => {
                                                return <CCPanel key={"" + b} height="6px" width={Math.floor(42 / divCount) + "px"} className={CSSHelper.ClassMaker("ImgTag", {
                                                    IsActive: b + 1 <= activeCount
                                                })} />
                                            })}
                                        </CCPanel>
                                    )
                                }
                            })
                        }

                    </CCPanel>
                    <CCCombinationIcon id="CombinationIcon" sectName={sectName} />
                </CCPanel>
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}