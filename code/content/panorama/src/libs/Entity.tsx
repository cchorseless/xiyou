import { EventHelper } from "../helper/EventHelper";
import { FuncHelper } from "../helper/FuncHelper";
import { LogHelper } from "../helper/LogHelper";
import { NetHelper } from "../helper/NetHelper";
import { PrecacheHelper } from "../helper/PrecacheHelper";
import { TimerHelper } from "../helper/TimerHelper";

export const registerET = () => (entity: typeof ET.Entity) => {
    PrecacheHelper.RegClass([entity as any]);
};

export module ET {
    interface IEntityJson {
        _t: string;
        _id: string;
        _p_instanceid?: string;
        _nettable?: string;
        Children?: { [K: string]: IEntityJson };
        C?: { [K: string]: IEntityJson };
        [K: string]: any;
    }
    interface IEntityProperty {
        InstanceId: string;
        Id: string;
        NetTableName?: string;
        IsRegister: boolean;
        Parent: Entity | null;
        Domain: IEntityRoot | null;
        Children: { [K: string]: Entity } | null;
        Components: { [K: string]: Component } | null;
    }

    interface IEntityFunc {
        /**初始化 */
        onAwake?(...args: any[]): void;
        /**重载组件 */
        onReload?(): void;
        /**帧刷新 */
        onUpdate?(): void;
        /**销毁前 */
        onDestroy?(): void;
    }

    export interface IEntityRoot {
        ETRoot?: EntityRoot;
    }

    export class EntityEventSystem {
        private static AllEntity: { [instanceId: string]: Entity } = {};
        static RegisterSystem(entity: Entity, b: boolean) {
            if (b) {
                if (entity.InstanceId == null || EntityEventSystem.AllEntity[entity.InstanceId] != null) {
                    throw new Error("RegisterSystem error");
                }
                EntityEventSystem.AllEntity[entity.InstanceId] = entity;
            } else {
                if (entity.InstanceId == null || EntityEventSystem.AllEntity[entity.InstanceId] == null) {
                    throw new Error("UnRegisterSystem error");
                }
                delete EntityEventSystem.AllEntity[entity.InstanceId];
            }
        }

        static GetEntity(instanceId: string) {
            return EntityEventSystem.AllEntity[instanceId];
        }

        static Awake(entity: Entity, ...args: any[]) {
            entity.onAwake && entity.onAwake(...args);
        }

        static SerializeToEntity(entity: Entity) {
            entity.onSerializeToEntity && entity.onSerializeToEntity();
        }
        static Destroy(entity: Entity) {
            entity.onDestroy && entity.onDestroy();
        }
    }

    export class Entity extends Object implements IEntityFunc {
        public readonly InstanceId: string;
        public readonly Id: string;
        public readonly NetTableName: string;
        public readonly IsRegister: boolean = false;
        public readonly IsComponent: boolean = false;
        public readonly Parent: Entity;
        public readonly Domain: IEntityRoot;
        public readonly Children: { [uuid: string]: Entity };
        public readonly Components: { [name: string]: Component };
        public get updateEventName() {
            return "updateEntity_" + this.InstanceId;
        }
        onSerializeToEntity?(): void;

        /**初始化 */
        onAwake?(...args: any[]): void;
        /**重载组件 */
        onReload?(): void;
        /**每一帧刷新 */
        onUpdate?(): void;
        onRemove?(): void;
        onDestroy?(): void;

        IsFromLocalNetTable() {
            if (this.NetTableName == NetHelper.GetETEntityNetTableName()) {
                return true;
            }
            if (this.NetTableName == NetHelper.GetETEntityNetTableName(Players.GetLocalPlayer())) {
                return true;
            }
            return false;
        }


