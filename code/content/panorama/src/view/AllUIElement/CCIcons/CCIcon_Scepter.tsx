import { CCIcon } from "./CCIcon";
// A杖

interface IScepter {
    on?: boolean;
}

export class CCIcon_Scepter extends CCIcon<IScepter> {
    static defaultProps = {
        width: "40px",
        height: "50px",
    }

    defaultStyle() {
        let styles = super.defaultStyle();
        let src = "";
        if (this.props.on) {
            src = "s2r://panorama/images/custom_game/icon/aghsstatus_scepter_on_png.vtex";
        }
        else {
            src = "s2r://panorama/images/custom_game/icon/aghsstatus_scepter_png.vtex";
        }
        return Object.assign(styles, {
            src: src,

        });
    }
}