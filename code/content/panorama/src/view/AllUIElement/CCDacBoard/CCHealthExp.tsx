import React from "react";
import { FuncHelper } from "../../../helper/FuncHelper";
import { CCLabel } from "../CCLabel/CCLabel";
import { CCPanel } from "../CCPanel/CCPanel";
import { CCProgressBar } from "../CCProgressBar/CCProgressBar";
import "./CCHealthExp.less";

interface IHealthExp extends NodePropsData {
    entityIndex: EntityIndex,
    noShowHealth?: boolean,
    noShowExp?: boolean,
}

export class CCHealthExp extends CCPanel<IHealthExp> {
    static defaultProps = {
        noShowHealth: false,
        noShowExp: false,
    }

    onStartUI() {
        GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
            const entityIndex = this.props.entityIndex;
            this.UpdateState({
                curhp: Entities.GetHealth(entityIndex),
                maxhp: Entities.GetMaxHealth(entityIndex),
                hp_regen: Entities.GetHealthThinkRegen(entityIndex).toFixed(1),
                curExp: Entities.GetCurrentXP(entityIndex),
                maxExp: Entities.GetNeededXPToLevel(entityIndex),
            });
            return 1;
        }))

    }



    render() {
        const { noShowHealth, noShowExp, entityIndex } = this.props;
        const curhp = this.GetState<number>("curhp", 0);
        const maxhp = this.GetState<number>("maxhp", 1);
        const curExp = this.GetState<number>("curExp", 0);
        const maxExp = this.GetState<number>("maxExp", 1);
        const hp_regen = this.GetState<number>("hp_regen", 0);
        // const Exp_regen = this.GetState<number>("Exp_regen", 1);
        return (
            <Panel className="CCHealthExp" ref={this.__root__}  {...this.initRootAttrs()}>
                <CCProgressBar id="HealthProgress" value={curhp} max={maxhp}>
                    <CCLabel id="HealthProgress_Label" text={`${curhp} / ${maxhp}`} tooltip="当前气血" />
                    <Label id="HealthProgressRegen_Label" text={`${FuncHelper.SignNumber(hp_regen)} `} />
                </CCProgressBar>
                <CCProgressBar id="ExpProgress" value={curExp} max={maxExp} color="Gold" marginTop={"5px"}>
                    <CCLabel id="ExpProgress_Label" text={`${curExp} / ${maxExp}`} tooltip="当前经验" />
                    {/* <Label id="ExpProgressRegen_Label" text={`${FuncHelper.SignNumber(Exp_regen)} `} /> */}
                </CCProgressBar>
                {this.props.children}
                {this.__root___childs}
            </Panel>

        )
    }
}


