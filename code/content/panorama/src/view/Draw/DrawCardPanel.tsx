/** Create By Editor*/
import React, { createRef, useState } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NodePropsData, registerUI } from "../../libs/BasePureComponent";
import { DrawCardBottomItem } from "./DrawCardBottomItem";
import { DrawCardHeroSceneItem } from "./DrawCardHeroSceneItem";
import { DrawCardPanel_UI } from "./DrawCardPanel_UI";

interface IProps extends NodePropsData {
    cards: string[];
}
@registerUI()
export class DrawCardPanel extends DrawCardPanel_UI<IProps> {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
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
        let spaceX: string = "";
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

    hideItemByIndex(index: number) {
        let herosceneitems = this.GetNodeChild(this.NODENAME.box_model, DrawCardHeroSceneItem);
        herosceneitems.forEach(item => {
            if (item.props.index === index) {
                item.hide();
            }
        });
        let CardBottomItems = this.GetNodeChild(this.NODENAME.box, DrawCardBottomItem);
        CardBottomItems.forEach(item => {
            if (item.props.index === index) {
                item.hide();
            }
        });
    }
}
