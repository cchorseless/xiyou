/** Create By Editor*/
import React, { createRef, useState } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { registerUI } from "../../libs/BasePureComponent";
import { DrawCardBottomItem } from "./DrawCardBottomItem";
import { DrawCardHeroSceneItem } from "./DrawCardHeroSceneItem";
import { DrawCardPanel_UI } from "./DrawCardPanel_UI";

interface IProps {
    cards: string[];
}
@registerUI()
export class DrawCardPanel extends DrawCardPanel_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        // this.__root___childs.push(
        // 	<DOTAScenePanel id="dfdsdfs" className="SceneLoaded" unit={"'npc_dota_hero_lina'"} light="global_light" antialias={true} renderdeferred={false} particleonly={false}></DOTAScenePanel>
        // );
        CSSHelper.setFlowChildren(this.box);
        CSSHelper.setFlowChildren(this.box_model);
        this.img_bg.current!.style.opacity = "0.8";
    }
    onStartUI() {
        this.onRefreshUI(this.props as IProps);
    }
    onbtn_close_click = () => {
        this.close(true);
    };
    async onRefreshUI(props: IProps) {
        this.clearNode(this.NODENAME.box);
        this.clearNode(this.NODENAME.box_model);
        let spaceX = "";
        if (props.cards.length == 3) {
            this.box_model.current!.style.x = "150px";
            this.box.current!.style.x = "150px";
            spaceX = "50px";
        } else {
            this.box_model.current!.style.x = "0px";
            this.box.current!.style.x = "0px";
            spaceX = "20px";
        }
        let i = 0;
        for (let k of props.cards) {
            await this.addNodeChildAsyncAt(this.NODENAME.box_model, DrawCardHeroSceneItem, {
                itemname: k,
                index: i,
                marginLeft: spaceX,
            });
            await this.addNodeChildAsyncAt(this.NODENAME.box, DrawCardBottomItem, {
                itemname: k,
                index: i,
                marginLeft: spaceX,
                marginTop: "20px",
            });
            i++;
        }
    }
}
