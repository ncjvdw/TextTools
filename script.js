let history = {};
let lastAction = {};
let sortState = { index: 0, original: null }; 
let activeStyles = { bold: false, italic: false, strike: false };

function resetHistory(id) {
    delete history[id];
    delete lastAction[id];
    if (id === 'listInput') {
        sortState = { index: 0, original: null };
        const btn = document.getElementById('sortBtn');
        if(btn) btn.innerText = "Sort: Original";
    }
}

function clearField(id) {
    document.getElementById(id).value = '';
    resetHistory(id);
}

function copyToClipboard(elementId, btn) {
    const el = document.getElementById(elementId);
    if (!el.value) return;
    el.select();
    document.execCommand('copy');
    const originalText = btn.innerText;
    btn.innerText = "✓ Copied";
    btn.style.background = "var(--success)";
    setTimeout(() => { btn.innerText = originalText; btn.style.background = ""; }, 1500);
}

function applySmartToggle(id, actionName, transformFunction) {
    const el = document.getElementById(id);
    const currentVal = el.value;
    if (lastAction[id] === actionName && history[id] !== undefined) {
        el.value = history[id];
        resetHistory(id); 
        return;
    }
    history[id] = currentVal;
    el.value = transformFunction(currentVal);
    lastAction[id] = actionName;
}

function applyDirectAction(id, transformFunction) {
    const el = document.getElementById(id);
    resetHistory(id); 
    el.value = transformFunction(el.value);
}

/* --- TEXT ESSENTIALS --- */
function analyzeText() {
    const text = document.getElementById('statsInput').value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    document.getElementById('statsResult').innerText = `Words: ${words} | Chars: ${chars} | Reading: ${Math.ceil(words / 200)}m`;
}

function transformCase(type) {
    applyDirectAction('caseInput', (val) => {
        if (!val) return "";
        if (type === 'upper') return val.toUpperCase();
        if (type === 'lower') return val.toLowerCase();
        if (type === 'sentence') return val.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        if (type === 'title') return val.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        if (type === 'alternating') return val.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
        // New Logic: Lowercase everything first, then uppercase only vowels/consonants
        if (type === 'vowels') return val.toLowerCase().replace(/[aeiou]/g, c => c.toUpperCase());
        if (type === 'consonants') return val.toLowerCase().replace(/[bcdfghjklmnpqrstvwxyz]/g, c => c.toUpperCase());
        return val;
    });
}

const fontMaps = {
    normal: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    bubble: "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ⓪①②③④⑤⑥⑦⑧⑨",
    fancy:  "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩0123456789",
    small:  "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    cursive:"𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝓕𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵0123456789",
    bold:   "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵ｉｊｋ𝗹𝗺ｎ𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄ｘｙ𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭0123456789",
    italic: "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪ij𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡0123456789",
    bolditalic: "𝙖boldsymbol𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕0123456789"
};

const glitchChars = [
    '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307', '\u0308', '\u0309', 
    '\u030a', '\u030b', '\u030c', '\u030d', '\u030e', '\u030f', '\u0310', '\u0311', '\u0312', '\u0313', 
    '\u0314', '\u0315', '\u0316', '\u0317', '\u0318', '\u0319', '\u031a', '\u031b', '\u031c', '\u031d', 
    '\u031e', '\u031f', '\u0320', '\u0321', '\u0322', '\u0323', '\u0324', '\u0325', '\u0326', '\u0327', 
    '\u0328', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', 
    '\u0332', '\u0333', '\u0334', '\u0335', '\u0336', '\u0337', '\u0338', '\u0339', '\u033a', '\u033b', 
    '\u033c', '\u033d', '\u033e', '\u033f', '\u0340', '\u0341', '\u0342', '\u0343', '\u0344', '\u0345', 
    '\u0346', '\u0347', '\u0348', '\u0349', '\u034a', '\u034b', '\u034c', '\u034d', '\u034e', '\u0350', 
    '\u0351', '\u0352', '\u0353', '\u0354', '\u0355', '\u0356', '\u0357', '\u0358', '\u0359', '\u035a', 
    '\u035b', '\u035c', '\u035d', '\u035e', '\u035f', '\u0360', '\u0361'
];

