// import React, { createElement, createRef, PureComponent } from "react";
// import { Component_Base } from "../game/components/Component_Base";
// import { CSSHelper } from "../helper/CSSHelper";
// import { FuncHelper } from "../helper/FuncHelper";
// import { LogHelper } from "../helper/LogHelper";
// import { TimerHelper } from "../helper/TimerHelper";
// import { GameEnum } from "./GameEnum";
// /**
//  * 节点数据
//  */
// interface NodeData extends Partial<VCSSStyleDeclaration> {
//     /**组件唯一key */
//     __onlykey__?: string;
//     /**指向组件指针 */
//     __this__?: BasePureComponent;
//     /**节点名称ref */
//     __nodename__?: string;
//     [k: string]: any;
// }
// interface GameComponent<T extends Component_Base> {
//     new(...args: any[]): T;
//     IsCanRepeatAdd: boolean;
// }
// /**UI组件 */
// interface UIComponent<T extends BasePureComponent> {
//     new(...args: any[]): T;
//     /**静态方法，检查用于渲染的数据是否准备OK */
//     IsReadyForRender(): boolean;
// }


// export class BasePureComponent extends PureComponent<{ [v: string]: any }> {
//     /**根节点 */
//     __root__: React.RefObject<Panel>;
//     /**全局唯一UUID，用于标识 */
//     readonly UUID: string = FuncHelper.generateUUID();
//     /**所有子节点名称数据 */
//     NODENAME = { __root__: '__root__' };
//     /**所有注册的事件毁掉函数 */
//     FUNCNAME = {};
//     /**全部的游戏组件 */
//     __bindComponent__: { [K: string]: Array<Component_Base> } = {};
//     /**根节点样式 */
//     CSS_0_0: Partial<VCSSStyleDeclaration> = {};
//     /**所有缓存的组件 */
//     static AllNodeComponent: { [k: string]: Array<BasePureComponent> } = {};
//     /**用于渲染界面的数据是否准备好 */
//     static IsReadyForRender() { return true };
//     /**类注册计数 */
//     constructor(props: any) {
//         super(props);
//         this.__root__ = null as any;
//         let _name = this.constructor.name;
//         BasePureComponent.AllNodeComponent[_name] = BasePureComponent.AllNodeComponent[_name] || [];
//         BasePureComponent.AllNodeComponent[_name].push(this);
//         LogHelper.print("constructor : " + this.constructor.name)
//     };
//     private __Data__: NodeData = {};
//     Data() {
//         return this.__Data__
//     }

//     /**
//      * 获取节点管理子节点数据对象变量名称
//      * @param nodeName
//      * @returns
//      */
//     getNode_childs_Name(nodeName: string): string {
//         return nodeName + '_childs'
//     }
//     /**
//      * 获取节点管理本节点属性变量名称
//      * @param nodeName
//      * @returns
//      */
//     getNode_attrs_Name(nodeName: string): string {
//         return nodeName + '_attrs'
//     }
//     /**
//      * 获取节点管理本节点是否销毁
//      * @param nodeName
//      * @returns
//      */
//     getNode_isValid_Name(nodeName: string): string {
//         return nodeName + '_isValid'
//     }
//     /**
//      * 关闭界面
//      * @param destroy 是否销毁自己
//      */
//     close(destroy = true) {
//         if (this.__root__ && this.__root__.current) {
//             this.__root__.current.visible = false
//             this.updateSelf()
//         }
//         if (destroy) {
//             this.destroy()
//         }
//     }
//     /**
//      * 同步删除自己（组件类，触发组件的销毁事件）
//      * @param time 时间
//      */
//     destroy() {
//         if (this.__root__ && this.__root__.current) {
//             // 优先从父节点删除
//             let parent = this.__root__.current.GetParent();
//             if (parent) {
//                 let _data = parent.Data() as NodeData;
//                 let k = this.getNodeData()!.__onlykey__;
//                 let index = null;
//                 if (_data.__this__ && _data.__nodename__ && k) {
//                     let _self = _data.__this__;
//                     let childs_Name = _self.getNode_childs_Name(_data.__nodename__);
//                     let arr_childs: Array<JSX.Element> = (_self as any)[childs_Name];
//                     let leng = arr_childs.length;
//                     for (let i = 0; i < leng; i++) {
//                         let _n = arr_childs[i];
//                         if (_n.type.name == this.constructor.name && _n.key == k) {
//                             index = i;
//                             break
//                         }
//                     }
//                     if (index != null) {
//                         _self.removeChildAt_childs(_data.__nodename__, index);
//                         _self.updateSelf()
//                         return
//                     }

