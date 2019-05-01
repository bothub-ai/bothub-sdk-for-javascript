/**
 * 对象浅复制，允许只复制部分属性
 * @param {object} from 待复制对象
 * @param {string} [props] 待复制的属性
 */
export function shallowCopy<T extends object>(from: T): T;
export function shallowCopy<T extends object, U extends keyof T>(from: T, props: U[]): Pick<T, U>;
export function shallowCopy<T extends object, U extends keyof T>(from: T, props?: U[]) {
    if (!props) {
        return { ...from };
    }

    const result: Pick<T, U> = {} as any;

    props.forEach((key) => {
        if (key in from) {
            result[key] = from[key];
        }
    });

    return result;
}

/**
 * 对象浅复制，允许排除复制的某些属性
 * @param {object} from 待复制对象
 * @param {string} [props] 复制时需要排除的属性
 */
export function shallowCopyExclude<T extends object, U extends string>(from: T, props: U[]): Pick<T, Exclude<keyof T, U>> {
    const result: Pick<T, Exclude<keyof T, U>> = {} as any;

    Object.keys(from).forEach((key) => {
        if (props.indexOf(key as U) === -1) {
            result[key] = from[key];
        }
    });

    return result;
}
