/** Create By Editor*/
import React, { createRef, useState } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { HeroDebugItem_UI } from "./HeroDebugItem_UI";
export class HeroDebugItem extends HeroDebugItem_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        CSSHelper.addBorderStyle(this.__root__);
        TimerHelper.AddIntervalFrameTimer(
            10,
            10,
			FuncHelper.Handler.create(this, () => {
				this.onUpdate()
			}),
            -1
        );
    }
    onUpdate() {
        let selfEntity = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer());
        let v1 = Entities.GetAbsOrigin(selfEntity);
        this.lbl_position.current!.text = `位置:${Math.floor(v1[0])} | ${Math.floor(v1[1])} | ${Math.floor(v1[2])}`;
        this.updateSelf();
    }
    /**
     *更新渲染
     * @param prevProps 上一个状态的 props
     * @param prevState
     * @param snapshot
     */
    componentDidUpdate(prevProps: any, prevState: any, snapshot?: any) {
        super.componentDidUpdate(prevProps, prevState, snapshot);
    }
    // 销毁
    componentWillUnmount() {
        super.componentWillUnmount();
    }
}
