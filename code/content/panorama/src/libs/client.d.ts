declare interface IDragPanel extends Panel {
    m_pPanel?: Panel;
    m_DragCompleted?: boolean;
    m_DragType?: string;
    m_DragType_Extra?: any;
    m_Slot?: number;
    overrideentityindex?: ItemEntityIndex;
}
/**
 * 拖动物品需要的属性
 */
declare interface IDragItem extends IDragPanel {
    bIsDragItem?: boolean;
    itemname?: string;
    tParticleIDs?: ParticleID[];
}


declare const PlayerResource: any;
declare const json: any;
declare const GameRules: CScriptBindingPR_Game;