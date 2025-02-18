import React, { createElement, PureComponent } from "react";
import { GameEnum } from "../../../scripts/tscripts/shared/GameEnum";
import { ET } from "../../../scripts/tscripts/shared/lib/Entity";
import { GEventHelper } from "../../../scripts/tscripts/shared/lib/GEventHelper";
import { CSSHelper } from "../helper/CSSHelper";
import { LogHelper } from "../helper/LogHelper";
import { NetHelper } from "../helper/NetHelper";


interface IBasePureCompProperty {
    InstanceId: string;
    IsRegister: boolean;
}
/**
 * 节点数据
 */
interface _NodePropsData {
    /**组件唯一key */
    __onlykey__?: string;
    key?: string;
    [k: string]: any;
};
declare global {
    type NodePropsData = _NodePropsData & Partial<VCSSStyleDeclaration>;
}

interface ReactElement extends React.CElement<NodePropsData, BasePureComponent<NodePropsData>> { }

interface ReactElementNodeInfo {
    Node: ReactElement;
    Domain: BasePureComponent<NodePropsData>;
    NodeParentName: string;
}

export const registerUI = () => (entity: typeof BasePureComponent<NodePropsData>) => {
    GReloadable(entity);
};

export class BasePureComponentSystem {
    public static AllBasePureComp: { [instanceId: string]: BasePureComponent<NodePropsData> } = {};
    public static AllReactElement: { [instanceId: string]: ReactElementNodeInfo } = {};
    // 异步函数
    public static AllAsyacResolve: { [instanceId: string]: Function } = {};

    static RegisterBasePureComp(entity: BasePureComponent<NodePropsData>, b: boolean) {
        if (b) {
            if (entity.InstanceId == null || BasePureComponentSystem.AllBasePureComp[entity.InstanceId] != null) {
                throw new Error("RegisterBasePureComp error");
            }
            BasePureComponentSystem.AllBasePureComp[entity.InstanceId] = entity;
            let resolve = BasePureComponentSystem.AllAsyacResolve[entity.InstanceId];
            if (resolve) {
                resolve(entity);
                delete BasePureComponentSystem.AllAsyacResolve[entity.InstanceId];
            }
        } else {
            if (entity.InstanceId == null || BasePureComponentSystem.AllBasePureComp[entity.InstanceId] == null) {
                throw new Error("RegisterBasePureComp error");
            }
            delete BasePureComponentSystem.AllBasePureComp[entity.InstanceId];
        }
    }
    static RegisterReactElement(entity: ReactElement, b: boolean, Domain: BasePureComponent<NodePropsData> | null = null, NodeParentName: string | null = null) {
        if (b) {
            if (entity.key == null || BasePureComponentSystem.AllReactElement[entity.key] != null || Domain == null || NodeParentName == null) {
                LogHelper.error("RegisterReactElement error");
                return;
            }
            BasePureComponentSystem.AllReactElement[entity.key] = {
                Node: entity,
                Domain: Domain,
                NodeParentName: NodeParentName,
            };
        } else {
            if (entity.key == null || BasePureComponentSystem.AllBasePureComp[entity.key] == null) {
                return;
            }
            delete BasePureComponentSystem.AllReactElement[entity.key];
        }
    }
    static GetBasePureComp(instanceId: string) {
        return BasePureComponentSystem.AllBasePureComp[instanceId];
    }
    static GetReactElement(instanceId: string) {
        return BasePureComponentSystem.AllReactElement[instanceId];
    }
}

export class EntityRef<T>{
    get Ref(): T {
        return this._Ref;
    }
    private _Ref: T
    constructor(ref: T) {
        this._Ref = ref;
    }
}

export class BasePureComponent<P extends NodePropsData, B extends Panel = Panel> extends PureComponent<P> implements ET.IEntityRoot {
    static PanelZorder = 1;
    ETRoot?: ET.EntityRoot;
    /**根节点 */
    __root__: React.RefObject<B>;
    /**全局唯一UUID，用于标识 */
    readonly InstanceId: string;
    readonly IsRegister: boolean = false;
    readonly IsClosed: boolean = false;
    /**所有子节点名称数据 */
    NODENAME = { __root__: "__root__" };
    /**所有注册的事件毁掉函数 */
    FUNCNAME = {};
    /**根节点样式 */
    CSS_0_0: Partial<VCSSStyleDeclaration> = {};
    /**类注册计数 */
    constructor(props: P) {
        super(props);
        this.__root__ = null as any;

        // LogHelper.print("add BasePureComponent :", this.constructor.name);
    }