        public updateFromJson(json: IEntityJson) {
            let ignoreKey = ["_t", "_id", "Children", "C"];
            for (let k in json) {
                if (ignoreKey.indexOf(k) == -1) {
                    (this as any)[k] = json[k];
                }
            }
            if (json.Children) {
                let _childs = Object.values(json.Children);
                if (this.Children != null) {
                    let keys = Object.keys(this.Children);
                    for (let k of keys) {
                        let isdrop = true;
                        for (let _child of _childs) {
                            if (k == _child._id) {
                                this.GetChild(k)?.updateFromJson(_child);
                                isdrop = false;
                                break;
                            }
                        }
                        if (isdrop) {
                            this.Children[k]?.RemoveSelf();
                        }
                    }
                }
                for (let info of _childs) {
                    if (this.GetChild(info._id) == null) {
                        let entity = Entity.FromJson(info);
                        if (this.IsRegister) {
                            this.AddOneChild(entity);
                        }
                        else {
                            (entity as IEntityProperty).Parent = this;
                            this.AddToChildren(entity);
                        }
                        if (this.NetTableName) {
                            (entity.NetTableName as any) = this.NetTableName;
                        }
                    }
                }
            }
            if (json.C) {
                if (this.Components != null) {
                    let keys = Object.keys(this.Components);
                    for (let k of keys) {
                        let isdrop = true;
                        for (let compname in json.C) {
                            let _child = json.C[compname];
                            if (k == _child._t) {
                                this.Components[k]?.updateFromJson(_child);
                                isdrop = false;
                                break;
                            }
                        }
                        if (isdrop) {
                            this.Components[k]?.RemoveSelf();
                        }
                    }
                }
                for (let k in json.C) {
                    let info = json.C[k];
                    if (this.Components == null || this.Components[info._t] == null) {
                        let entity = Entity.FromJson(info);
                        if (this.IsRegister) {
                            this.AddOneComponent(entity);
                        } else {
                            (entity as IEntityProperty).Parent = this;
                            this.AddToComponents(entity);
                        }
                        if (this.NetTableName) {
                            (entity.NetTableName as any) = this.NetTableName;
                        }
                    }
                }
            }
            TimerHelper.AddFrameTimer(
                1,
                FuncHelper.Handler.create(this, () => {
                    EventHelper.FireClientEvent(this.GetType(), null, this);
                    EventHelper.FireClientEvent(this.updateEventName, null, this);
                })
            );
        }
        static FromJson(json: IEntityJson) {
            let entity = EntityEventSystem.GetEntity(json._id + json._t);
            if (entity != null) {
                entity.updateFromJson(json);
                return entity;
            }
            let type: typeof Entity = PrecacheHelper.GetRegClass(json._t);
            if (type == null) {
                throw new Error("cant find class" + json._t);
            }
            entity = EntityEventSystem.GetEntity(json._id + json._t);
            if (entity == null) {
                entity = Entity.Create(type);
                (entity as IEntityProperty).Id = json._id;
                (entity as IEntityProperty).NetTableName = json._nettable;
                entity.setDomain(SceneRoot.GetInstance());
            }
            entity.updateFromJson(json);
            EntityEventSystem.SerializeToEntity(entity);
            return entity;
        }

        static UpdateFromJson(json: IEntityJson) {
            let entity = EntityEventSystem.GetEntity(json._id + json._t);
            if (entity == null) {
                throw new Error("cant find entity to update");
            }
            entity.updateFromJson(json);
            return entity;
        }

        /**
         *开启每frame帧刷新
         */
        startUpdate = (frame = 1) => {
            if (this.onUpdate && this.IsRegister) {
                this.onUpdate();
                $.Schedule(Game.GetGameFrameTime() * frame, () => {
                    this.startUpdate();
                });
            }
        };

        public GetType() {
            return this.constructor.name;
        }
        public IsDisposed() {
            return this.InstanceId == "0";
        }
        protected setRegister(value: boolean) {
            if (this.IsRegister == value) {
                return;
            }
            (this as IEntityProperty).IsRegister = value;
            EntityEventSystem.RegisterSystem(this, value);
        }

        protected setParent(value: Entity) {
            if (value == null) {
                throw new Error("cant set parent null:" + this.constructor.name);
            }

            if (value == this) {
                throw new Error("cant set parent self:" + this.constructor.name);
            }

            // 严格限制parent必须要有domain,也就是说parent必须在数据树上面
            if (value.Domain == null) {
                throw new Error("cant set parent because parent domain is null: {this.GetType().Name} {value.GetType().Name}");
            }

            if (this.Parent != null) {
                // 之前有parent
                // parent相同，不设置
                if (this.Parent == value) {
                    LogHelper.error("重复设置了Parent: {this.GetType().Name} parent: {this.parent.GetType().Name}");
                    return;
                }
                if (this.IsComponent) {
                    this.Parent.RemoveFromComponents(this as Component);
                } else {
                    this.Parent.RemoveFromChildren(this);
                }
            }

            (this as IEntityProperty).Parent = value;
            if (this.IsComponent) {
                this.Parent.AddToComponents(this as Component);
            } else {
                this.Parent.AddToChildren(this);
            }
            this.setDomain(this.Parent.Domain);
        }

        public GetParent<T extends Entity>(): T {
            return this.Parent as T;
        }

        public GetDomain<T extends IEntityRoot>(): T {
            return this.Domain as T;
        }

