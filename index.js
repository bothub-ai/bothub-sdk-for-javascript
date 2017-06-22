import "babel-polyfill";
import Marketing from './src/Marketing';

class BotHubClass {

    constructor(conf) {
        this._isins = true;
        this.Marketing = new Marketing(this, conf);
    }

}

if (typeof BOTHUB === 'object' && !BOTHUB._isins) {
    let cb = BOTHUB.callback || function() {

        };
    window.BOTHUB = new BotHubClass(BOTHUB);
}
