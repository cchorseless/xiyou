import React, { } from "react";
import { ECombination } from "../../game/components/Combination/ECombination";
import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { ET } from "../../libs/Entity";
import { CCImage } from "../allCustomUIElement/CCImage/CCImage";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import "./CCCombinationSingleBottomItem.less";
export interface ICCCombinationSingleBottomItem {
    combinationName: string;
    InstanceIdList: string[];

}

export class CCCombinationSingleBottomItem extends CCPanel<ICCCombinationSingleBottomItem> {

    onInitUI() {
        let InstanceIdList: string[] = this.props.InstanceIdList;
        InstanceIdList.forEach(entityid => {
            let entity = ET.EntityEventSystem.GetEntity(entityid) as ECombination;
            entity?.RegRef(this);
        })
    }

    getIcon() {
        const combinationName = this.props.combinationName;
        if (combinationName == null) { return; };
        let KV_DATA = KVHelper.KVData();
        let data = KV_DATA.building_combination_ability
        for (let k in data) {
            if (data[k].relation == combinationName) {
                return data[k].relationicon;
            }
        }
        return ""
    }

    render() {
        const entityList = this.props.InstanceIdList.map((entityId, index) => { return this.GetStateEntity(ET.EntityEventSystem.GetEntity(entityId) as ECombination) })
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_CombinationSingleBottomItem"    {...this.initRootAttrs()}>
                <CCPanel flowChildren="right">
                    <CCPanel id="CombinationIcon" backgroundImage={`url('file://{images}/combination/icon/${this.getIcon()}.png')`} />
                    <CCPanel >
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
                                        <CCPanel flowChildren="right" width="60px">
                                            {[...Array(divCount)].map((a, b) => {
                                                <CCPanel width={100 / divCount + "%"} className={CSSHelper.ClassMaker("ImgTag", {
                                                    IsActive: b + 1 <= activeCount
                                                })} />
                                            })}
                                        </CCPanel>
                                    )
                                }
                            })
                        }

                    </CCPanel>
                </CCPanel>
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}