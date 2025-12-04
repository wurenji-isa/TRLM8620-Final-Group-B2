import { locale, updateLocale } from '../app.js';

var stringsJSON = {};
var englishStrings = {}; // Fallback for missing translations
var exchangeRates = {}; // Exchange rates config

const i18n = {

    //load resource json based on locale
    loadStringsJSON: async (newLocale) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await fetch(`./content/${newLocale}/strings.json`, options)
            stringsJSON = await response.json();
            
            // Load English as fallback if not already loaded
            if (newLocale !== 'en-US' && Object.keys(englishStrings).length === 0) {
                const enResponse = await fetch(`./content/en-US/strings.json`, options);
                englishStrings = await enResponse.json();
            }
            
            // Load exchange rates config
            if (Object.keys(exchangeRates).length === 0) {
                const ratesResponse = await fetch(`./config/exchange-rates.json`, options);
                exchangeRates = await ratesResponse.json();
            }
        } catch (err) {
            console.log('Error getting strings', err);
            if (newLocale != "en-US") {
                updateLocale("en-US");
            }
        }
    },

    //load resource json based on locale
    getString: (view, key) => {
        // Try to get from current locale first
        if (stringsJSON[view] && stringsJSON[view][key]) {
            return stringsJSON[view][key];
        }
        // Fall back to English if available
        if (englishStrings[view] && englishStrings[view][key]) {
            return englishStrings[view][key];
        }
        // Return the key itself as last resort
        return key;
    },

    //determine the proper currency format based on locale and return html string
    formatCurrency: (price, color) => {
        let formatted;
        let converted = convertCurrency(price);
        formatted = new Intl.NumberFormat(locale, { style: 'currency', currency: currencyMap[locale] }).format(converted); //$NON-NLS-L$ 
        //return the formatted currency within template literal
        return `<h4>${formatted}</h4>`


    },
    //format currency without HTML wrapper (for use in text)
    formatCurrencyPlain: (price) => {
        let converted = convertCurrency(price);
        return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyMap[locale] }).format(converted); //$NON-NLS-L$
    },
    //return the locale based link to html file within the 'static' folder
    getHTML: () => {
        return `${locale}/terms.html`; //$NON-NLS-L$ 
    },
    //format date according to locale
    formatDate: (date) => {
        if (locale === 'zh-CN') {
            // Chinese format: 2025年12月4日
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Intl.DateTimeFormat('zh-CN', options).format(date); //$NON-NLS-L$
        } else {
            // Default numeric format for other locales
            var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Intl.DateTimeFormat(locale, options).format(date); //$NON-NLS-L$
        }
    }
}

//used to determine the correct currency symbol
var currencyMap = {
    'en-US': 'USD',
    'zh-CN': 'CNY'
};

//function to perform conversion from galactic credits to real currencies
//Uses exchange rates from config/exchange-rates.json
var convertCurrency = (price) => {
    if (Object.keys(exchangeRates).length === 0) {
        // If rates haven't loaded yet, return original price
        return price;
    }
    
    const targetCurrency = currencyMap[locale];
    const rate = exchangeRates.rates[targetCurrency];
    
    if (rate !== undefined) {
        return price * rate;
    }
    return price;
}

export default i18n;