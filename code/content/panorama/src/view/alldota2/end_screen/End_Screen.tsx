/** Create By Editor*/
import React, { createRef, useState } from "react";
import { render } from "@demon673/react-panorama";
import { DotaUIHelper } from "../../../helper/DotaUIHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { End_Screen_UI } from "./End_Screen_UI";
export class End_Screen extends End_Screen_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount()
        LogHelper.print(this.constructor.name)
    };

    // 销毁
    componentWillUnmount() {
        super.componentWillUnmount()
    };

    addEvent() {

    }
}
render(<End_Screen />, $.GetContextPanel());