    private setRegister(value: boolean) {
        if (this.IsRegister == value) {
            return;
        }
        (this as IBasePureCompProperty).IsRegister = value;
        BasePureComponentSystem.RegisterBasePureComp(this, value);
    }
    /**
     * 获取节点管理子节点数据对象变量名称
     * @param nodeName
     * @returns
     */
    private getNode_childs_Name(nodeName: string): string {
        return nodeName + "_childs";
    }
    /**
     * 获取节点管理本节点属性变量名称
     * @param nodeName
     * @returns
     */
    private getNode_attrs_Name(nodeName: string): string {
        return nodeName + "_attrs";
    }
    /**
     * 获取节点管理本节点是否销毁
     * @param nodeName
     * @returns
     */
    private getNode_isValid_Name(nodeName: string): string {
        return nodeName + "_isValid";
    }

    /** 函数组件使用 */
    public HookRef() {
        // const { useState, useEffect } = require("react")
        // const [v, setValue] = useState({ Ref: this });
        // const hander = GHandler.create(this, () => {
        //     setValue({ Ref: this });
        // });
        // useEffect(() => {
        //     GEventHelper.AddEvent(this.updateEventName, hander, null, true);
        //     return () => { hander._id > 0 && GEventHelper.RemoveCaller(this, hander) };
        // }, [v])
        // return v.Ref;
    }

    // private _ETRef: EntityRef<this>;

    // public Ref(v: boolean = false) {
    //     if (!this._ETRef || v) {
    //         this._ETRef = new EntityRef(this);
    //     }
    //     return { [this.InstanceId]: this._ETRef };
    // }
    ListenClassUpdate<T extends typeof ET.Entity>(cls: T, func?: (e: InstanceType<T>) => void) {
        if (cls == null) {
            GLogHelper.warn("ListenUpdate entity is null," + this.constructor.name);
            return;
        }
        GEventHelper.AddEvent(cls.updateEventClassName(), GHandler.create(this, (e: InstanceType<T>) => {
            if (this.IsRegister) {
                // content.setState(entity.Ref(true));
                this.UpdateSelf();
                if (func) {
                    func(e);
                }
            }
        }))
    }

    ListenUpdate(entity: ET.Entity, func?: () => void) {
        // this.UpdateState(entity.Ref());
        if (entity == null) {
            GLogHelper.warn("ListenUpdate entity is null," + this.constructor.name);
            return;
        }
        GEventHelper.AddEvent(entity.updateEventSelfName, GHandler.create(this, () => {
            if (this.IsRegister) {
                // content.setState(entity.Ref(true));
                this.UpdateSelf();
                if (func) {
                    func();
                }
            }
        }), entity.BelongPlayerid)
    }
    /**数据准备检查 */
    public onReady(): boolean { return true; }

    /**创建前，指定属性，添加事件 */
    public onInitUI() { }

    /**
     * 渲染后执行
     * @override
     */
    public onStartUI() { }
    public onRefreshUI() { }
    public onDestroy() { }

    /**
     * 获取state 数据
     * @param key
     * @returns
     */
    public GetState<T>(key: string, defaultV: T = null as any) {
        let obj = ((this.state || {}) as any)[key];
        if (obj == null && defaultV != null) {
            obj = defaultV;
        }
        return obj as T;
    }

    public GetStateEntity<T extends { InstanceId: string }>(entity: T) {
        if (entity == null) { return null }
        let obj = this.GetState<any>(entity.InstanceId);
        if (obj) {
            return obj.Ref as T
        }
        else {
            return entity as T;
        }
    }

    public UpdateState(obj: { [k: string]: any }) {
        if (!obj) { return; }
        this.state = this.state || {};
        if (this.IsRegister) {
            this.setState(obj);
        }
        else {
            this.state = Object.assign(this.state, obj)
        }
    }

