import BotHubClass from './src/BotHubClass';

if (typeof BOTHUB === 'object' && !BOTHUB._isins) {
    window.BOTHUB = new BotHubClass(BOTHUB);
}
