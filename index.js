import BotHubClass from './src/Main';

if (typeof BOTHUB === 'object' && !BOTHUB._isins) {
    window.BOTHUB = new BotHubClass(BOTHUB);
}