//                 }
//             }
//             // 无法从父节点删除，就直接删除自己
//             // 警告：并没有销毁组件实例，可能有内存泄漏
//             LogHelper.warn('destroy by self, not by parent , maybe cause Memory Leak : ' + this.constructor.name)
//             // 只删除根节点，没有销毁组件类
//             this.destroyNode();
//             this.updateSelf();
//         }
//     }
//     /**
//      * 删除node节点以及子节点
//      * @param nodeName 默认根节点
//      */
//     public destroyNode(nodeName: string = this.NODENAME.__root__) {
//         // 清理计时器
//         if (nodeName == this.NODENAME.__root__) { TimerHelper.removeAllTimer(this) };
//         // 清理节点
//         let _isValidName = this.getNode_isValid_Name(nodeName);
//         let nodeisValid: Array<JSX.Element> = (this as any)[_isValidName];
//         if (nodeisValid == null) {
//             throw Error(this.constructor.name + " dont have node : " + nodeName)
//         }
//         // 清除节点显示逻辑
//         (this as any)[_isValidName] = false;
//         // 遍历子节点
//         let node: Panel = (this as any)[nodeName].current;
//         if (node) {
//             let nodearr: Array<Panel> = [];
//             nodearr.push(node);
//             while (nodearr.length > 0) {
//                 let _node = nodearr.shift() as Panel;
//                 let childCount = _node.GetChildCount();
//                 for (let i = 0; i < childCount; i++) {
//                     let _child = _node.GetChild(i);
//                     if (_child) {
//                         let _data: NodeData = _child.Data();
//                         // 证明是子节点
//                         if (_data.__this__ && _data.__nodename__) {
//                             // 自己的子节点，而非其他组件类
//                             if (_data.__this__.UUID == this.UUID) {
//                                 this.destroyNode(_data.__nodename__)
//                             }
//                             // 其他的组件放在下面的子节点，可以不做处理，不渲染自己会销毁
//                         }
//                         // 非子节点
//                         else {
//                             nodearr.push(_child)
//                         }
//                     }
//                 }
//             }
//             // 清理node节点Data数据的互相引用
//             let _data: NodeData = node.Data();
//             for (let key in _data) {
//                 delete _data[key]
//             }
//             // 清理node节点_childs内的数据
//             let _childsName = this.getNode_childs_Name(nodeName);
//             let parentNode: Array<JSX.Element> = (this as any)[_childsName];
//             if (parentNode != null) {
//                 parentNode.length = 0;
//                 this.removeAllChild_childs(nodeName);
//             }
//             // 清理node节点_attrs内的数据
//             let attrs_str = this.getNode_attrs_Name(nodeName);
//             let attrs_obj = (this as any)[attrs_str];
//             if (attrs_obj) {
//                 (this as any)[attrs_str] = {};
//             }
//             // 清理FUNCNAME中的注册函数
//             for (let _k in this.FUNCNAME) {
//                 let _belongInfo = (this.FUNCNAME as any)[_k]
//                 // 节点名字相同
//                 if (_belongInfo.nodeName == nodeName) {
//                     if (_belongInfo.type) {
//                         // 清除界面事件
//                         node.ClearPanelEvent(_belongInfo.type);
//                         // LogHelper.print(`clearEvent: nodename=${nodeName} eventname=${_belongInfo.type} `)
//                     }
//                     // 销毁函数
//                     (this as any)[_k] && ((this as any)[_k] = undefined);
//                 }
//             }
//             // LogHelper.print(`clsname=${this.constructor.name} nodename=${nodeName}  `)
//         }
//     }

