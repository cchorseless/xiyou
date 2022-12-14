import { CCIcon } from "./CCIcon";

export class CCIcon_Logo extends CCIcon<{ type?: "Eom" | "Argo"; }> {
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Eom":
				return Object.assign(styles, {
					src: "s2r://panorama/images/eom_design/icon/eom/logo_eom_png.vtex",
				});
			case "Argo":
				return Object.assign(styles, {
					src: "s2r://panorama/images/eom_design/icon/eom/logo_argo_png.vtex",
				});
			default:
				return Object.assign(styles, {
					src: "s2r://panorama/images/eom_design/icon/eom/logo_eom_png.vtex",
				});
		}
	}
}