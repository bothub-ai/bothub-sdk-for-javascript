import { unique, deleteVal } from './native';
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