function normalizeText(text) {
    let norm = text.replace(/\u0336/g, '').replace(/[\u0300-\u036f]/g, ''); 
    const normalChars = Array.from(fontMaps.normal);
    Object.keys(fontMaps).forEach(style => {
        if (style === 'normal') return;
        const styledChars = Array.from(fontMaps[style]);
        norm = Array.from(norm).map(char => {
            const index = styledChars.indexOf(char);
            return index !== -1 ? normalChars[index] : char;
        }).join('');
    });
    return norm;
}

function transformText(text, type) {
    const source = Array.from(fontMaps.normal);
    const target = Array.from(fontMaps[type]);
    return Array.from(text).map(char => {
        const index = source.indexOf(char);
        return index !== -1 ? target[index] : char;
    }).join('');
}

function toggleStyleAttribute(attr) {
    const el = document.getElementById('styleInput');
    if (!el.value) return;
    activeStyles[attr] = !activeStyles[attr];
    const btn = document.getElementById(`btn-${attr}`);
    btn.classList.toggle('active-style', activeStyles[attr]);
    let text = normalizeText(el.value);
    if (activeStyles.bold && activeStyles.italic) {
        text = transformText(text, 'bolditalic');
    } else if (activeStyles.bold) {
        text = transformText(text, 'bold');
    } else if (activeStyles.italic) {
        text = transformText(text, 'italic');
    }
    if (activeStyles.strike) {
        text = Array.from(text).map(c => c + '\u0336').join('');
    }
    el.value = text;
}

function clearStyles() {
    activeStyles = { bold: false, italic: false, strike: false };
    ['bold', 'italic', 'strike'].forEach(a => document.getElementById(`btn-${a}`).classList.remove('active-style'));
    clearField('styleInput');
}

/* --- FONTS CARD --- */
function applyFont(type) {
    const el = document.getElementById('fontInput');
    if (!el.value) return;
    const cleanText = normalizeText(el.value);
    if (type === 'original') {
        el.value = cleanText;
        return;
    }
    if (type === 'glitch') {
        el.value = Array.from(cleanText).map(char => {
            if (char === ' ') return char; // Don't glitch spaces
            let glitched = char;
            for (let i = 0; i < 10; i++) {
                glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            return glitched;
        }).join('');
        return;
    }
    const source = Array.from(fontMaps.normal);
    const target = Array.from(fontMaps[type]);
    el.value = Array.from(cleanText).map(char => {
        const index = source.indexOf(char);
        return index !== -1 ? target[index] : char;
    }).join('');
}

/* --- DEVELOPER TOOLS --- */
function progCase(type) {
    applyDirectAction('progInput', (val) => {
        let words = val.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[^a-zA-Z0-9]/g, ' ').split(/\s+/).filter(x => x).map(w => w.toLowerCase());
        if (!words.length) return val;
        if (type === 'camel') return words[0] + words.slice(1).map(w => w[0].toUpperCase() + w.slice(1)).join('');
        if (type === 'pascal') return words.map(w => w[0].toUpperCase() + w.slice(1)).join('');
        if (type === 'snake') return words.join('_');
        if (type === 'kebab') return words.join('-');
        if (type === 'constant') return words.join('_').toUpperCase();
        return val;
    });
}

function cleanText(type) {
    applyDirectAction('cleanInput', (val) => {
        if (type === 'strip') return val.replace(/<[^>]*>?/gm, '');
        if (type === 'whitespace') return val.replace(/\s\s+/g, ' ').trim();
        if (type === 'toBase64') return btoa(val);
        if (type === 'fromBase64') {
            try { return atob(val); } catch(e) { alert("Invalid Base64"); return val; }
        }
        return val;
    });
}

