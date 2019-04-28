import { get } from 'src/lib/native';
import { warn } from 'src/lib/print';
import { addClass } from 'src/lib/dom';
import { WidgetType, ComponentType } from '../helper';

/** 包装 DOM 的 class 名称 */
export const WarpperClassName = 'bothub-widget-warpper';

/** 类的公共实现 */
export interface WidgetCommon {
    /** 当前插件的唯一编号 */
    id: string;
    /** 当前插件的类型 */
    type: WidgetType;
    /** 插件名称 */
    name: string;
    /** bothub 引用标记 */
    bhRef: string;

    /** 当前插件的核心 facebook 插件属性 */
    fbAttrs: object;

    /** 是否可以渲染 */
    canRender: boolean;
    /** 当前是否已经渲染 */
    isRendered: boolean;

    /** 当前插件的 DOM 元素 */
    $el?: HTMLElement;
    /** 当前插件的虚拟组件 */
    $component?: ComponentType;

    /**
     * 当前插件的渲染函数
     * @param {boolean} [focus] 是否强制刷新
     *  - 默认为`false`
     *  - 非强制刷新模式时，插件如果已经渲染出来，则不会触发重新渲染
     */
    parse(focus?: boolean): void;
}

/** 插件数据公共接口 */
export interface WidgetDataCommon {
    /** 当前插件的唯一编号 */
    id: string;
    /** 插件类型 */
    type: WidgetType;
    /** Facebook 主页编号 */
    pageId: string;
    /** bothub 引用标记 */
    bhRef: string;
}

/** 插件基类 */
export abstract class BaseWidget {
    id: string;
    bhRef: string;
    type: WidgetType;

    constructor({ id, type, bhRef }: WidgetDataCommon) {
        this.id = id;
        this.type = type;
        this.bhRef = bhRef;
    }

    /** 插件名称 */
    get name() {
        return WidgetType[this.type];
    }
    /** 插件元素在 bothub 的编号 */
    get code() {
        return get(this.id.split('-'), -1);
    }

    /** 未找到插件 ID 时的报错日志 */
    elNotFound() {
        warn(`Can not find the ${this.name} Plugin element with ID: ${this.id}, Skip`, true);
    }
    /** 获取并创建本体以及包装 */
    renderWarpperById() {
        const warpper = document.getElementById(this.id);

        // 未找到包装的 DOM
        if (!warpper) {
            this.elNotFound();
            return;
        }

        addClass(warpper, WarpperClassName);

        if (!warpper.firstElementChild) {
            warpper.appendChild(document.createElement('div'));
        }

        return warpper;
    }
}
