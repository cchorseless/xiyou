import { CCIcon } from "./CCIcon";

export class CCIcon_Star extends CCIcon<{ type?: "Favorite" | "Selected" | "Lock" | "Filled" | "Eom" | "Tui7Task"; }> {
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Favorite":
				styles.src = "s2r://panorama/images/control_icons/star_favorite_psd.vtex"
				break;
			case "Selected":
				styles.src = "s2r://panorama/images/control_icons/star_favorite_selected_psd.vtex"
				break;
			case "Lock":
				styles.src = "s2r://panorama/images/control_icons/star_locked_png.vtex"
				break;
			case "Filled":
				styles.src = "s2r://panorama/images/control_icons/starfilled_psd.vtex"
				break;
			case "Eom":
				styles.src = "s2r://panorama/images/eom_design/icon/eom/star_png.vtex";
				break;
			case "Tui7Task":
				styles.src = "s2r://panorama/images/eom_design/icon/Tui7/task_point_png.vtex";
				break;
			default:
				styles.src = "s2r://panorama/images/eom_design/icon/eom/star_png.vtex";
				break;
		}
		return styles;
	}
}