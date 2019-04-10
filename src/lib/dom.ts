import { unique, deleteVal } from './native';

/** 给 DOM 元素添加 class */
export function addClass(dom: HTMLElement, name: string) {
    const classes = (dom.getAttribute('class') || '').split(' ').filter(Boolean);

    classes.push(name);

    dom.setAttribute('class', unique(classes).join(' '));
}

/** 移除 DOM 元素的 class */
export function removeClass(dom: HTMLElement, name: string) {
    const classes = (dom.getAttribute('class') || '').split(' ').filter(Boolean);

    deleteVal(classes, name);

    dom.setAttribute('class', unique(classes).join(' '));
}
