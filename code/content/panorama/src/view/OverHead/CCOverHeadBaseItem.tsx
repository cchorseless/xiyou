
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";

interface ICCOverHeadBaseItem extends NodePropsData {
    entityid: EntityIndex;
    vOrigin?: [number, number, number];
}

export class CCOverHeadBaseItem extends CCPanel<ICCOverHeadBaseItem> {
    onStartUI() {
        if (this.props.vOrigin) {
            this.updatePos(this.props.vOrigin)
        }
    }
    updatePosInBottom(scale: number, vOrigin: [number, number, number]) {
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
    updatePos(vOrigin: [number, number, number]) {
        // fOffset = fOffset == -1 ? 275 : fOffset;
        // fOffset = fOffset + scale * 80 - 75;
        let fX = Game.WorldToScreenX(vOrigin[0], vOrigin[1], vOrigin[2]);
        let fY = Game.WorldToScreenY(vOrigin[0], vOrigin[1], vOrigin[2]);
        let w = Game.GetScreenWidth();
        let h = Game.GetScreenHeight();
        let maxwidth = (w / h) * 1080;
        let midwidth = maxwidth / 2;
        let maxheight = 1080;//1920 * h / w;
        let midheight = maxheight / 2;
        let newX = ((fX / w) * maxwidth);
        let newY = ((fY / h) * maxheight);
        if (newX > midwidth) {
            newX += ((newX - midwidth) / midwidth) * 125;
        }
        else {
            newX -= ((midwidth - newX) / midwidth) * 125;
        }

        if (newY > midheight) {
            newY -= ((midheight - newY) / midheight) * 20;
        }
        else {
            newY += ((newY - midheight) / midheight) * 20;
        }
        let pPanel = this.__root__.current!;
        newX -= (pPanel.actuallayoutwidth / w * maxwidth) / 2;
        newY -= (pPanel.actuallayoutheight / midheight * maxheight) / 2;
        // Y轴偏移
        let fOffset = -35;
        // 近大远小
        let far_near_y = ((newY - midheight) / 100.0 * 10) / 100 + 1.2;
        newY -= fOffset * (far_near_y || 1);
        let far_near_x = ((newX - midwidth) / 100.0 * 1000) / 100;
        newX -= (far_near_x || 1);
        pPanel.style.uiScale = "70% 70% 100%";
        pPanel.SetPositionInPixels(newX, newY, 0);
        this.__root__.current!.visible = true;
    }
}