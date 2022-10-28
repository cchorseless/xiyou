import EOM_Icon from "./CCIcon";

export default class EOM_Star extends EOM_Icon<{ type?: "Favorite" | "Selected" | "Lock" | "Filled" | "Eom" | "Tui7Task"; }> {
	defaultIconAttribute = (() => {
		switch (this.props.type) {
			case "Favorite":
				return {
					src: "s2r://panorama/images/control_icons/star_favorite_psd.vtex"
				};
			case "Selected":
				return {
					src: "s2r://panorama/images/control_icons/star_favorite_selected_psd.vtex"
				};
			case "Lock":
				return {
					src: "s2r://panorama/images/control_icons/star_locked_png.vtex"
				};
			case "Filled":
				return {
					src: "s2r://panorama/images/control_icons/starfilled_psd.vtex"
				};
			case "Eom":
				return {
					src: "s2r://panorama/images/eom_design/icon/eom/star_png.vtex",
				};
			case "Tui7Task":
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui7/task_point_png.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/eom_design/icon/eom/star_png.vtex",
				};
		}
	})();
}