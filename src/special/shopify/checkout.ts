import uuid from 'uuid';

import { SendToMessengerData } from 'src/widget';

/** bothub 订单回执数据结构 */
interface BothubReceiptData {
    /** 收货人姓名 */
    recipient_name: string;
    /** 订单号 */
    order_number: string;
    /** 订单货币 */
    currency: string;
    /** 支付方式 */
    payment_method: string;
    /** 订单 Url，订单详情卡⽚片会将此链接以按钮形式展示，供⽤用户点击跳转 */
    order_url?: string;
    /** 订单发生的时间戳 */
    timestamp?: number;
    /** 地址 */
    address?: {
        street_1: string;
        street_2: string;
        city: string;
        postal_code: string;
        state: string;
        country: string;
    };
    /** 订单金额汇总 */
    summary: {
        subtotal?: number;
        shipping_cost?: number;
        total_tax?: number;
        total_cost: number;
    };
    /** 订单优惠情况 */
    adjustments?: Array<{
        name: string;
        amount: number;
    }>;
    /** 订单内的商品 */
    elements: Array<{
        title: string;
        subtitle?: string;
        quantity: number;
        price: number;
        currency: string;
        image_url: string;
    }>;
}

/** 生成发送消息插件的元素包装 */
function insertSendMessengerWarpper(id: string) {
    // 不在订单检出页面
    if (!window.Shopify || !window.Shopify.checkout) {
        return;
    }

    const div = document.createElement('div');
    const position = document.querySelector('.main__content .section__content .content-box');

    // 未找到对应元素
    if (!position) {
        return;
    }

    div.innerHTML = (
        `<div class="content-box" data-order-updates="true">
            <div class="content-box__row">
                <h2 class="os-step__title">Order updates</h2>
                <div id="${id}" style="margin-top: 10px; max-height: 70px;">
                </div>
            </div>
        </div>`
    );

    position.parentElement!.insertBefore(div.children[0], position.nextElementSibling);
}

/** 获取当前订单信息 */
function getReceiptData() {
    const order = window.Shopify.checkout!;
    const {
        shipping_address: shipping,
        credit_card: card,
        gift_cards: gifts,
        line_items: products,
        discount,
    } = order;

    const data: BothubReceiptData = {
        recipient_name: `${shipping.first_name} ${shipping.last_name}`,
        order_number: String(order.order_id),
        currency: order.currency,
        payment_method: card.brand,
        timestamp: Math.floor(new Date(order.created_at).getTime() / 1000),
        address: {
            street_1: shipping.address1,
            street_2: shipping.address2,
            city: shipping.city,
            postal_code: shipping.zip,
            state: shipping.province,
            country: shipping.country,
        },
        summary: {
            subtotal: Number(order.subtotal_price),
            shipping_cost: Number(order.shipping_rate.price),
            total_tax: Number(order.total_tax),
            total_cost: Number(order.total_price),
        },
        elements: products.map((item) => ({
            title: item.title,
            quantity: item.quantity,
            price: Number(item.price),
            currency: order.currency,
            image_url: item.image_url,
        })),
    };

    // 存在优惠码
    if (discount) {
        data.adjustments = [
            {
                name: `Discount ${discount.code}`,
                amount: Number(discount.amount),
            },
        ];
    }

    // TODO: 礼品卡
    gifts.forEach((gift) => {

    });

    return data;
}

/** 记录 purchase 事件 */
export function logPurchaseEvent() {
    const order = window.Shopify.checkout!;

    window.BH.Event.purchase({
        orderNumber: String(order.order_id),
        source: 'shopify',
        currency: order.currency,
        totalPrice: order.payment_due,
    });
}

/** Send To Messenger 初始化 */
export function initSendMessenger() {
    const id = `bothub-shopify-${uuid()}`;
    const data: SendToMessengerData = {
        id,
        type: 'SendToMessenger' as any,
        color: 'white',
        size: 'xlarge',
        ctaText: 'SEND_ME_UPDATES',
        message: () => ({
            type: 'receipt',
            data: getReceiptData(),
        }),
    };

    insertSendMessengerWarpper(id);

    return data;
}
