import React from "react";
import { FuncHelper } from "../../../helper/FuncHelper";
import { CCLabel } from "../CCLabel/CCLabel";
import { CCPanel } from "../CCPanel/CCPanel";
import { CCProgressBar } from "../CCProgressBar/CCProgressBar";
import "./CCHealthMana.less";

interface IHealthMana extends NodePropsData {
    entityIndex: EntityIndex,
    noShowHealth?: boolean,
    noShowMana?: boolean,
}

export class CCHealthMana extends CCPanel<IHealthMana> {
    static defaultProps = {
        noShowHealth: false,
        noShowMana: false,
    }

    onStartUI() {
        GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
            const entityIndex = this.props.entityIndex;
            this.UpdateState({
                curhp: Entities.GetHealth(entityIndex),
                maxhp: Entities.GetMaxHealth(entityIndex),
                hp_regen: Entities.GetHealthThinkRegen(entityIndex).toFixed(1),
                curmana: Entities.GetMana(entityIndex),
                maxmana: Entities.GetMaxMana(entityIndex),
                mana_regen: Entities.GetManaThinkRegen(entityIndex).toFixed(1),
            });
            return 1;
        }))

    }



    render() {
        const { noShowHealth, noShowMana, entityIndex } = this.props;
        const curhp = this.GetState<number>("curhp", 0);
        const maxhp = this.GetState<number>("maxhp", 1);
        const curmana = this.GetState<number>("curmana", 0);
        const maxmana = this.GetState<number>("maxmana", 1);
        const hp_regen = this.GetState<number>("hp_regen", 0);
        const mana_regen = this.GetState<number>("mana_regen", 1);
        return (
            <Panel className="CCHealthMana" ref={this.__root__}  {...this.initRootAttrs()}>
                <CCProgressBar id="HealthProgress" value={curhp} max={maxhp}>
                    <CCLabel id="HealthProgress_Label" text={`${curhp} / ${maxhp}`} tooltip="当前气血" />
                    <Label id="HealthProgressRegen_Label" text={`${FuncHelper.SignNumber(hp_regen)} `} />
                </CCProgressBar>
                <CCProgressBar id="ManaProgress" value={curmana} max={maxmana} color="Blue" marginTop={"5px"}>
                    <CCLabel id="ManaProgress_Label" text={`${curmana} / ${maxmana}`} tooltip="当前魔法" />
                    <Label id="ManaProgressRegen_Label" text={`${FuncHelper.SignNumber(mana_regen)} `} />
                </CCProgressBar>
                {this.props.children}
                {this.__root___childs}
            </Panel>

        )
    }
}


