import * as micromustache from 'micromustache';
import { i18n } from '../lang';


function findBestTranslation(translations){
	const locale = i18n.locale;
	const languageField = 'language';
	// it's impossible to get the correct languageField in this context.
	// if we guess wrong it will default to the first translation.

	const fullMatch = translations.find(el=>el[languageField] === locale);
	const partialMatch = translations.find(el=>el[languageField] === locale.split('-')[0]);

	return fullMatch || partialMatch || translations[0];
}

function resolveFn(path, scope) {
  	const matches = path.match(/resolveTranslation\((.*?)\)(.*)/)
  	if (matches) {
	    const [, translationFieldName, restPath] = matches;
	    const translations = micromustache.get(scope, translationFieldName);
	    const resolved = findBestTranslation(translations);
	    if(!translations){
	    	return '';
	    }
	    return micromustache.get({resolved}, 'resolved'+restPath);
  	}
  	return micromustache.get(scope, path);
}

export default {
	compile(template){
		const compiled = micromustache.compile(template);
		return function(scope){
			return compiled.renderFn(resolveFn, scope);
		};
	},
	render(template, scope){
		return micromustache.renderFn(template, resolveFn, scope);
	},
}