        protected setDomain(value: IEntityRoot) {
            if (value == null) {
                throw new Error("domain cant set null: {this.GetType().Name}");
            }

            if (this.Domain == value) {
                return;
            }

            let preDomain = this.Domain;
            (this as IEntityProperty).Domain = value;
            if (preDomain == null) {
                (this as IEntityProperty).InstanceId = this.Id + this.GetType();
                this.setRegister(true);
            }

            // 递归设置孩子的Domain
            if (this.Children != null) {
                for (let k in this.Children) {
                    this.Children[k].setDomain(this.Domain);
                }
            }

            if (this.Components != null) {
                for (let k in this.Components) {
                    this.Components[k].setDomain(this.Domain);
                }
            }
        }
        private AddToChildren(entity: Entity) {
            if (this.Children == null) {
                (this as IEntityProperty).Children = {};
            }
            this.Children[entity.Id] = entity;
        }

        private RemoveFromChildren(entity: Entity) {
            if (this.Children == null) {
                return;
            }
            delete this.Children[entity.Id];
            if (Object.keys(this.Children).length == 0) {
                ((this as IEntityProperty).Children as any) = null;
            }
        }
        public RemoveSelf() {
            this.onRemove && this.onRemove();
            if (this.Parent != null && !this.Parent.IsDisposed()) {
                if (this.IsComponent) {
                    this.Parent.RemoveFromComponents(this as any);
                } else {
                    this.Parent.RemoveFromChildren(this);
                }
            }
            (this as IEntityProperty).Parent = null;
            TimerHelper.AddTimer(
                30,
                FuncHelper.Handler.create(this, () => {
                    this.Dispose();
                })
            );
        }
        public Dispose() {
            if (this.IsDisposed()) {
                return;
            }
            this.setRegister(false);
            (this as IEntityProperty).InstanceId = "0";
            // 清理Component
            if (this.Components != null) {
                for (let kv in this.Components) {
                    this.Components[kv].Dispose();
                }
                (this as IEntityProperty).Components = null;
            }

            // 清理Children
            if (this.Children != null) {
                for (let kv in this.Children) {
                    this.Children[kv].Dispose();
                }
                (this as IEntityProperty).Children = null;
            }

            // 触发Destroy事件
            EntityEventSystem.Destroy(this);

            (this as IEntityProperty).Domain = null;

            if (this.Parent != null && !this.Parent.IsDisposed()) {
                if (this.IsComponent) {
                    this.Parent.RemoveComponent(this as any);
                } else {
                    this.Parent.RemoveFromChildren(this);
                }
            }

            (this as IEntityProperty).Parent = null;
        }

        private AddToComponents(component: Component) {
            if (this.Components == null) {
                (this as IEntityProperty).Components = {};
            }
            if (this.Components[component.GetType()]) {
                LogHelper.error("the same Component ");
                this.Components[component.GetType()].Dispose();
            }
            this.Components[component.GetType()] = component;
        }

        private RemoveFromComponents(component: Component) {
            if (this.Components == null) {
                return;
            }
            delete this.Components[component.GetType()];
            if (Object.keys(this.Components).length == 0) {
                (this as IEntityProperty).Components = null;
            }
        }

        public GetChild<K extends Entity>(id: string): K | null {
            if (this.Children == null) {
                return null;
            }
            return this.Children[id] as K;
        }

        public GetChilds<K extends typeof Entity>(type: K): InstanceType<K>[] {
            let r: InstanceType<K>[] = [];
            if (this.Children == null) {
                return r;
            }
            for (let k in this.Children) {
                if (this.Children[k].GetType() == type.name) {
                    r.push(this.Children[k] as InstanceType<K>);
                }
            }
            return r;
        }

        public RemoveComponent(type: typeof Component) {
            if (this.IsDisposed()) {
                return;
            }
            if (this.Components == null) {
                return;
            }
            let c = this.GetComponent(type);
            if (c == null) {
                return;
            }
            this.RemoveFromComponents(c);
            c.Dispose();
        }

        public RemoveOneComponent(component: Component) {
            if (this.IsDisposed()) {
                return;
            }

            if (this.Components == null) {
                return;
            }
            let c = this.Components[component.GetType()];
            if (c == null) {
                return;
            }

            if (c.InstanceId != component.InstanceId) {
                return;
            }

            this.RemoveFromComponents(c);
            c.Dispose();
        }

        public GetComponent<K extends typeof Component>(type: K) {
            if (this.Components == null) {
                return null;
            }
            return this.Components[type.name] as InstanceType<K>;
        }
        public GetComponentByName<K extends Component>(str: string) {
            if (this.Components == null) {
                return null;
            }
            return this.Components[str] as K;
        }
        public static Create<K extends typeof Entity>(type: K) {
            let component = new type();
            (component as IEntityProperty).Id = FuncHelper.generateUUID();
            return component as InstanceType<K>;
        }
        public static CreateOne<K extends typeof Entity>(this: K) {
            let component = new this();
            (component as IEntityProperty).Id = FuncHelper.generateUUID();
            return component as InstanceType<K>;
        }

