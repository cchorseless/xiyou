import React, { createElement, createRef, PureComponent } from "react";
import { CSSHelper } from "../helper/CSSHelper";
import { EventHelper } from "../helper/EventHelper";
import { FuncHelper } from "../helper/FuncHelper";
import { LogHelper } from "../helper/LogHelper";
import { PrecacheHelper } from "../helper/PrecacheHelper";
import { TimerHelper } from "../helper/TimerHelper";
import { ET } from "./Entity";
import { GameEnum } from "./GameEnum";

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
// export type NodePropsData = _NodePropsData;
export type NodePropsData = _NodePropsData & Partial<VCSSStyleDeclaration>;

interface ReactElement extends React.CElement<NodePropsData, BasePureComponent<NodePropsData>> { }

interface ReactElementNodeInfo {
    Node: ReactElement;
    Domain: BasePureComponent<NodePropsData>;
    NodeParentName: string;
}

export const registerUI = () => (entity: typeof BasePureComponent<NodePropsData>) => {
    PrecacheHelper.RegClass([entity as any]);
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

export class BasePureComponent<P extends NodePropsData, B extends Panel = Panel> extends PureComponent<P> implements ET.IEntityRoot {
    static PanelZorder = 1;
    ETRoot?: ET.EntityRoot;
    /**根节点 */
    __root__: React.RefObject<B>;
    /**全局唯一UUID，用于标识 */
    readonly InstanceId: string;
    readonly IsRegister: boolean = false;
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
    /**数据准备检查 */
    public onReady(): boolean { return true; }

    /**创建前，指定属性，添加事件 */
    public onInitUI() { }

    /**
     * 渲染后一帧执行
     * @override
     */
    public onStartUI() { }
    public onRefreshUI(...args: any[]) { }
    public onDestroy() { }

    /**
     * 获取state 数据
     * @param key
     * @param isWithRef
     * @returns
     */
    public GetState<T>(key: string) {
        let obj = ((this.state || {}) as any)[key];
        return obj as T;
    }

    public GetStateEntity<T extends { InstanceId: string }>(entity: T) {
        if (entity == null) { return null }
        let obj = (this.state as any)[entity.InstanceId];
        if (obj) {
            return obj.Ref as T
        }
    }

    public UpdateState(obj: { [k: string]: any }) {
        if (!obj) { return; }
        if (this.IsRegister) {
            this.setState(obj);
        }
        else {
            this.state = Object.assign(this.state || {}, obj)
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
        let instanceId = FuncHelper.generateUUID();
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

    public addOnlyOneNodeChild<M extends NodePropsData, T extends typeof BasePureComponent<M>>(nodeName: string, nodeType: T, nodeData: M = {} as any) {
        let comp = this.GetOneNodeChild<M, T>(nodeName, nodeType);
        if (comp) {
            comp.__root__.current!.visible = true;
            if (Object.keys(nodeData).length > 0) {
                comp.onRefreshUI(nodeData);
            }
            comp.updateSelf();
        } else {
            this.addNodeChildAt<M, T>(nodeName, nodeType, nodeData);
        }
    }



    public async addOrShowOnlyNodeChild<M extends NodePropsData, T extends typeof BasePureComponent<M>>(nodeName: string, nodeType: T, nodeData: M = {} as any) {
        let comp = this.GetOneNodeChild<M, T>(nodeName, nodeType);
        if (comp == null) {
            comp = await this.addNodeChildAsyncAt<M, T>(nodeName, nodeType, nodeData);
        } else {
            comp.__root__.current!.visible = true;
            if (Object.keys(nodeData).length > 0) {
                comp.onRefreshUI(nodeData);
            }
            comp.updateSelf();
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
                this.updateSelf();
            } else {
                this.updateSelf();
                reject(node);
            }
        });
    }

    /**
     * 同步删除自己（组件类，触发组件的销毁事件）
     * @param time 时间
     */
    public destroy() {
        this.onDestroy();
        if (this.__root__ && this.__root__.current) {
            let nodeinfo = BasePureComponentSystem.GetReactElement(this.InstanceId);
            if (nodeinfo) {
                nodeinfo.Domain.removeNodeChild(nodeinfo.NodeParentName, nodeinfo.Node);
                nodeinfo.Domain.updateSelf();
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
        this.updateSelf();
    }

    /**
     * 关闭界面
     * @param destroy 是否销毁自己
     */
    public close(destroy = true) {
        if (this.__root__ && this.__root__.current) {
            this.__root__.current.visible = false;
            this.updateSelf();
        }
        if (destroy) {
            this.destroy();
        }
    }
    public show() {
        if (this.__root__ && this.__root__.current) {
            this.__root__.current.style.opacity = 1 + "";
            this.updateSelf();
        }
    }
    public hide() {
        if (this.__root__ && this.__root__.current) {
            this.__root__.current.style.opacity = 0 + "";
            this.updateSelf();
        }
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
    public updateSelf = () => {
        this._updateSelf += 1;
        this.UpdateState({ _updateSelf: this._updateSelf });
    };

    public delayUpdateSelf = () => {
        TimerHelper.AddFrameTimer(
            1,
            FuncHelper.Handler.create(this, () => {
                if (this.IsRegister) {
                    this.updateSelf();
                }
            })
        );
    };
    // 初始化数据
    public componentDidMount() {
        // 同步样式
        for (let k in this.props) {
            if (CSSHelper.IsCssStyle(k)) {
                this.__root__.current!.style[k as keyof VCSSStyleDeclaration] = this.props[k];
            }
        }
        // 不遮挡tooltip
        // this.__root__.current!.hittest = false;
        (this as any).InstanceId = this.props.__onlykey__ || FuncHelper.generateUUID();
        this.setRegister(true);
        // 下一帧开始刷新
        TimerHelper.AddFrameTimer(1,
            FuncHelper.Handler.create(this, () => {
                if (this.IsRegister) {
                    this.onStartUI();
                }
            })
        );
    }

    public componentWillUnmount() {
        this.setRegister(false);
        // 移除所有监听事件
        this.allGameEventID.forEach((e) => {
            GameEvents.Unsubscribe(e);
        });
        this.allGameEventID = [];
        EventHelper.RemoveCaller(this);
        TimerHelper.ClearAll(this);
        let nodeinfo = BasePureComponentSystem.GetReactElement(this.InstanceId);
        if (nodeinfo) {
            BasePureComponentSystem.RegisterReactElement(nodeinfo.Node, false);
        }
    }
}

export class BaseEasyPureComponent extends BasePureComponent<NodePropsData>  {
}