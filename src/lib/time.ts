import { isBaseType } from 'src/lib/assert';

type TimeInput = number | string | Date;

/** 输入时间兼容处理 */
const toDate = (time: TimeInput) => isBaseType(time) ? new Date(time) : time;
/** 一天的毫秒数 */
const dayInMillisecond = 24 * 60 * 60 * 1000;

/**
 * 计算两个时间点差了多少天
 * @param {TimeInput} late 较晚的时间
 * @param {TimeInput} early 较早的时间
 * @return {number}
 */
export function daysOffset(late: TimeInput, early: TimeInput) {
    const subtract = toDate(late).getTime();
    const reduce = toDate(early).getTime();

    return Math.floor((subtract - reduce) / dayInMillisecond);
}

/**
 * Generating asynchronous delay functions
 * @param {number} time
 * @returns {Promise<void>}
 */
export function delay(time = 0) {
    return new Promise<void>((resolve) => setTimeout(resolve, time));
}
