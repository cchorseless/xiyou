import React, { createRef, PureComponent } from "react";
import { DOTAAbilityImageAttributes, PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../CCPanel/CCPanel";
import { TimerHelper } from "../../../helper/TimerHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { CCLabel } from "../CCLabel/CCLabel";
import { CCEffectShine } from "../CCEffect/CCEffectShine";

import "./CCAbilityIcon.less";

interface ICCAbilityIcon extends DOTAAbilityImageAttributes {
    abilityname: string;
    castEntityIndex?: EntityIndex;
    rarity?: Rarity
}


export class CCAbilityIcon extends CCPanel<ICCAbilityIcon> {
    NODENAME = { __root__: '__root__', abilityImage: 'abilityImage' };
    abilityImage_childs: Array<JSX.Element> = [];
    abilityImage: React.RefObject<AbilityImage>;
    static defaultProps = {
        rarity: "A",
        castEntityIndex: -1
    }
    abilityindex: AbilityEntityIndex;
    onInitUI() {
        this.abilityImage = createRef<AbilityImage>();
        const castEntityIndex = this.props.castEntityIndex!;
        if (castEntityIndex > 0) {
            this.abilityindex = Entities.GetAbilityByName(castEntityIndex, this.props.abilityname);
        }
    }
    onbtn_castability = () => {
        const castEntityIndex = this.props.castEntityIndex!;
        if (castEntityIndex < 0 || this.abilityindex == null || this.abilityindex < 0) {
            return;
        }
        if (Abilities.CanBeExecuted(this.abilityindex)) {
            Abilities.ExecuteAbility(this.abilityindex, castEntityIndex, false);
            TimerHelper.AddTimer(
                0.1,
                FuncHelper.Handler.create(this, () => {
                    this.showCdEffect();
                })
            );
        }
    };

    lefttimewprk: TimerHelper.TimerTask | null;
    showCdEffect() {
        if (this.abilityindex == null || this.abilityindex < 0) {
            return;
        }
        if (this.lefttimewprk) {
            this.lefttimewprk!.Clear();
            this.lefttimewprk = null;
        }
        let remainingtime = Math.floor(Abilities.GetCooldownTimeRemaining(this.abilityindex) * 10) - 10;
        if (remainingtime <= 0 || Abilities.IsCooldownReady(this.abilityindex)) {
            this.UpdateState({ lefttime: -1 });
            return;
        }
        let lefttime = remainingtime;
        this.UpdateState({ lefttime: remainingtime, remainingtime: remainingtime });
        this.lefttimewprk = TimerHelper.AddIntervalTimer(
            0,
            0.1,
            FuncHelper.Handler.create(this, () => {
                if (lefttime <= 0) {
                    this.lefttimewprk!.Clear();
                    this.lefttimewprk = null;
                    this.addOnlyOneNodeChild(this.NODENAME.abilityImage, CCEffectShine);
                }
                else {
                    lefttime--;
                }
                this.UpdateState({ lefttime: lefttime });
            }),
            -1
        );
    }
    render() {
        const abilityname = this.props.abilityname;
        const lefttime = this.GetState<number>("lefttime") || -1;
        const remainingtime = this.GetState<number>("remainingtime") || 1;
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_AbilityIcon" {...this.initRootAttrs()}  >
                <Image id="img_AbilityIcon" className={this.props.rarity} >
                    <DOTAAbilityImage ref={this.abilityImage} abilityname={abilityname} onmouseactivate={this.onbtn_castability}>
                        {lefttime >= 0 && <CCPanel backgroundColor="#000000DD" clip={"radial(50.0% 50.0%, 0.0deg, " + -(lefttime / remainingtime) * 360 + "deg)"} />}
                        {lefttime >= 0 && <CCLabel text={"" + (lefttime / 10).toFixed(1)} />}
                        {this.abilityImage_childs}
                    </DOTAAbilityImage>
                </Image>
                {this.props.children}
                {this.__root___childs}
            </Panel >
        )
    }
}