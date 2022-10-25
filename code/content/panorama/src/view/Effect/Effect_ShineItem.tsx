/** Create By Editor*/
import React, { createRef, useState } from "react";
import { FuncHelper } from "../../helper/FuncHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { Effect_ShineItem_UI } from "./Effect_ShineItem_UI";
export class Effect_ShineItem extends Effect_ShineItem_UI<NodePropsData> {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
    }
    onStartUI() {
        this.__root__.current!.TriggerClass("do_shine");
        TimerHelper.AddTimer(0.5, FuncHelper.Handler.create(this, () => {
            this.close();
        }))
    }
}
