/** Create By Editor*/
import React, { createRef, useState } from "react";
import { DotaUIHelper } from "../../../helper/DotaUIHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { GameEnum } from "../../../libs/GameEnum";
import { Minimap_iconitem } from "./Minimap_iconitem";
import { Minimap_plus_UI } from "./Minimap_plus_UI";
export class Minimap_plus extends Minimap_plus_UI {
    minimap_width: number = 0;
    minimap_height: number = 0;
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
       
        // this.addEvent()
    }

    onStartUI() {
        let minimap = DotaUIHelper.FindDotaHudElement("minimap_block");
        if (minimap) {
            this.minimap_height = minimap.actuallayoutheight - 20;
            this.minimap_width = minimap.actuallayoutwidth - 20;
            this.__root__.current!.style.width = this.minimap_height + "px";
            this.__root__.current!.style.height = this.minimap_width + "px";
        }
        this.updateSelf()
    }
    allheroicon: { [playerid: string]: Minimap_iconitem } = {};
    addEvent() {
        NetHelper.ListenOnLua(
            this,
            GameEnum.CustomProtocol.push_update_minimap,
            (e) => {
                if (e.state && e.data) {
                    for (let playerid in e.data) {
                        let v = e.data[playerid].v;
                        let q = e.data[playerid].q;
                        if (this.allheroicon[playerid] != null) {
                            this.allheroicon[playerid].updateUI(v, q);
                        } else {
                            this.addNodeChildAt(this.NODENAME.__root__, Minimap_iconitem, {
                                isSelf: playerid == "" + Players.GetLocalPlayer(),
                                v: v,
                                q: q,
                                playerid: Number(playerid),
                            });
                        }
                    }
                    this.updateSelf();
                }
            }
        );
        NetHelper.ListenOnLua(
            this,
            GameEnum.CustomProtocol.push_update_minimap_nodraw,
            (e) => {
                LogHelper.print(e, "push_update_minimap_nodraw");
                if (e.state && e.data) {
                    for (let playerid in e.data) {
                        if (this.allheroicon[playerid]) {
                            this.allheroicon[playerid].close(false);
                        }
                    }
                }
            }
        );
    }
    updateIcon(playerid: PlayerID, m: Minimap_iconitem) {
        this.allheroicon[playerid] = m;
    }
}
