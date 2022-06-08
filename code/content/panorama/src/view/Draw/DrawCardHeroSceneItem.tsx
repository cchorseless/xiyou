/** Create By Editor*/
import React, { createRef, useState } from "react";
import { KV_DATA } from "../../config/KvAllInterface";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { LogHelper } from "../../helper/LogHelper";
import { PrecacheHelper } from "../../helper/PrecacheHelper";
import { GameEnum } from "../../libs/GameEnum";
import { DrawCardBottomItem } from "./DrawCardBottomItem";
import { DrawCardHeroSceneItem_UI } from "./DrawCardHeroSceneItem_UI";
import { DrawCardPanel } from "./DrawCardPanel";

interface IProps {
    itemname: string;
    index: number;
}

export class DrawCardHeroSceneItem extends DrawCardHeroSceneItem_UI {
    constructor(prop: any) {
        super(prop);
    }

    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        this.heroscene_attrs.onactivate = async (e) => {
            await this.selectCard();
        };
    }
    onStartUI() {
        this.onRefreshUI(this.props as any);
       
   }

    onRefreshUI(k: IProps) {
        if (!k.itemname) {
            return;
        }
        let heroname = k.itemname.replace("building_hero_", "");
        this.playPickSound();
        let heroid = GameEnum.Unit.enum_HeroID[heroname as any] as any;
        if (heroid == null) {
            heroid = 1;
        }
        this.heroscene.current!.SetScenePanelToLocalHero(heroid as HeroID);
        this.updateSelf();
    }

    playPickSound() {
        if (!this.props.itemname) {
            return;
        }
        let config = KV_DATA.building_unit_tower.building_unit_tower[this.props.itemname];
        if (config.HeroSelectSoundEffect) {
            Game.EmitSound(config.HeroSelectSoundEffect);
        }
    }
    async selectCard() {
        if (!this.props.itemname) {
            return;
        }
        this.playPickSound();
        let data = this.props as IProps;
        let r = await PlayerScene.DrawComp.SelectCard(data.index, data.itemname);
        if (r) {
            PrecacheHelper.GetRegClass<typeof DrawCardPanel>("DrawCardPanel").GetInstance()!.close();
        }
    }
}
