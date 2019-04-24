/** 驼峰转为下划线 */
export function fromCamelCase(key: string, label = '_') {
    return key.replace(/\B([A-Z])/g, `${label}$1`).toLowerCase();
}
