import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCEffectShine.less";

export interface ICCEffectShine {

}

/** 闪光 */
export class CCEffectShine extends CCPanel<ICCEffectShine> {
    onStartUI() {
        this.__root__.current!.TriggerClass("do_shine");
        GTimerHelper.AddTimer(0.5, GHandler.create(this, () => {
            this.close();
        }))
    }

    render() {
        return (
            this.__root___isValid &&
            <Panel id="CC_EffectShine" ref={this.__root__}      {...this.initRootAttrs()}>
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}