//     /**
//      * 节点添加事件
//      * @param nodeName
//      * @param eventName
//      * @param handler
//      */
//     public addNodeEvent(nodeName: string, eventName: PanelEvent, handler: () => void) {
//         if ((this.NODENAME as any)[nodeName] == null) {
//             throw Error(this.constructor.name + " dont have node : " + nodeName)
//         }
//         let node: Panel = (this as any)[nodeName].current;
//         if (node) {
//             // 这里会替换原有的函数，同一个节点不能添加多个相同类型的监听函数
//             node.SetPanelEvent(eventName, handler)
//             for (let k in this.FUNCNAME) {
//                 let v = (this.FUNCNAME as any)[k];
//                 if (v.nodeName == nodeName && v.type == eventName) {
//                     LogHelper.warn(`event repeat: nodeName=${nodeName} eventName=${eventName} `)
//                     return
//                 }
//             }
//             let handlerName = handler.name;
//             if (handlerName == "") { handlerName = this.getKey() };
//             handlerName = 'FUNC_' + handlerName;
//             (this.FUNCNAME as any)[handlerName] = { nodeName: nodeName, type: eventName };
//         }
//     }
//     public allGameEventID: GameEventListenerID[] = [];
//     /**添加游戏事件 */
//     public addGameEvent(eventName: GameEnum.GameEvent, handler: (e?: any) => void) {
//         let eventid = GameEvents.Subscribe(eventName, handler)
//         this.allGameEventID.push(eventid);
//         return eventid
//     }

//     /**
//      * 获取随机KEY
//      * @param len
//      * @returns
//      */
//     public getKey(len: number = 10): string {
//         const randStr = () => Math.random().toString(36).substr(2);
//         let str = randStr();
//         while (str.length < len) {
//             str += randStr();
//         }
//         return str.substr(0, len);
//     }

//     /**
//      * 向_childs中添加子节点
//      * @param nodeName 添加的父节点名称，在 this.nodeName中
//      * @param nodeType 子节点类型
//      * @param nodeData 子节点数据，相当于this.props
//      * @param index 添加的索引，默认在父节点最后添加
//      * @returns
//      */
//     public addChildAt_childs<T extends BasePureComponent>(nodeName: string, nodeType: UIComponent<T>, nodeData: NodeData = {}, index: number = -1): JSX.Element | void {
//         if (nodeType.IsReadyForRender && !nodeType.IsReadyForRender()) { return }
//         // 添加唯一Key
//         if (nodeData.key == null) {
//             nodeData.key = this.getKey();
//             // 复制一份存起来
//             nodeData.__onlykey__ = nodeData.key;
//         }
//         let _childsName = this.getNode_childs_Name(nodeName);
//         let parentNode: Array<JSX.Element> = (this as any)[_childsName];
//         if (parentNode == null) {
//             throw Error(this.constructor.name + " dont have node : " + nodeName)
//         }
//         let node = createElement(nodeType, nodeData);
//         if (index == -1) { parentNode = parentNode.concat([node]) }
//         else {
//             parentNode.splice(index, 0, node);
//             parentNode = parentNode.concat([]);
//         }
//         // 新的数组内存位置改变才能刷新UI
//         (this as any)[_childsName] = parentNode;
//         return node;
//     }
//     /**
//      * 移除_childs中子节点
//      * @param nodeName 添加的父节点名称，在 this.nodeName中
//      * @param index 序列 默认=-1最后
//      * @returns
//      */
//     public removeChildAt_childs(nodeName: string, index: number = -1): JSX.Element | undefined {
//         let _childsName = this.getNode_childs_Name(nodeName);
//         let parentNode: Array<JSX.Element> = (this as any)[_childsName];
//         if (parentNode == null) {
//             throw Error(this.constructor.name + " dont have node : " + nodeName)
//         }
//         if (parentNode.length == 0) { return };
//         let child;
//         if (index == -1) { child = parentNode.pop(); }
//         else { child = parentNode.splice(index, 1)[0]; }
//         // 新的数组内存位置改变才能刷新UI
//         (this as any)[_childsName] = parentNode.concat([]);
//         return child;
//     }
//     /**
//      * 移除某个类型的第一一个组件子节点
//      * @param nodeName
//      * @param nodeType
//      * @returns
//      */
//     public removeOneTypeChild_childs<T extends BasePureComponent>(nodeName: string, nodeType: UIComponent<T>): JSX.Element | undefined {
//         let _childsName = this.getNode_childs_Name(nodeName);
//         let parentNode: Array<JSX.Element> = (this as any)[_childsName];
//         if (parentNode == null) {
//             throw Error(this.constructor.name + " dont have node : " + nodeName)
//         }
//         let node;
//         let nodeindex;
//         let len = parentNode.length;
//         for (let i = 0; i < len; i++) {
//             let _node = parentNode[i];
//             if (_node.type == nodeType) {
//                 node = _node;
//                 nodeindex = i;
//                 break
//             }
//         }
//         if (parentNode.length == 0) { return };
//         if (nodeindex != null) {
//             let child = parentNode.splice(nodeindex, 1)[0];
//             // 新的数组内存位置改变才能刷新UI
//             (this as any)[_childsName] = parentNode.concat([]);
//             return child;
//         }
//     }

