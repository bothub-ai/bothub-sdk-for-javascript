import { log, warn } from 'src/lib/print';
import { local } from 'src/lib/cache';
import { daysOffset } from 'src/lib/time';
import { CheckboxEvent } from 'typings/facebook';

import Checkbox from '.';
import Discount from '../discount';

/** 是否超过隐藏时间 */
export function overHiddenTime(widget: Checkbox | Discount) {
    const lastHideTime = local.get<number>(widget.hidenKey) || 0;
    const offset = daysOffset(new Date(), lastHideTime);

    // 还在隐藏时间范围内
    if (offset < widget.hideAfterChecked) {
        log(`${widget.name} with id ${widget.id}, set auto hide, skip`);
        return false;
    }
    // 超过时间范围
    else {
        local.remove(widget.hidenKey);
    }

    return true;
}

interface CheckboxBhEvents {
    onRendered?(): void;
    onCheckbox?(): void;
    onCheck?(ref: string): void;
    onUnCheck?(ref: string): void;
}

/** 绑定事件 */
export function bindEvent(widget: Checkbox | Discount, events: CheckboxBhEvents) {
    window.FB.Event.subscribe('messenger_checkbox', (ev: CheckboxEvent) => {
        if (!ev.ref) {
            warn(`Can not found 'ref' attrubite in '${widget.name}' Plugin with id ${widget.id}`, true);
            return;
        }

        const getId = window.atob(ev.ref);

        if (getId !== widget.id) {
            return;
        }

        // 渲染完成
        if (ev.event === 'rendered') {
            log(`${widget.name} Plugin with ID ${widget.id} has been rendered`);
            widget.isRendered = true;
            events.onRendered && events.onRendered();
        }
        else if (ev.event === 'checkbox') {
            if (ev.state === 'checked') {
                widget.isChecked = true;

                if (widget.hideAfterChecked > 0) {
                    local.set(widget.hidenKey, new Date().getTime());
                }

                events.onCheck && events.onCheck(ev.user_ref);
            }
            else if (ev.state === 'unchecked') {
                widget.isChecked = false;
                events.onUnCheck && events.onUnCheck(ev.user_ref);
            }

            events.onCheckbox && events.onCheckbox();
        }
    });
}
