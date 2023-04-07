import { DOTAAbilityImageAttributes } from "@demon673/react-panorama";
import React from "react";
import { CCEffectShine } from "../CCEffect/CCEffectShine";
import { CCLabel } from "../CCLabel/CCLabel";
import { CCPanel } from "../CCPanel/CCPanel";



import "./CCAbilityIcon.less";

interface ICCAbilityIcon_Custom extends DOTAAbilityImageAttributes {
    abilityname: string;
    contextEntityIndex?: AbilityEntityIndex,
    rarity?: Rarity;
    playerid?: PlayerID;
    onclick?: () => void;
    tipsInfo?: {
        level?: number,
        mode?: "description_only" | "show_scepter_only" | "normal",
        showextradescription?: boolean,
        onlynowlevelvalue?: boolean
    };

}


export class CCAbilityIcon_Custom extends CCPanel<ICCAbilityIcon_Custom> {
    NODENAME = { __root__: '__root__', abilityImage: 'abilityImage' };
    abilityImage_childs: Array<JSX.Element> = [];
    abilityImage: React.RefObject<AbilityImage>;
    static defaultProps = {
        rarity: "A",
        contextEntityIndex: -1,
        playerid: -1,
        showTips: true,
    }

    // defaultStyle() {
    //     if (this.props.tipsInfo) {
    //         let obj = Object.assign({
    //             abilityname: this.props.abilityname,
    //             castentityindex: this.props.castEntityIndex,
    //             playerid: this.props.playerid,
    //         }, this.props.tipsInfo)
    //         return {
    //             dialogTooltip: {
    //                 cls: CCAbilityInfoDialog,
    //                 props: obj,
    //                 posRight: true
    //             } as dialogTooltipInfo<CCAbilityInfoDialog, any>
    //         }
    //     }
    //     return {}
    // }

    onbtn_castability() {
        const contextEntityIndex = this.props.contextEntityIndex!;
        if (contextEntityIndex < 0 || contextEntityIndex == null) {
            return;
        }
        if (Abilities.CanBeExecuted(contextEntityIndex)) {
            Abilities.ExecuteAbility(contextEntityIndex, Abilities.GetCaster(contextEntityIndex), false);
            GTimerHelper.AddTimer(
                0.1,
                GHandler.create(this, () => {
                    this.showCdEffect();
                    if (this.props.onclick) {
                        this.props.onclick();
                    }
                })
            );
        }
    };

    lefttimewprk: ITimerTask | null;
    showCdEffect() {
        const contextEntityIndex = this.props.contextEntityIndex!;
        if (contextEntityIndex == null || contextEntityIndex < 0) {
            return;
        }
        if (this.lefttimewprk) {
            this.lefttimewprk!.Clear();
            this.lefttimewprk = null;
        }
        let remainingtime = Math.floor(Abilities.GetCooldownTimeRemaining(contextEntityIndex) * 10) - 10;
        if (remainingtime <= 0 || Abilities.IsCooldownReady(contextEntityIndex)) {
            this.UpdateState({ lefttime: -1 });
            return;
        }
        let lefttime = remainingtime;
        this.UpdateState({ lefttime: remainingtime, remainingtime: remainingtime });
        this.lefttimewprk = GTimerHelper.AddTimer(0, GHandler.create(this, () => {
            if (lefttime <= 0) {
                this.addOnlyOneNodeChild(this.NODENAME.abilityImage, CCEffectShine);
                this.updateSelf()
                this.lefttimewprk = null;
                return;
            }
            else {
                lefttime--;
            }
            this.UpdateState({ lefttime: lefttime });
            return 0.1
        }));
    }
    render() {
        const abilityname = this.props.abilityname;
        const contextEntityIndex = this.props.contextEntityIndex!;
        const lefttime = this.GetState<number>("lefttime") || -1;
        const remainingtime = this.GetState<number>("remainingtime") || 1;
        return (<Panel ref={this.__root__} className="CCAbilityIcon" {...this.initRootAttrs()}  >
            <Image id="img_AbilityIcon" className={this.props.rarity} >
                <DOTAAbilityImage ref={this.abilityImage} abilityname={abilityname} contextEntityIndex={contextEntityIndex} showtooltip={true} style={{ tooltipPosition: "top" }} onmouseactivate={() => this.onbtn_castability()}>
                    {lefttime >= 0 && <CCPanel width="100%" height="100%" backgroundColor="#000000DD" clip={"radial(50.0% 50.0%, 0.0deg, " + -(lefttime / remainingtime) * 360 + "deg)"} />}
                    {lefttime >= 0 && <CCLabel type="UnitName" align="center center" text={"" + (lefttime / 10).toFixed(1)} />}
                    {this.abilityImage_childs}
                </DOTAAbilityImage>
            </Image>
            {this.props.children}
            {this.__root___childs}
        </Panel >
        )
    }
}

interface ICCAbilityIcon extends DOTAAbilityImageAttributes {
    abilityname: string;
    castentityindex?: AbilityEntityIndex,
    rarity?: Rarity;
    playerid?: PlayerID;
    showTips?: boolean;

}
export class CCAbilityIcon extends CCPanel<ICCAbilityIcon> {
    NODENAME = { __root__: '__root__', abilityImage: 'abilityImage' };
    abilityImage_childs: Array<JSX.Element> = [];
    abilityImage: React.RefObject<AbilityImage>;
    static defaultProps = {
        castEntityIndex: -1,
        playerid: -1,
        showTips: true,
    }
    render() {
        const abilityname = this.props.abilityname;
        const castEntityIndex = this.props.castEntityIndex!;
        const showTips = this.props.showTips!;
        return (
            <Panel ref={this.__root__} className="CCAbilityIcon" {...this.initRootAttrs()}  >
                <Image id="img_AbilityIcon" className={this.props.rarity} >
                    <DOTAAbilityImage ref={this.abilityImage} showtooltip={showTips} abilityname={abilityname} contextEntityIndex={castEntityIndex} >
                        {this.abilityImage_childs}
                    </DOTAAbilityImage>
                </Image>
                {this.props.children}
                {this.__root___childs}
            </Panel >
        )
    }
}