        public AddOneComponent(component: Component) {
            let type = component.GetType();
            if (this.Components != null && this.Components[type] != null) {
                throw new Error("entity already has component: {type.FullName}");
            }
            component.setParent(this);
            return component;
        }

        public AddComponent<K extends typeof Component>(type: K, ...args: any[]) {
            if (this.Components != null && this.Components[type.name] != null) {
                throw new Error("entity already has component: {type.FullName}");
            }
            let component = Entity.Create(type) as InstanceType<K>;
            (component as IEntityProperty).Id = this.Id;
            component.setParent(this);
            args = args || [];
            EntityEventSystem.Awake(component, ...args);
            return component;
        }

        public AddOneChild(entity: Entity) {
            entity.setParent(this);
            return entity;
        }

        public AddChild<T extends typeof Entity>(type: T, ...args: any[]) {
            let component = Entity.Create(type);
            component.setParent(this);
            args = args || [];
            EntityEventSystem.Awake(component, ...args);
            return component;
        }

        public AddChildWithId<T extends typeof Entity>(type: T, id: string, ...args: any[]) {
            let component = Entity.Create(type);
            (component as IEntityProperty).Id = id;
            component.setParent(this);
            args = args || [];
            EntityEventSystem.Awake(component, ...args);
            return component;
        }
    }
    export class Component extends Entity {
        public readonly IsComponent: boolean = true;
    }

    export class EntityRoot extends Entity {
        public readonly DomainParent: EntityRoot;
        public readonly DomainChildren: { [uuid: string]: EntityRoot };
        constructor(etroot: IEntityRoot) {
            super();
            let _id = FuncHelper.generateUUID();
            (this as IEntityProperty).InstanceId = _id;
            (this as IEntityProperty).Id = _id;
            (this as IEntityProperty).Domain = etroot;
            (this as IEntityProperty).Parent = this;
            this.setRegister(true);
        }
        static Active(etroot: IEntityRoot) {
            if (etroot.ETRoot == null) {
                etroot.ETRoot = new EntityRoot(etroot);
            }
        }
        public GetDomainChild(id: string) {
            return this.DomainChildren[id];
        }
        public GetDomainChilds<K extends typeof Component>(type: K): EntityRoot[] {
            let r: EntityRoot[] = [];
            if (this.DomainChildren == null) {
                return r;
            }
            for (let k in this.DomainChildren) {
                if (this.DomainChildren[k].GetComponent(type) != null) {
                    r.push(this.DomainChildren[k]);
                }
            }
            return r;
        }
        public GetDomainChildComponents<K extends typeof Component>(type: K): InstanceType<K>[] {
            let r: InstanceType<K>[] = [];
            if (this.DomainChildren == null) {
                return r;
            }
            for (let k in this.DomainChildren) {
                let comp = this.DomainChildren[k].GetComponent(type);
                if (comp != null) {
                    r.push(comp);
                }
            }
            return r;
        }

        public AddDomainChild(_entityRoot: EntityRoot) {
            if (_entityRoot.DomainParent != null) {
                throw new Error("setDomainParent error");
            }
            _entityRoot.setDomainParent(this);
        }
        private setDomainParent(_domainParent: EntityRoot) {
            if (this.DomainParent != null) {
                throw new Error("setDomainParent error");
            }
            (this as any).DomainParent = _domainParent;
            (this.DomainParent as EntityRoot).addDomainChildrens(this);
        }
        private addDomainChildrens(child: EntityRoot) {
            if (this.DomainChildren == null) {
                (this as any).DomainChildren = {};
            }
            this.DomainChildren[child.Id] = child;
        }
        private removeDomainChildrens(child: EntityRoot) {
            if (this.DomainChildren == null) {
                return;
            }
            delete this.DomainChildren[child.Id];
            if (Object.keys(this.DomainChildren).length == 0) {
                (this as any).DomainChildren = null;
            }
        }
        public Dispose(): void {
            super.Dispose();
            if (this.DomainParent != null && !this.DomainParent.IsDisposed()) {
                this.DomainParent.removeDomainChildrens(this);
                (this as any).DomainParent = null;
            }
        }
    }

    export class SceneRoot extends Entity implements IEntityRoot {
        private static Instance: SceneRoot;
        ETRoot?: EntityRoot | undefined;
        constructor() {
            super();
            let _id = FuncHelper.generateUUID();
            (this as IEntityProperty).InstanceId = _id;
            (this as IEntityProperty).Id = _id;
            (this as IEntityProperty).Domain = this;
            (this as any).ETRoot = this;
            (this as IEntityProperty).Parent = this;
            this.setRegister(true);
        }
        static GetInstance() {
            if (SceneRoot.Instance == null) {
                SceneRoot.Instance = new SceneRoot();
            }
            return SceneRoot.Instance;
        }
    }
}