//     /**
//      * 删除_childs中所有子节点
//      * @param nodeName 添加的父节点名称，在 this.nodeName中
//      * @returns
//      */
//     public removeAllChild_childs(nodeName: string): Array<JSX.Element> {
//         let _childsName = this.getNode_childs_Name(nodeName);
//         let parentNode: Array<JSX.Element> = (this as any)[_childsName];
//         if (parentNode == null) {
//             throw Error(this.constructor.name + " dont have node : " + nodeName)
//         }
//         (this as any)[_childsName] = [];
//         return parentNode
//     }

//     /**
//      * 根据Key找到子节点
//      * @param nodeName 节点名称
//      * @param key 关键KEY
//      * @returns
//      */
//     public findChildByKey(nodeName: string, key: string): Panel | undefined {
//         let _parent = (this as any)[nodeName];
//         if (_parent == null || _parent.current == null) {
//             throw Error(this.constructor.name + " dont have node : " + nodeName)
//         }
//         let leng = _parent.current.GetChildCount();
//         for (let i = 0; i < leng; i++) {
//             let _child: Panel = _parent.current.GetChild(i);
//             if (_child && _child.Data() && (_child.Data() as NodeData).__onlykey__ == key) {
//                 return _child
//             }
//         }
//     }
//     /**
//      * 在节点下，添加唯一新组件。如果有就组建，则复用
//      * @param nodeName 节点名称
//      * @param nodeType nodeType 子节点类型
//      * @param nodeData 子节点数据，相当于this.props
//      * @returns
//      */
//     public showOnlyNodeComponent<T extends BasePureComponent>(nodeName: string, nodeType: UIComponent<T>, nodeData: NodeData = {}): JSX.Element | void {
//         if (nodeType.IsReadyForRender && !nodeType.IsReadyForRender()) { return };
//         let _childsName = this.getNode_childs_Name(nodeName);
//         let parentNode: Array<JSX.Element> = (this as any)[_childsName];
//         if (parentNode == null) {
//             throw Error(this.constructor.name + " dont have node : " + nodeName)
//         }
//         let node;
//         let nodeindex;
//         let len = parentNode.length;
//         for (let i = 0; i < len; i++) {
//             let _node = parentNode[i];
//             if (_node.type == nodeType) {
//                 node = _node;
//                 nodeindex = i;
//                 break
//             }
//         }
//         // 老元素复用
//         if (node && node.key) {
//             let _p = this.findChildByKey(nodeName, "" + node.key);
//             if (_p) {
//                 // 改变元素层级，显示在最上层
//                 if (nodeindex != null) {
//                     parentNode = parentNode.concat(parentNode.splice(nodeindex, 1))
//                 }
//                 _p.visible = true
//                 return node
//             }
//         }
//         // 循环删除老元素
//         if (nodeindex != null) {
//             this.removeChildAt_childs(nodeName, nodeindex)
//             this.showOnlyNodeComponent(nodeName, nodeType, nodeData)
//         }
//         // 增加新元素
//         return this.addChildAt_childs(nodeName, nodeType, nodeData)
//     }
//     /**
//      * @deprecated
//      * 找到一个子节点的Panel
//      * @param nodeName
//      * @param nodeType
//      * @returns
//      */
//     public getOneNodePanel<T extends BasePureComponent>(nodeName: string, nodeType: UIComponent<T>) {
//         let _childsName = this.getNode_childs_Name(nodeName);
//         let parentNode: Array<JSX.Element> = (this as any)[_childsName];
//         if (parentNode == null) {
//             throw Error(this.constructor.name + " dont have node : " + nodeName)
//         }
//         let node;
//         let nodeindex;
//         let len = parentNode.length;
//         for (let i = 0; i < len; i++) {
//             let _node = parentNode[i];
//             if (_node.type == nodeType) {
//                 node = _node;
//                 nodeindex = i;
//                 break
//             }
//         }
//         // 老元素复用
//         if (node && node.key) {
//             return this.findChildByKey(nodeName, "" + node.key);
//         }
//     }
//     /**
//      * 获取子节点所有组件
//      * @param nodeName
//      * @param nodeType
//      * @returns
//      */
//     public getChildNodeComponent<T extends BasePureComponent>(nodeName: string, nodeType: UIComponent<T>) {
//         let _childsName = this.getNode_childs_Name(nodeName);
//         let parentNode: Array<JSX.Element> = (this as any)[_childsName];
//         if (parentNode == null) {
//             throw Error(this.constructor.name + " dont have node : " + nodeName)
//         }
//         let len = parentNode.length;
//         let r: T[] = [];
//         for (let i = 0; i < len; i++) {
//             let _node = parentNode[i];
//             if (_node.type.name == nodeType.name) {
//                 let c = (nodeType as any).GetNodeComponentByKey(_node.key as string)
//                 c && r.push(c);
//             }
//         }
//         if (r.length > 0) {
//             return r;
//         }
//     }


