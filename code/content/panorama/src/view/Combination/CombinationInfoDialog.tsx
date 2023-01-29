/** Create By Editor*/

import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { PathHelper } from "../../helper/PathHelper";
import { CombinationDesItem } from "./CombinationDesItem";
import { CombinationInfoDialog_UI } from "./CombinationInfoDialog_UI";


interface IProps extends NodePropsData {
    itemname: string;
}
export class CombinationInfoDialog extends CombinationInfoDialog_UI<IProps> {

    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        CSSHelper.setFlowChildren(this.box, "down");
    }

    onStartUI() {
        this.onRefreshUI();
    }
    onbtn_click = () => {
        this.close()
    }

    onRefreshUI() {
        const p = this.props;
        if (!p.itemname) {
            return;
        }
        this.clearNode(this.NODENAME.panel_des);
        this.clearNode(this.NODENAME.panel_heroicon);
        let KV_DATA = KVHelper.KVData();
        let config = KV_DATA.building_combination_ability;
        let heronamemap: { [key: string]: string } = {};
        let common_effectmap: { [key: string]: string } = {};
        let relationicon = null;
        for (let k in config) {
            let info = config[k];
            if (info.relation == p.itemname) {
                if (info.index && info.heroid) {
                    heronamemap[info.index] = info.heroid;
                }
                if (info.active_count && info.acitve_common_effect) {
                    common_effectmap[info.active_count] = info.acitve_common_effect;
                }
                relationicon = relationicon || info.relationicon;
            }
        }
        PathHelper.setBgImageUrl(this.title_img_icon, `combination/icon/${relationicon}.png`);
        CSSHelper.setLocalText(this.lbl_des, p.itemname);
        CSSHelper.setLocalText(this.lbl_0, p.itemname + "_Des");
        CSSHelper.setLocalText(this.lbl_1, KV_DATA.lang_config.combination_rule.Des);
        let active_count = Object.keys(common_effectmap).sort();
        for (let k of active_count) {
            this.addNodeChildAsyncAt(this.NODENAME.panel_des, CombinationDesItem, {
                activecount: Number(k),
                effect: common_effectmap[k],
            });
        }
        for (let key in heronamemap) {

        }
        // this.__root__.current!.style.height = 130 + 90 * Number(config.count) + "px";
    }
}
