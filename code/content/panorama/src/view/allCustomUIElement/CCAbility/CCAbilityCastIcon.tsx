import React, { createRef, PureComponent } from "react";
import { PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../CCPanel/CCPanel";

import "./CCAbilityCastIcon.less";
import { CCLabel } from "../CCLabel/CCLabel";
import { TimerHelper } from "../../../helper/TimerHelper";
import { FuncHelper } from "../../../helper/FuncHelper";

interface ICCAbilityCastIcon {
    abilityname: string;
    rarity?: Rarity;
    castEntityIndex: EntityIndex;
}


export class CCAbilityCastIcon extends CCPanel<ICCAbilityCastIcon> {
    defaultProps = {
        rarity: "A"
    }
    abilityindex: AbilityEntityIndex;

    onbtn_castability = () => {
        const castEntityIndex = this.props.castEntityIndex;
        this.abilityindex = Entities.GetAbilityByName(castEntityIndex, this.props.abilityname);

        if (this.abilityindex == null || this.abilityindex < 0) {
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
        let leftime = Math.floor(Abilities.GetCooldownTimeRemaining(this.abilityindex) * 10) - 10;
        if (leftime <= 0 || Abilities.IsCooldownReady(this.abilityindex)) {
            this.panel_cd.current!.visible = false;
            this.lbl_lefttime.current!.visible = false;
            return;
        }
        let count = leftime;
        this.lefttimewprk = TimerHelper.AddIntervalTimer(
            0,
            0.1,
            FuncHelper.Handler.create(this, () => {
                if (count <= 0) {
                    this.panel_cd.current!.visible = false;
                    this.lbl_lefttime.current!.visible = false;
                    this.lefttimewprk!.Clear();
                    this.lefttimewprk = null;
                    this.addOrShowOnlyNodeChild(this.NODENAME.img_skillicon, Effect_ShineItem);
                } else {
                    this.panel_cd.current!.visible = true;
                    this.lbl_lefttime.current!.visible = true;
                    this.lbl_lefttime.current!.text = "" + (count / 10).toFixed(1);
                    this.panel_cd.current!.style.clip = "radial(50.0% 50.0%, 0.0deg, " + -(count / leftime) * 360 + "deg)";
                    count--;
                }
                this.updateSelf();
            }),
            -1
        );
    }
    render() {
        const abilityname = this.props.abilityname;
        const lefttime = this.GetState<number>("lefttime")
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_AbilityIcon" {...this.initRootAttrs()}  >
                <DOTAAbilityImage abilityname={abilityname} >
                    {lefttime >= 0 && <CCPanel text={lefttime} />}
                    {lefttime >= 0 && <CCLabel text={lefttime} />}
                </DOTAAbilityImage>
                <Image id="img_AbilityIcon" className={this.props.rarity} />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
}