//     /**
//      * 获取全部组件
//      */
//     static GetNodeComponent<T extends typeof BasePureComponent>(this: T): InstanceType<T>[] | void {
//         let r = BasePureComponent.AllNodeComponent[this.name];
//         if (r && r.length > 0) { return r as InstanceType<T>[] }
//     }
//     /**
//      * 获取唯一的组件
//      * @param this
//      * @returns
//      */
//     static GetOnlyNodeComponent<T extends typeof BasePureComponent>(this: T): InstanceType<T> | void {
//         let r = BasePureComponent.AllNodeComponent[this.name];
//         if (r && r.length == 1) {
//             return r[0] as InstanceType<T>
//         }
//         else if (r && r.length > 1) {
//             throw new Error('NodeComponent is not only')
//         }
//     }

//     /**根据KEY获取前组件 */
//     static GetNodeComponentByKey<T extends typeof BasePureComponent>(this: T, KEY: string): InstanceType<T> | void {
//         if (KEY == null) { return }
//         let r = BasePureComponent.AllNodeComponent[this.name];
//         if (r && r.length > 0) {
//             for (let _n of r) {
//                 let nodedata = _n.getNodeData()
//                 if (nodedata && nodedata.__onlykey__ == KEY) { return _n as InstanceType<T> }
//             }
//         }
//     }

//     //#region 游戏组件部分
//     /**
//      * 添加游戏组件
//      * @param Component
//      * @param args
//      * @returns
//      */
//     public addGameComponent<T extends Component_Base>(Component: GameComponent<T>, ...args: any[]) {
//         // 不能重复添加
//         if (!Component.IsCanRepeatAdd) {
//             let error = false;
//             let c = this.GetGameComponent(Component);
//             if (c && c instanceof Array) {
//                 if (c.length > 0) {
//                     error = true
//                 }
//             }
//             else {
//                 if (c != null) {
//                     error = true
//                 }
//             }
//             if (error) {
//                 LogHelper.warn(`addComponent Fail: ${this.constructor.name} CantRepeatAddComponent ${Component.name}`)
//                 return
//             }
//         }
//         let newComp = ComponentFactory.create(Component, ...args);
//         this.__bindComponent__[Component.name] = this.__bindComponent__[Component.name] || [];
//         this.__bindComponent__[Component.name].push(newComp)
//         newComp.bindparent(this);
//         newComp.onAwake();
//         return newComp
//     }
//     /**
//      * 获取游戏组件
//      * @param Component
//      * @returns
//      */
//     public GetGameComponent<T extends Component_Base>(Component: GameComponent<T>): undefined | T | Array<T> {
//         if (this.__bindComponent__ && this.__bindComponent__[Component.name]) {
//             if (Component.IsCanRepeatAdd) {
//                 return this.__bindComponent__[Component.name] as Array<T>;
//             }
//             else {
//                 return this.__bindComponent__[Component.name][0] as T;
//             }
//         }
//     }

