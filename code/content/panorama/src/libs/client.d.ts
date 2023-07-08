declare interface IDragPanel extends Panel {
    m_pPanel?: Panel;
    m_DragCompleted?: boolean;
    m_DragType?: string;
    m_Slot?: number;
    bIsDragItem?: boolean;
    overrideentityindex?: ItemEntityIndex;
}
/**
 * 拖动物品需要的属性
 */
declare interface IDragItem extends IDragPanel {
    itemname?: string;
    tParticleIDs?: ParticleID[];
}

declare interface LabelPanel {
    SetLocString(s: string): void;
}

declare interface ToastManager extends Panel {
    QueueToast(p: Panel): void;
    RemoveToast(p: Panel): void;
}

declare const PlayerResource: any;
declare const json: any;
declare const GameRules: CScriptBindingPR_Game;

declare const IsServer: Function;

declare const IsInToolsMode: Function;
