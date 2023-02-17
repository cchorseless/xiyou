
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";

interface ICCOverHeadBaseItem extends NodePropsData {
    entityid: EntityIndex;
    scale?: number;
    vOrigin?: [number, number, number];
}

export class CCOverHeadBaseItem extends CCPanel<ICCOverHeadBaseItem> {
    onStartUI() {
        if (this.props.scale && this.props.vOrigin) {
            this.updatePos(this.props.scale, this.props.vOrigin)
        }
    }
    updatePos(scale: number, vOrigin: [number, number, number]) {
        const entityid = this.props.entityid as EntityIndex;
        let fOffset = Entities.GetHealthBarOffset(entityid);
        fOffset = fOffset == -1 ? 275 : fOffset;
        fOffset = fOffset + scale * 80 - 75;
        let fX = Game.WorldToScreenX(vOrigin[0], vOrigin[1], vOrigin[2] + fOffset);
        let fY = Game.WorldToScreenY(vOrigin[0], vOrigin[1], vOrigin[2] + fOffset);
        let fYY = 0;
        let pPanel = this.__root__.current!;
        pPanel.SetPositionInPixels((fX - pPanel.actuallayoutwidth / 2) / pPanel.actualuiscale_x, (fY - (pPanel.actuallayoutheight - fYY)) / pPanel.actualuiscale_y, 0);
        this.__root__.current!.visible = true;
    }

}