//     /**
//      * 移除游戏组件
//      * @param Component
//      * @param removeAll
//      */
//     public removeGameComponent<T extends Component_Base>(Component: GameComponent<T>, removeAll: boolean = true): void {
//         if (this.__bindComponent__[Component.name]) {
//             if (removeAll) {
//                 while (this.__bindComponent__[Component.name].length > 0) {
//                     let c = this.__bindComponent__[Component.name].pop();
//                     c && c.destroy();
//                 }
//             }
//             else {
//                 let c = this.__bindComponent__[Component.name].pop();
//                 c && c.destroy()
//             }
//         }
//     }

//     /**
//      * 销毁所有游戏组件
//      */
//     public removeAllGameComponent() {
//         if (this.__bindComponent__) {
//             for (let k in this.__bindComponent__) {
//                 while (this.__bindComponent__[k].length > 0) {
//                     let c = this.__bindComponent__[k].pop();
//                     c && c.destroy();
//                 }
//             }
//             this.__bindComponent__ = {};
//         }
//     }

//     //#endregion

//     private _updateSelf = 0;
//     /**刷新自己 */
//     public updateSelf = () => {
//         this._updateSelf += 1;
//         this.setState({ _updateSelf: this._updateSelf })
//     }

//     /**
//      * 生成九宫格子节点
//      * @param src 图片路径
//      * @param sirdGirdData 九宫格数据
//      * @param parentHeight
//      * @param parentwidth
//      * @param selfHeight 图片本身高度
//      * @param selfwidth 图片本身宽度
//      * @returns
//      */
//     getSirdGird(src: string, sirdGirdData: Array<number>, parentHeight: number, parentwidth: number, selfHeight: number, selfwidth: number) {
//         const [top, right, left, down] = sirdGirdData;
//         const maxX = 2048; const maxY = 2048;
//         const _widthX = parentwidth - selfwidth;
//         const _heightY = parentHeight - selfHeight;
//         // 块缩放
//         const usX = (parentwidth - left - right) / (selfwidth - left - right);
//         const usY = (parentHeight - top - down) / (selfHeight - top - down);
//         // y,x+n,y+n,x
//         let clipdata = [
//             // 角-左上
//             [0, left, top, 0],
//             // 角-右上
//             [0, maxX, top, selfwidth - right],
//             // 角-左下
//             [selfHeight - down, left, maxY, 0],
//             // 角-右下
//             [selfHeight - down, maxX, maxY, selfwidth - right],
//             // 块-上
//             [0, selfwidth - right, top, left],
//             // 块-下
//             [selfHeight - down, selfwidth - right, maxY, left],
//             // 块-左
//             [top, left, selfHeight - down, 0],
//             // 块-右
//             [top, maxX, selfHeight - down, selfwidth - right],
//             // 块-中央
//             [top, selfwidth - right, selfHeight - down, left],
//         ];
//         // x y uiScaleX uiScaleY
//         let positions = [
//             // 角-左上
//             [0, 0, 1, 1],
//             // 角-右上
//             [_widthX, 0, 1, 1],
//             // 角-左下
//             [0, _heightY, 1, 1],
//             // 角-右下
//             [_widthX, _heightY, 1, 1],
//             // 块-上
//             [left - left * usX, 0, usX, 1],
//             // 块-下
//             [left - left * usX, _heightY, usX, 1],
//             // 块-左
//             [0, top - top * usY, 1, usY],
//             // 块-右
//             [_widthX, top - top * usY, 1, usY],
//             // 块-中央
//             [left - left * usX, top - top * usY, usX, usY],
//         ];
//         let r: Array<JSX.Element> = [];
//         [...Array(9).keys()].forEach((i: number) => {
//             let _clipdata = clipdata[i];
//             let _positions = positions[i];
//             let _style: Partial<VCSSStyleDeclaration> = {
//                 "x": `${_positions[0]}px`,
//                 "y": `${_positions[1]}px` + "",
//                 "clip": `rect(${_clipdata[0]}px, ${_clipdata[1]}px, ${_clipdata[2]}px, ${_clipdata[3]}px)`,
//                 "uiScaleX": `${_positions[2] * 100}%`,
//                 "uiScaleY": `${_positions[3] * 100}%`
//             };
//             let e = <Image key={"sirdGird_" + i} src={src} style={_style} />
//             r.push(e)
//         })
//         return r
//     }

