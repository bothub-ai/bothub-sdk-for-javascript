import "babel-polyfill";
import Marketing from './src/Marketing';

class BotHubClass {

    constructor(conf) {
        this.Marketing = new Marketing(this, conf);
    }

}

window.BotHubINS = BotHubClass;
