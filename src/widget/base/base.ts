import { local } from 'src/lib/cache';
import { log, warn } from 'src/lib/print';
import { addClass } from 'src/lib/dom';
import { isUndef } from 'src/lib/assert';
import { widgets } from 'src/store';
import { daysOffset } from 'src/lib/time';
import { get, deleteVal } from 'src/lib/array';
import { shallowCopyExclude } from 'src/lib/object';
import { WidgetType, ComponentType, HiddenKey, HiddenData } from '../helper';

import EventController from 'src/lib/event';

/** 包装 DOM 的 class 名称 */
export const WarpperClassName = 'bothub-widget-warpper';

/** 插件数据公共接口 */
export interface WidgetDataCommon {
    /** 当前插件的唯一编号 */
    id: string;
    /** 插件类型 */
    type: WidgetType;

    /** Facebook 主页编号 */
    pageId?: string;
    /** 是否是内部器件 */
    isInside?: boolean;

    /**
     * 获取元素位置的函数
     *  - 该插件将会创建在返回元素的后面
     * @return {Element}
     */
    position?(): Element | undefined | null;

    /**
     * 渲染完成事件
     */
    rendered?(): void;
}

/** 从插件 ID 获取插件的编号 */
export const getCodeFromId = (id: string) => get(id.split('-'), -1);

/** 插件基类 */
export abstract class BaseWidget<T extends WidgetDataCommon = WidgetDataCommon> extends EventController {
    /** 当前插件的唯一编号 */
    id: string;
    /** 当前插件的类型 */
    type: T['type'];

    /** 当前插件的核心 facebook 插件属性 */
    fbAttrs!: object;

    /** 是否允许渲染 */
    canRender = true;
    /** 是否已经渲染完成 */
    isRendered = false;
    /** 是否是内部器件 */
    isInside = false;

    /** 当前插件的包装器引用（除开 customerchat） */
    $el?: HTMLElement;
    /** 当前插件的虚拟组件 */
    $component?: ComponentType;

    /** 原始数据 */
    origin: T;

    /** 必填项键名 */
    readonly requiredKeys: (keyof T)[] = ['id', 'type', 'pageId'];

    constructor({ id, type, isInside = false }: T) {
        super();

        this.id = id;
        this.type = type;
        this.isInside = isInside;
        this.origin = arguments[0];
    }

    /** 插件名称 */
    get name() {
        return WidgetType[this.type];
    }
    /** 插件元素在 bothub 的编号 */
    get code() {
        return getCodeFromId(this.id);
    }

    /** 隐藏插件时保存数据 */
    protected insertHiddenData(label: string) {
        const data = local.get<HiddenData>(HiddenKey) || {};
        
        data[this.id] = {
            meta: label,
            time: new Date().getTime(),
        };

        local.set(HiddenKey, data);
    }
    /** 检查是否需要隐藏 */
    checkHidden(hiddenLimit: number) {
        const data = local.get<HiddenData>(HiddenKey) || {};
        const lastHideTime = data[this.id] && data[this.id].time || 0;
        const offset = daysOffset(new Date(), lastHideTime);

        // 还在隐藏时间范围内
        if (offset < hiddenLimit) {
            log(`${this.name} with id ${this.id}, set auto hide, skip`);
            return false;
        }
        // 超过时间范围
        else {
            this.removeHiddenData();
        }

        return true;
    }
    /** 移除当前隐藏插件保存的数据 */
    removeHiddenData() {
        const {
            [this.id]: ignore,
            ...rest
        } = local.get<HiddenData>(HiddenKey) || {};

        local.set(HiddenKey, rest);
    }

    /** 插件属性初始化 */
    init() {
        // 重新设定属性
        this.fbAttrs = shallowCopyExclude(this.origin, ['id', 'type']);

        // 取消所有事件
        this.off();
        // 重新绑定
        this.on('rendered', this.origin.rendered);

    }
    /** 检查是否允许渲染 */
    check() {
        this.canRender = Boolean(
            this.checkRequired() &&
            (this.$el = this.renderWarpperById()),
        );
    }
    /** 检查必填项是否都填写 */
    checkRequired() {
        const result = this.requiredKeys.filter((key) => isUndef(this.origin[key]));

        if (result.length > 0) {
            warn(`Config of ${this.name} with id: ${this.id} is wrong, [${result.join(', ')}] is required`, true);
        }

        return result.length === 0;
    }
    /** 获取并创建本体以及包装 */
    renderWarpperById() {
        let warpper = document.getElementById(this.id);

        const elNotFound = () => {
            if (!this.isInside) {
                warn(`Can not find the ${this.name} Plugin element with ID: ${this.id}, Skip`, true);
            }
        };

        // 未找到包装的 DOM
        if (!warpper) {
            if (!this.origin.position) {
                elNotFound();
                return;
            }

            // 定位元素
            const el = this.origin.position();
            // 定位元素未找到
            if (!el) {
                elNotFound();
                return;
            }

            // 创建包装器
            warpper = el.parentElement!.insertBefore(
                document.createElement('div'),
                el.nextElementSibling,
            );
        }

        if (!warpper && !this.origin.position) {
            elNotFound();
            return;
        }

        // 只有顶层器件才能添加包装器 class 名称
        if (!this.isInside) {
            addClass(warpper, WarpperClassName);
        }

        if (!warpper.firstElementChild) {
            warpper.appendChild(document.createElement('div'));
        }

        return warpper;
    }

    /**
     * 当前插件的渲染函数
     * @param {boolean} [focus] 是否强制刷新
     *  - 默认为`false`
     *  - 非强制刷新模式时，插件如果已经渲染出来，则不会触发重新渲染
     */
    parse(focus?: boolean) {
        warn(`${this.name} don't have parse method`);
    }
    /** 销毁函数 */
    destroy() {
        // 解除所有事件绑定
        this.off();

        // 已经渲染了网页元素
        if (!this.$el) {
            return;
        }

        const warpper = this.$el;
        const parent = warpper.parentElement!;

        // 是在网页中用 div 元素定位的
        if (!this.origin.position) {
            const newWarpper = parent.insertBefore(document.createElement('div'), warpper);
            newWarpper.setAttribute('id', this.id);
        }

        // 移除元素
        parent.removeChild(warpper);

        setTimeout(() => {
            deleteVal(widgets, this as any);

            // 非内部插件销毁打印日志
            if (!this.isInside) {
                log(`Plugin with id ${this.id} has been destroyed`);
            }
        });
    }
}
