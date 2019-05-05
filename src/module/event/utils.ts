import uuid from 'uuid';

/** 获取随机的 Event Id */
export function getEventId() {
    return `bh_eid_${uuid().replace(/-/g, '_')}`;
}
