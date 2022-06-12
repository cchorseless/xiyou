import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CustomStats_UI } from "./CustomStats_UI";

export class CustomStats extends CustomStats_UI {
    constructor(p: any) {
        super(p);
    }
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        let panel = $.CreatePanelWithProperties("DOTAStatsRegion", this.stats_container.current!, "stats", {
            class: "ShowSplitLabels",
            hittest: false,
        });
        if (panel) {
            panel.style.height = "72px";
        }
        let panel2 = $.CreatePanelWithProperties("DOTAHUDStrAgiInt", this.stats_container.current!, "stragiint", {
            hittest: false,
            "always-cache-composition-layer": true,
            "require-composition-layer": true,
        });
        if (panel2) {
            panel2.style.height = "66px";
            panel2.style.verticalAlign = "bottom";
            panel2.style.horizontalAlign = "right";
            panel2.style.marginBottom = "0px";
            panel2.style.marginRight = "5px";
            panel2.visible = true;
        }
    }
    onStartUI() {
        let DamageIcon = this.__root__.current!.FindChildTraverse("DamageIcon")!;
        CSSHelper.setPanelBgImageUrl(DamageIcon, `common/icon_props_damage.png`);
        let armorIcon = this.__root__.current!.FindChildTraverse("ArmorIcon")!;
        CSSHelper.setPanelBgImageUrl(armorIcon, `common/icon_props_armor.png`);
        let speedIcon = this.__root__.current!.FindChildTraverse("MoveSpeedIcon")!;
        CSSHelper.setPanelBgImageUrl(speedIcon, `common/icon_props_speed.png`);
    }
}
