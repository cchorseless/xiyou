/** Create By Editor*/
import React, { createRef, useState } from "react";
import { render } from "react-panorama-eom";
import { DotaUIHelper } from "../../../helper/DotaUIHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { GameEnum } from "../../../libs/GameEnum";
import { Hero_select_UI } from "./Hero_select_UI";
export class Hero_select extends Hero_select_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount()
        LogHelper.print(this.constructor.name)

    };

    // 销毁
    componentWillUnmount() {
        super.componentWillUnmount()
        LogHelper.print(this.constructor.name)
    };
}