//     /**
//      * 获取节点缓存数据
//      */
//     getNodeData(nodeName: string = this.NODENAME.__root__) {
//         if ((this as any)[nodeName] && (this as any)[nodeName].current) {
//             return (this as any)[nodeName].current!.Data() as NodeData;
//         }
//     }

//     /**
//      * 根据this.props同步__root__的Data
//      */
//     syncRootDataByProps() {
//         let data = this.getNodeData();
//         // 保留数据
//         let reserve = ['__this__', '__nodename__', '__onlykey__']
//         if (data && this.props) {
//             for (let key in data) {
//                 if (reserve.indexOf(key) !== -1) { continue; }
//                 delete data[key];
//             }
//             for (let k in this.props) {
//                 data[k] = this.props[k]
//             }
//         }
//     }
//     /**
//      * 同步节点数据
//      */
//     syncDataByNodeName() {
//         for (let k in this.NODENAME) {
//             let node = (this as any)[k];
//             if (node) {
//                 let current = node.current;
//                 if (current) {
//                     let _data: NodeData = current.Data();
//                     _data.__this__ = this;
//                     _data.__nodename__ = k;
//                 }
//             }
//         }
//     }
//     /**每一帧刷新 */
//     onUpdate() {
//     }

//     /**
//      *开启每frame帧刷新
//      */
//     startUpdate = (frame = 1) => {
//         if (this.__update) {
//             this.onUpdate()
//             $.Schedule(Game.GetGameFrameTime() * frame, () => { this.startUpdate() });
//         }
//     }
//     private __update: boolean = true;
//     stopUpdate() {
//         this.__update = false;
//     }

//     private __isWaiting: boolean = true;
//     /**
//      * 等待b()为true，todo
//      * @param b
//      * @param contextB
//      * @param cb
//      * @param contextCB
//      */
//     waitFor(b: () => any, contextB: any, cb: () => void, contextCB: any = null) {
//         if (b.call(contextB)) {
//             cb.call(contextCB);
//         }
//         else {
//             if (this.__isWaiting) {
//                 $.Schedule(Game.GetGameFrameTime(), () => {
//                     this.waitFor(b, contextB, cb, contextCB);
//                 })
//             }
//         }
//     }
//     /**停止等待 */
//     stopWait() {
//         this.__isWaiting = false;
//     }
//     // 初始化数据
//     componentDidMount() {
//         // LogHelper.warn(this.constructor.name)
//         this.syncDataByNodeName()
//         this.syncRootDataByProps();
//         // 同步样式
//         for (let k in this.props) {
//             if ((CSSHelper.VCSSStyle as any)[k]) {
//                 (this.CSS_0_0 as any)[k] = this.props[k];
//                 this.__root__.current!.style[k as keyof VCSSStyleDeclaration] = this.props[k];
//             }
//         }
//         // 不遮挡tooltip
//         this.__root__.current!.hittest = false;
//     };
//     componentDidUpdate(prevProps: any, prevState: any, snapshot?: any) {
//         // LogHelper.warn(this.constructor.name)
//         this.syncRootDataByProps()
//     };
//     componentWillUnmount() {
//         this.stopUpdate();
//         this.stopWait();
//         this.__Data__ = {};
//         let _name = this.constructor.name;
//         BasePureComponent.AllNodeComponent[_name] = BasePureComponent.AllNodeComponent[_name] || [];
//         let len = BasePureComponent.AllNodeComponent[_name].length;
//         for (let i = len - 1; i >= 0; i--) {
//             if (BasePureComponent.AllNodeComponent[_name][i] == this) {
//                 BasePureComponent.AllNodeComponent[_name].splice(i, 1);
//                 break;
//             }
//         }
//         if (BasePureComponent.AllNodeComponent[_name].length == 0) {
//             delete BasePureComponent.AllNodeComponent[_name]
//         }
//         this.removeAllGameComponent();
//         this.destroyNode()
//         // 移除所有监听事件
//         this.allGameEventID.forEach(e => {
//             GameEvents.Unsubscribe(e);
//         })
//     }
// }


