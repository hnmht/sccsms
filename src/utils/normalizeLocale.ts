export function normalizeLocale(tag: string) {
    if (!tag) return 'en-US';
    const t = tag.replace('_', '-').toLowerCase();
    // Chinese
    if (t.startsWith('zh-hans')) return 'zh-CN';
    if (t.startsWith('zh-cn') || t === 'zh') return 'zh-CN';
    if (t.startsWith('zh-hant')) return 'zh-TW';
    if (t.startsWith('zh-tw') || t.startsWith('zh-hk') || t.startsWith('zh-mo'))
        return 'zh-TW';

    // English
    if (t.startsWith('en-gb')) return 'en-GB';
    if (t.startsWith('en')) return 'en-US';

    // Japanse
    if (t.startsWith('ja')) return 'ja-JP';
    // Korea
    if (t.startsWith('ko')) return 'ko-KR';

    // Europe
    if (t.startsWith('fr')) return 'fr-FR';
    if (t.startsWith('de')) return 'de-DE';
    if (t.startsWith('es')) return 'es-ES';
    if (t.startsWith('pt-br')) return 'pt-BR';
    if (t.startsWith('pt')) return 'pt-PT';
    if (t.startsWith('ru')) return 'ru-RU';
    if (t.startsWith('it')) return 'it-IT';
    if (t.startsWith('nl')) return 'nl-NL';

    // Asia
    if (t.startsWith('vi')) return 'vi-VN';
    if (t.startsWith('th')) return 'th-TH';
    if (t.startsWith('id') || t.startsWith('in')) return 'id-ID';
    if (t.startsWith('hi')) return 'hi-IN';

    // Arabic
    if (t.startsWith('ar')) return 'ar-SA';

    // Other
    return tag;
}
