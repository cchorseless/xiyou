import { CSSHelper } from "../../../helper/CSSHelper";
import { CCIcon } from "./CCIcon";

export class CCIcon_History extends CCIcon<{ type?: "Tui7"; }> {
	static defaultProps = {
		type: CSSHelper.DEFAULT_ADDON_TYPE
	};
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Tui7":
				return Object.assign(styles, {
					src: "s2r://panorama/images/eom_design/icon/tui7/history_png.vtex",
				});
			default:
				return Object.assign(styles, {
					src: "s2r://panorama/images/control_icons/history_png.vtex",
				});
		}
	}
}