import { isUndef } from './assert';
import { deleteVal } from './array';
import { sandBox } from './utils';

/** 事件类型 */
type EventCallback = (ev: any) => any;

/** 事件控制器 */
export default class EventController {
    private events: AnyObject<EventCallback[]> = {};

    /**
     * 绑定事件
     * @param {string} name 事件名称
     * @param {EventCallback} [event] 事件回调
     */
    on(name: string, event?: EventCallback) {
        if (!event) {
            return;
        }

        if (!this.events[name]) {
            this.events[name] = [];
        }

        this.events[name].push(event);
    }

    /**
     * 解除所有事件绑定
     */
    off(): void;
    /**
     * 解除名为`name`的所有事件绑定
     * @param {string} name 事件名称
     */
    off(name: string): void;
    /**
     * 解除名为`name`，且回调为`event`的事件绑定
     * @param {string} name 事件名称
     * @param {EventCallback} event 事件回调
     */
    off(name: string, event: EventCallback): void;

    off(name?: string, event?: EventCallback) {
        // 没有输入，删除所有事件
        if (isUndef(name)) {
            this.events = {};
            return;
        }

        // 只输入了名称
        if (isUndef(event)) {
            delete this.events[name];
            return;
        }

        // 删除某个特定的回调
        deleteVal(this.events[name], event);
    }

    /**
     * 触发事件
     * @param {string} name 触发的事件名称
     * @param {any} payload 触发事件的参数
     */
    emit(name: string, payload?: any) {
        const events = this.events[name] || [];
        events.forEach((cb) => sandBox(cb)(payload));
    }
}