    /**
     * 向_childs中添加子节点
     * @param nodeName 添加的父节点名称，在 this.nodeName中
     * @param nodeType 子节点类型
     * @param nodeData 子节点数据，相当于this.props
     * @param index 添加的索引，默认在父节点最后添加
     * @returns
     */
    public addNodeChildAt<M extends NodePropsData, T extends typeof BasePureComponent<M>>(nodeName: string, nodeType: T, nodeData: M = {} as any, index: number = -1): ReactElement | void {
        let instanceId = GGenerateUUID();
        // 添加唯一Key
        nodeData.key = instanceId;
        // 复制一份存起来
        nodeData.__onlykey__ = instanceId;
        let _childsName = this.getNode_childs_Name(nodeName);
        let parentNode: Array<JSX.Element> = (this as any)[_childsName];
        if (parentNode == null) {
            throw new Error(this.constructor.name + " dont have node : " + nodeName);
        }
        let node = createElement(nodeType, nodeData) as any as ReactElement;
        BasePureComponentSystem.RegisterReactElement(node, true, this, _childsName);
        if (index == -1) {
            parentNode = parentNode.concat([node]);
        } else {
            parentNode.splice(index, 0, node);
            parentNode = parentNode.concat([]);
        }
        // 新的数组内存位置改变才能刷新UI
        (this as any)[_childsName] = parentNode;
        return node;
    }

    public removeNodeChild(_childsName: string, node: ReactElement) {
        let parentNode: Array<JSX.Element> = (this as any)[_childsName];
        if (parentNode == null) {
            throw new Error(this.constructor.name + " dont have node : " + _childsName);
        }
        let index = 0;
        for (let i = 0; i < parentNode.length; i++) {
            if (parentNode[i].key == node.key) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            throw new Error(_childsName + " dont have this node");
        } else {
            parentNode.splice(index, 1);
            parentNode = parentNode.concat([]);
        }
        BasePureComponentSystem.RegisterReactElement(node, false);
        // 新的数组内存位置改变才能刷新UI
        (this as any)[_childsName] = parentNode;
    }

    public getPureCompByNode<T extends BasePureComponent<NodePropsData>>(node: ReactElement): T | null {
        if (node.key) {
            return BasePureComponentSystem.GetBasePureComp(node.key as string) as T;
        }
        return null;
    }

    public addOnlyOneNodeChild<M extends NodePropsData, T extends typeof BasePureComponent<M>>(nodeName: string, nodeType: T, nodeData: M = {} as any, bforceNew: boolean = false) {
        let comp = this.GetOneNodeChild<M, T>(nodeName, nodeType);
        if (comp) {
            if (!bforceNew) {
                comp.__root__.current!.visible = true;
                comp.UpdateSelf();
                return
            }
            else {
                comp.close();
            }
        }
        this.addNodeChildAt<M, T>(nodeName, nodeType, nodeData);
    }



    public async addOrShowOnlyNodeChild<M extends NodePropsData, T extends typeof BasePureComponent<M>>(nodeName: string, nodeType: T, nodeData: M = {} as any) {
        let comp = this.GetOneNodeChild<M, T>(nodeName, nodeType);
        if (comp == null) {
            comp = await this.addNodeChildAsyncAt<M, T>(nodeName, nodeType, nodeData);
        } else {
            comp.__root__.current!.visible = true;
            comp.show();
        }
        return comp as InstanceType<T>;
    }

    public GetNodeChild<M extends NodePropsData, T extends typeof BasePureComponent<M>>(nodeName: string, nodeType: T): InstanceType<T>[] {
        let _childsName = this.getNode_childs_Name(nodeName);
        let parentNode: Array<JSX.Element> = (this as any)[_childsName];
        if (parentNode == null) {
            throw new Error(this.constructor.name + " dont have node : " + nodeName);
        }
        let len = parentNode.length;
        let r: InstanceType<T>[] = [];
        for (let i = 0; i < len; i++) {
            let _node = parentNode[i] as ReactElement;
            if (_node.type.name == nodeType.name) {
                let c = BasePureComponentSystem.GetBasePureComp(_node.key as string) as InstanceType<T>;
                c && r.push(c);
            }
        }
        return r;
    }

    public GetOneNodeChild<M extends NodePropsData, T extends typeof BasePureComponent<M>>(nodeName: string, nodeType: T): InstanceType<T> | null {
        let _childsName = this.getNode_childs_Name(nodeName);
        let parentNode: Array<JSX.Element> = (this as any)[_childsName];
        if (parentNode == null) {
            throw new Error(this.constructor.name + " dont have node : " + nodeName);
        }
        let len = parentNode.length;
        for (let i = 0; i < len; i++) {
            let _node = parentNode[i] as ReactElement;
            if (_node.type.name == nodeType.name) {
                let c = BasePureComponentSystem.GetBasePureComp(_node.key as string) as InstanceType<T>;
                if (c) {
                    return c;
                }
            }
        }
        return null;
    }

