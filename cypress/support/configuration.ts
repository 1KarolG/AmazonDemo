export class Configuration {
    private static readonly _baseURL = 'https://www.amazon.co.uk';
    private static readonly _browserWidth = 1920;
    private static readonly _browserHeight = 1080;
    private static readonly _longTimeout = 30000;
    private static readonly _shortTimeout = 10000;

    public static get baseURL() {
        return this._baseURL;
    }

    public static get browserWidth() {
        return this._browserWidth;
    }

    public static get browserHeight() {
        return this._browserHeight;
    }

    public static get longTimeout() {
        return this._longTimeout;
    }

    public static get shortTimeout() {
        return this._shortTimeout;
    }
}