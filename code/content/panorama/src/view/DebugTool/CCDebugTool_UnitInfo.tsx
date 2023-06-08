import React from "react";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCDebugTool_SelectContainer } from "./CCDebugTool";

/** 单位信息面板 */
export class CCDebugTool_UnitInfo extends CCPanel {
    state = { unitIndex: -1 as EntityIndex };
    onInitUI() {
        GTimerHelper.AddFrameTimer(5, GHandler.create(this, () => {
            const unitIndex = Players.GetLocalPlayerPortraitUnit();
            this.UpdateState({ unitIndex: unitIndex });
            this.UpdateState({ position: this.getPosition() });
            this.UpdateState({ forward: this.getForward() });
            this.UpdateState({ unitname: (`(${unitIndex})` + Entities.GetUnitName(unitIndex)) });
            this.UpdateState({ hp: (Entities.GetHealth(unitIndex) + "/" + Entities.GetMaxHealth(unitIndex)) });
            this.UpdateState({ mp: (Entities.GetMana(unitIndex) + "/" + Entities.GetMaxMana(unitIndex)) });
            this.UpdateState({ buff: ([...Array(Entities.GetNumBuffs(unitIndex))]) });
            return 5
        }))
    }


    getPosition = () => {
        let result = "";
        const position = Entities.GetAbsOrigin(this.state.unitIndex);
        if (position) {
            result = `${Number(position[0])}, ${Number(position[1])}, ${Number(position[2])}`;
        }
        return result;
    };
    getForward = () => {
        let result = "";
        const position = Entities.GetForward(this.state.unitIndex);
        if (position) {
            result = `${Number(position[0])}, ${Number(position[1])}, ${Number(position[2])}`;
        }
        this.UpdateState({ forward: result });
        return result;
    };

    render() {
        const unitIndex = this.GetState<EntityIndex>("unitIndex");
        const position = this.GetState<string>("position");
        const forward = this.GetState<string>("forward");
        const unitname = this.GetState<string>("unitname");
        const hp = this.GetState<string>("hp");
        const mp = this.GetState<string>("mp");
        const buff = this.GetState<number[]>("buff");
        return (<Panel ref={this.__root__} id="CC_DebugTool_UnitInfo"   {...this.initRootAttrs()} hittest={false}>
            <CCDebugTool_SelectContainer
                title={"单位信息面板"}
                width="480px"
                height="620px"
                hasRawMode={false}
                hasToggleSize={false}
                hasFilter={false}
                DomainPanel={this}
            >
                <CCPanel flowChildren="down">
                    <Label text={"单位名：" + unitname} />
                    <Label text={"位置：" + position} />
                    <Label text={"朝向：" + forward} />
                    <Label text={"生命：" + hp} />
                    <Label text={"魔法：" + mp} />
                    <Label text={"Modifier："} />
                    {buff?.map((_, index) => {
                        return <Label key={index} text={"		" + Buffs.GetName(unitIndex, Entities.GetBuff(unitIndex, index))} />
                    })}
                </CCPanel>
            </CCDebugTool_SelectContainer>
        </Panel>
        );
    }
}