    /**
     * 获取全部组件
     */
    public static GetAllNode<M extends NodePropsData, T extends typeof BasePureComponent<M>>(this: T): InstanceType<T>[] | void {
        let r: InstanceType<T>[] = [];
        for (let k in BasePureComponentSystem.AllBasePureComp) {
            if (BasePureComponentSystem.AllBasePureComp[k].constructor.name == this.name) {
                r.push(BasePureComponentSystem.AllBasePureComp[k] as InstanceType<T>);
            }
        }
        return r;
    }
    /**
     * 获取唯一的组件
     * @param this
     * @returns
     */
    public static GetInstance<M extends NodePropsData, T extends typeof BasePureComponent<M>>(this: T): InstanceType<T> | void {
        let r = this.GetAllNode();
        if (r && r.length == 1) {
            return r[0] as InstanceType<T>;
        } else if (r && r.length > 1) {
            throw new Error("NodeComponent is not only");
        }
        return null as any;
    }

    public static GetInstanceByName<T>(name: string): T {
        let r: T[] = [];
        for (let k in BasePureComponentSystem.AllBasePureComp) {
            if (BasePureComponentSystem.AllBasePureComp[k].constructor.name == name) {
                r.push(BasePureComponentSystem.AllBasePureComp[k] as any);
            }
        }
        if (r && r.length == 1) {
            return r[0] as T;
        } else if (r && r.length > 1) {
            throw new Error("NodeComponent is not only");
        }
        return null as any;
    }


    public async addNodeChildAsyncAt<M extends NodePropsData, T extends typeof BasePureComponent<M>>(nodeName: string, nodeType: T,
        nodeData: M = {} as any, index: number = -1) {
        return new Promise<InstanceType<T>>((resolve, reject) => {
            let node = this.addNodeChildAt<M, T>(nodeName, nodeType, nodeData, index);
            if (node) {
                BasePureComponentSystem.AllAsyacResolve[(node as ReactElement).key as string] = resolve;
                this.UpdateSelf();
            } else {
                this.UpdateSelf();
                reject(node);
            }
        });
    }

    /**
     * 同步删除自己（组件类，触发组件的销毁事件）
     * @param time 时间
     */
    public destroy() {
        if (this.__root__ && this.__root__.current) {
            let nodeinfo = BasePureComponentSystem.GetReactElement(this.InstanceId);
            if (nodeinfo) {
                nodeinfo.Domain.removeNodeChild(nodeinfo.NodeParentName, nodeinfo.Node);
                nodeinfo.Domain.UpdateSelf();
                return;
            }
            // 无法从父节点删除，就直接删除自己
            // 警告：并没有销毁组件实例，可能有内存泄漏
            LogHelper.warn("destroy by self, not by parent , maybe cause Memory Leak : " + this.constructor.name);
            this.closeNode();
            this.componentWillUnmount();
        }
    }
    public showNode(nodeName: string) {
        // 清理节点
        let _isValidName = this.getNode_isValid_Name(nodeName);
        let nodeisValid: Array<JSX.Element> = (this as any)[_isValidName];
        if (nodeisValid == null) {
            throw new Error(this.constructor.name + " dont have node : " + nodeName);
        }
        // 清除节点显示逻辑
        (this as any)[_isValidName] = true;
    }
    public clearNode(nodeName: string) {
        // 清理节点
        let _childsName = this.getNode_childs_Name(nodeName);
        let parentNode: Array<JSX.Element> = (this as any)[_childsName];
        if (parentNode == null) {
            throw new Error(this.constructor.name + " dont have node : " + nodeName);
        }
        (this as any)[_childsName] = [];
    }

    public closeNode(nodeName: string = this.NODENAME.__root__, isDestroy: boolean = true) {
        if (isDestroy) {
            let _childsName = this.getNode_childs_Name(nodeName);
            let parentNode: Array<JSX.Element> = (this as any)[_childsName];
            if (parentNode == null) {
                throw new Error(this.constructor.name + " dont have node : " + nodeName);
            }
            (this as any)[_childsName] = [];
        }
        // 清理节点
        let _isValidName = this.getNode_isValid_Name(nodeName);
        let nodeisValid: Array<JSX.Element> = (this as any)[_isValidName];
        if (nodeisValid == null) {
            throw new Error(this.constructor.name + " dont have node : " + nodeName);
        }
        // 清除节点显示逻辑
        (this as any)[_isValidName] = false;
        this.UpdateSelf();
    }

