/** Create By Editor*/
import React, { createRef, useState } from "react";
import { ChallengeIconItem_UI } from "./ChallengeIconItem_UI";
export class ChallengeIconItem extends ChallengeIconItem_UI {
    // 初始化数据
    componentDidMount() {
		super.componentDidMount();
		this.img_icon.current!.style.opacityMask="url(\"file://{images}/challenge/round_bg.png\")"
    }
   
    // 销毁
    componentWillUnmount() {
        super.componentWillUnmount();
	}
	
	onRefreshUI() {
	}
}
