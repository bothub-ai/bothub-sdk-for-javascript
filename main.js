import BotHub from './src/BotHub';
import { isOldIE } from './src/utils';

if (typeof BOTHUB === 'object' && !BOTHUB._isins) {
    if (isOldIE()) {
        const doNothing = () => {};
        BOTHUB.Marketing = {
            logAddedToCartEvent: doNothing,
            logAddedToWishlistEvent: doNothing,
            logInitiatedCheckoutEvent: doNothing,
            logEvent: doNothing,
        };
    } else {
        window.BOTHUB = new BotHub(BOTHUB);
    }
}
