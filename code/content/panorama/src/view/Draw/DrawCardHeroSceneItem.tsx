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
    constructor(prop: IProps) {
        super(prop);
        this.heroscene_attrs.className = "hero_draw_card_box";
        this.heroscene_attrs.camera = "default_camera";
        this.heroscene_attrs.allowrotation = true;
        this.heroscene_attrs.rotateonmousemove = true;
        this.heroscene_attrs.antialias = true;
        this.heroscene_attrs.renderdeferred = false;
        this.heroscene_attrs.particleonly = false;
        this.heroscene_attrs.light = "global_light";
        if (!prop.itemname) {
            return;
        }
        let heroname = prop.itemname.replace("building_hero_", "npc_dota_hero_");
        this.heroscene_attrs.unit = heroname;
        this.heroscene_attrs.onactivate = async (e) => {
            await this.selectCard();
        };
    }


    onRefreshUI(k: IProps) {
        // if (!k.itemname) {
        //     return;
        // }
        // let heroname = k.itemname.replace("building_hero_", "");
        // this.playPickSound();
        // let heroid = GameEnum.Unit.enum_HeroID[heroname as any] as any;
        // if (heroid == null) {
        //     heroid = 1;
        // }
        // this.heroscene.current!.SetScenePanelToLocalHero(heroid as HeroID);
        // this.heroscene_attrs.unit = "dota_npc_hero_" + heroname;
        // this.heroscene.current!.SetScenePanelToLocalHero(heroid as HeroID);

        // this.updateSelf();
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
        let data = this.props as IProps;
        let r = await PlayerScene.Local.DrawComp.SelectCard(data.index, data.itemname);
        if (r) {
            this.playPickSound();
            PrecacheHelper.GetRegClass<typeof DrawCardPanel>("DrawCardPanel").GetInstance()!.hideItemByIndex(data.index);
        }
    }
}
