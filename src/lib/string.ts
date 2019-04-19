/** 驼峰转为下划线 */
export function underline(key: string) {
    return key.replace(/\B([A-Z])/g, '_$1').toLowerCase();
}
