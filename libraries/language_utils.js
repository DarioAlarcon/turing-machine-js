const languages = {
    en: {
        textInput: 'Enter your word',
        buttomText: 'Go!',
        aboutRegularExpression: 'turing machine to change b\'s to a\'s',
        historyTittle: 'History',
        spanishOption: 'Spanish',
        englishOption: 'English',
        frenchOption: 'French',
    },
    es: {
        textInput: 'Ingresa tu palabra',
        buttomText: '¡Vamos!',
        aboutRegularExpression: 'Maquina de Turing para cambiar las b\'s por a\'s',
        historyTittle: 'Historial',
        spanishOption: 'Español',
        englishOption: 'Ingles',
        frenchOption: 'Frances',
    },
    fr: {
        textInput: 'Entrez votre mot',
        buttomText: 'Allons-y!',
        aboutRegularExpression: 'machine de turing pour changer les b en a',
        historyTittle: 'Histoire',
        spanishOption: 'Espagnol',
        englishOption: 'Anglais',
        frenchOption: 'Français',
    },
};

function changeLanguage(language) {
    const currentLanguage = languages[language];
    document.getElementById('word-text').placeholder = currentLanguage.textInput;
    document.getElementById('word-button').textContent = currentLanguage.buttomText;
    document.getElementById('English').textContent = currentLanguage.englishOption;
    document.getElementById('Spanish').textContent = currentLanguage.spanishOption;
    document.getElementById('French').textContent = currentLanguage.frenchOption;
    document.getElementById('historyTittle').textContent = currentLanguage.historyTittle;
    document.getElementById('regularExpressionInfo').textContent = currentLanguage.aboutRegularExpression;
}