    /**
     * 关闭界面
     * @param destroy 是否销毁自己
     */
    public close() {
        if (this.IsClosed) { return; }
        (this.IsClosed as any) = true;
        if (this.__root__ && this.__root__.current) {
            this.__root__.current.visible = false;
            this.UpdateSelf();
        }
        this.destroy();
    }
    public show() {
        if (this.__root__ && this.__root__.current) {
            this.__root__.current.style.opacity = 1 + "";
            this.UpdateSelf();
        }
    }
    public hide() {
        if (this.__root__ && this.__root__.current) {
            this.__root__.current.style.opacity = 0 + "";
            this.UpdateSelf();
        }
    }
    public IsHide() {
        if (this.__root__ && this.__root__.current && this.__root__.current.style.opacity != null) {
            return Number(this.__root__.current.style.opacity) == 0;
        }
        return false;
    }
    private allGameEventID: GameEventListenerID[] = [];
    /**添加游戏事件 */
    public addGameEvent(eventName: GameEnum.GameEvent, handler: (e?: any) => void) {
        let eventid = GameEvents.Subscribe(eventName, handler);
        this.allGameEventID.push(eventid);
        return eventid;
    }
    private _updateSelf = 0;
    /**刷新自己 */
    public UpdateSelf() {
        this._updateSelf += 1;
        if (this._updateSelf > 10000) {
            this._updateSelf = 0;
        }
        this.UpdateState({ _updateSelf: this._updateSelf });
    };

    public delayUpdateSelf() {
        GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
            if (this.IsRegister) {
                this.UpdateSelf();
            }
        }));
    };
    // 初始化数据
    public componentDidMount() {
        // 同步样式
        for (let k in this.props) {
            if (CSSHelper.IsCssStyle(k)) {
                this.__root__.current!.style[k as keyof VCSSStyleDeclaration] = this.props[k];
            }
        }
        (this as any).InstanceId = this.props.__onlykey__ || GGenerateUUID();
        CSSHelper.SavePanelData(this.__root__.current!, "__onlykey__", this.InstanceId);
        this.setRegister(true);
        this.onStartUI();
    }
    private useEffectPropList: { func: () => void, prop: string[] }[];
    public useEffectProps(func: () => void, ...prop: string[]) {
        if (this.useEffectPropList == null) {
            this.useEffectPropList = [];
        }
        this.useEffectPropList.push({ func: func, prop: prop });
    }
    private useEffectStateList: { func: () => void, state: string[] }[];
    /**
     *
     * @param func
     * @param state state中的key 对应的value 发生改变 会调用
     */
    public useEffectState(func: () => void, ...state: string[]) {
        if (this.useEffectStateList == null) {
            this.useEffectStateList = [];
        }
        this.useEffectStateList.push({ func: func, state: state });
    }
    public hasState(k: string) {
        return (this.state as any)[k] != null;
    }

    public componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>) {
        if (this.useEffectPropList) {
            for (let info of this.useEffectPropList) {
                if (info.prop.length == 0) {
                    info.func();
                }
                else {
                    for (let k of info.prop) {
                        if (this.props[k] != prevProps[k]) {
                            info.func();
                            break;
                        }
                    }
                }
            }
        }
        if (this.useEffectStateList) {
            for (let info of this.useEffectStateList) {
                if (info.state.length == 0) {
                    info.func();
                }
                else {
                    for (let k of info.state) {
                        if ((this.state as any)[k] != prevState[k]) {
                            info.func();
                            break;
                        }
                    }
                }
            }
        }
    }
    public componentWillUnmount() {
        this.onDestroy();
        this.setRegister(false);
        // 移除所有监听事件
        this.allGameEventID.forEach((e) => {
            GameEvents.Unsubscribe(e);
        });
        this.allGameEventID = [];
        GEventHelper.RemoveCaller(this);
        NetHelper.OffAllListenOnLua(this);
        GTimerHelper.ClearAll(this);
        let nodeinfo = BasePureComponentSystem.GetReactElement(this.InstanceId);
        if (nodeinfo) {
            BasePureComponentSystem.RegisterReactElement(nodeinfo.Node, false);
        }
    }
}

export class BaseEasyPureComponent extends BasePureComponent<NodePropsData>  {
}