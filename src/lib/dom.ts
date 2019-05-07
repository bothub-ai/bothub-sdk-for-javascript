import { unique, deleteVal } from './array';
import { isString, isArray } from './assert';

/** 给 DOM 元素添加 class */
export function addClass(dom: Element, name: string) {
    const classes = (dom.getAttribute('class') || '').split(' ').filter(Boolean);

    classes.push(name);

    dom.setAttribute('class', unique(classes).join(' '));
}

/** 移除 DOM 元素的 class */
export function removeClass(dom: Element, name: string) {
    const classes = (dom.getAttribute('class') || '').split(' ').filter(Boolean);

    deleteVal(classes, name);

    dom.setAttribute('class', unique(classes).join(' '));
}

type ClassObject = AnyObject<boolean>;
export type ClassInput = string | ClassObject | Array<ClassObject | string>;

/** 解析 class 名称 */
export function parseClass(classInput: ClassInput) {
    function parseClassObject(classObject: ClassObject) {
        return Object.keys(classObject).filter((key) => classObject[key]).join(' ');
    }

    // 输入是字符串，返回本身
    if (isString(classInput)) {
        return classInput;
    }
    // 输入数组
    else if (isArray(classInput)) {
        return classInput.map(
            (item) =>
                isString(item) ? item : parseClassObject(item),
        ).join(' ');
    }
    // 输入对象
    else {
        return parseClassObject(classInput || {});
    }
}

/**
 * 给 DOM 添加属性
 * @param {ELement} dom - 待操作的 dom 元素
 * @param {U} attrs - 待添加的属性对象集合
 * @param {T[]} [props] - 待添加的属性 key，不填则表示全部
 * @param {boolean} [toUnderline] - 是否把 key 从驼峰转换为下划线，默认转换
 */
export function setAttributes<
    U extends object,
    T extends keyof U,
>(dom: Element, attrs: U, props?: T[], toUnderline = true) {
    const keys = props ? props : Object.keys(attrs) as T[];

    keys.forEach((key) => {
        const name = toUnderline ? (key as string).replace(/([A-Z])/g, (_, item1: string) => {
            return `_${item1.toLowerCase()}`;
        }) : key as string;

        if (attrs.hasOwnProperty(key)) {
            dom.setAttribute(name, String(attrs[key]));
        }
    });
}

/** 由 css 选择器移除元素 */
export function removeDom(select: string) {
    const nodes = document.querySelectorAll(select);

    for (let i = 0; i < nodes.length; i++) {
        const el = nodes[i];
        const parent = el.parentElement;

        if (parent) {
            parent.removeChild(el);
        }
    }
}
