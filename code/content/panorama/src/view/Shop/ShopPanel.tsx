/** Create By Editor*/
import React, { createRef, useState } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { EMoneyType } from "../../game/service/account/CharacterDataComponent";
import { ShopPanel_UI } from "./ShopPanel_UI";
export class ShopPanel extends ShopPanel_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
    }
    onbtn_gohome = () => {
        this.close(true);
    };

    onbtn_goback = () => {
        this.close(true);
    };

    onStartUI() {
        this.onRefreshUI()
    }

    public onRefreshUI(): void {
        this.lbl_metastone.current!.text = "" + PlayerScene.TCharacter.DataComp!.NumericComp!.GetAsInt(EMoneyType.MetaStone);
        this.lbl_starstone.current!.text = "" + PlayerScene.TCharacter.DataComp!.NumericComp!.GetAsInt(EMoneyType.StarStone);
        this.updateSelf()
    }
}
