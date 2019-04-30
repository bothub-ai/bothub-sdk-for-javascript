import { isUndef, isFunc } from './assert';

/**
 * 删除满足条件的元素
 *  - predicate 为函数时，删除 predicate 返回 true 的元素
 *  - predicate 为非函数时，删除与 predicate 严格相等的元素
 *  - 当 whole 为 false 时，只删除匹配到的第一个元素；为 true 时，删除所有匹配到的元素
 *
 * @template T
 * @param {T[]} arr
 * @param {(T | ((value: T, index: number) => boolean))} predicate
 * @param {boolean} [whole=true]
 * @returns {boolean}
 */
export function deleteVal<T>(arr: T[], predicate: T | ((value: T, index: number) => boolean), whole = true): boolean {
    const fn = isFunc(predicate) ? predicate : (item: T) => item === predicate;

    let index = 0, flag = false;

    while (index >= 0) {
        index = arr.findIndex(fn);

        if (index !== -1) {
            arr.splice(index, 1);
            flag = true;
        }

        if (!whole) {
            break;
        }
    }

    return flag;
}

/**
 * 数组去重
 *  - 如果没有输入 label 函数，则对数组元素直接去重
 *  - 如果输入了 label 函数，将会使用该函数对数组元素做一次转换，对转换之后的值进行去重，最后再映射回原数组
 *
 * @template T
 * @param {T[]} arr
 * @param {((value: T, index: number) => number | string)} [label]
 * @returns {T[]}
 */
export function unique<T>(arr: T[], label?: (value: T, index: number) => number | string): T[] {
    const predicate = isUndef(label) ? (val: T) => (val as any) as string : label;
    const labelMap: { [key: string]: boolean } = {};

    return arr
        .map((value, index) => ({ value, key: predicate(value, index) }))
        .filter(({ key }) => (labelMap[key] ? false : (labelMap[key] = true)))
        .map(({ value }) => value);
}

/** 连接数组 */
export function concat<T, U>(from: T[], callback: (val: T) => U[] | undefined): U[] {
    let result: U[] = [];

    for (let i = 0; i < from.length; i++) {
        result = result.concat(callback(from[i]) || []);
    }

    return result;
}

/**
 * 取出数组的某个元素
 * @param arr 待取数的数组
 * @param index 下标 - 支持负数
 */
export function get<T>(arr: T[], index: number): T {
    const sub = (index >= 0) ? index : arr.length + index;

    if (sub < 0 || sub >= arr.length) {
        throw new Error('(array) index out of bounds.');
    }

    return arr[sub];
}
