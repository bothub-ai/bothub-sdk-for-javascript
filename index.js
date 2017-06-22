import "babel-polyfill";
import Marketing from './src/Marketing';

class BotHubClass {

    constructor(conf) {
        this._isins = true;
        this.Marketing = new Marketing(this, conf);
    }

}

if (typeof BOTHUB === 'object' && !BOTHUB._isins) {
    window.BOTHUB = new BotHubClass(BOTHUB);
}