/* --- MISC TOOLS --- */
function toggleSort(btn) {
    const el = document.getElementById('listInput');
    const val = el.value;
    if(!val.trim()) return;
    if (sortState.original === null) sortState.original = val;
    sortState.index = (sortState.index + 1) % 3;
    let sep = val.includes('\n') ? '\n' : (val.includes(',') ? ',' : ' ');
    let items = val.split(sep).map(i => i.trim()).filter(i => i);
    if (sortState.index === 1) {
        items.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
        el.value = items.join(sep === '\n' ? '\n' : (sep === ',' ? ', ' : ' '));
        btn.innerText = "Sort: A-Z";
    } else if (sortState.index === 2) {
        items.sort((a, b) => a.localeCompare(b, undefined, {numeric: true})).reverse();
        el.value = items.join(sep === '\n' ? '\n' : (sep === ',' ? ', ' : ' '));
        btn.innerText = "Sort: Z-A";
    } else {
        el.value = sortState.original;
        btn.innerText = "Sort: Original";
    }
}

function convertList(type) {
    applyDirectAction('listInput', (val) => {
        if (type === 'toComma') return val.split(/\n|\t/).filter(i => i.trim()).join(', ');
        if (type === 'toList') return val.split(',').map(i => i.trim()).join('\n');
        if (type === 'toTab') return val.split(/\n|,/).map(i => i.trim()).join('\t');
        if (type === 'tabsToList') return val.split('\t').map(i => i.trim()).join('\n');
        return val;
    });
}

function urlTool(type) {
    applyDirectAction('urlInput', (val) => {
        if (!val) return "";
        if (type === 'encode') return encodeURIComponent(val);
        if (type === 'decode') return decodeURIComponent(val);
        if (type === 'clean') {
            try {
                let url = new URL(val.startsWith('http') ? val : 'https://' + val);
                const junk = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'gs_lcrp', 'sourceid', 'ie', 'client', 'oq'];
                junk.forEach(p => url.searchParams.delete(p));
                return url.toString();
            } catch (e) { return val; }
        }
        return val;
    });
}

function miscTool(type) {
    applyDirectAction('convInput', (val) => {
        val = val.trim();
        const morse = { 'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': '/' };
        if (type === 'toHex') return val.split('').map(c => c.charCodeAt(0).toString(16)).join(' ');
        if (type === 'fromHex') return val.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
        if (type === 'toBin') return val.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        if (type === 'fromBin') return val.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
        if (type === 'toMorse') return val.toUpperCase().split('').map(c => morse[c] || c).join(' ');
        if (type === 'fromMorse') {
            const rev = Object.fromEntries(Object.entries(morse).map(([k, v]) => [v, k]));
            return val.split(' ').map(c => rev[c] || c).join('');
        }
        return val;
    });
}

/* --- INIT & THEME --- */
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    document.getElementById('themeToggle').innerText = document.body.classList.contains('dark-theme') ? "☀️" : "🌙";
}

/* --- FEEDBACK and INIT --- */
window.onload = () => {

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggle').innerText = "☀️";
    }

    if (localStorage.getItem('feedbackSubmitted') === 'true') {
        document.getElementById('feedback-box').style.display = 'none';
    }
};

const feedbackForm = document.getElementById('feedback-form');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(feedbackForm);

        fetch('https://script.google.com/macros/s/AKfycbz299Jx-uyI7IGlGpKwTj84nVRHIz8HuAKz8MURfh4u_zlCIjpUVHctIDlLL3uZzunLhg/exec', {
            method: 'POST',
            body: formData
        })
        .then(response => console.log('Success!', response))
        .catch(error => console.error('Error!', error.message));

        feedbackForm.style.display = 'none';
        document.getElementById('thank-you-msg').style.display = 'block';
        
        localStorage.setItem('feedbackSubmitted', 'true');
        
        setTimeout(() => {
            document.getElementById('feedback-box').style.display = 'none';
        }, 2000);
    });
}

document.getElementById('close-feedback').onclick = () => {
    document.getElementById('feedback-box').style.display = 'none';
};