const feedbackBox = document.getElementById('feedback-box');
const feedbackForm = document.getElementById('feedback-form');

// Case Converter
function transformCase(type) {
    const el = document.getElementById('caseInput');
    let val = el.value;
    if (!val) return;

    if (type === 'upper') el.value = val.toUpperCase();
    if (type === 'lower') el.value = val.toLowerCase();
    if (type === 'sentence') {
        el.value = val.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
    }
    if (type === 'title') {
        el.value = val.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
}

// List to Comma
function convertList() {
    const el = document.getElementById('listInput');
    const items = el.value.split('\n').filter(i => i.trim() !== '');
    el.value = items.join(', ');
}

// URL Cleaner
function cleanURL() {
    const el = document.getElementById('urlInput');
    let rawUrl = el.value.trim();
    if (!rawUrl) return;

    try {
        if (!rawUrl.startsWith('http')) rawUrl = 'https://' + rawUrl;
        const url = new URL(rawUrl);
        const junkParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'sourceid', 'oq', 'gs_lcrp', 'ie'];
        junkParams.forEach(param => url.searchParams.delete(param));
        el.value = url.toString();
    } catch (e) {
        alert("Please enter a valid URL.");
    }
}

// General
function clearField(id) {
    document.getElementById(id).value = '';
}

function copyToClipboard(elementId, btn) {
    const el = document.getElementById(elementId);
    if (!el.value) return;

    el.select();
    document.execCommand('copy'); 

    const originalText = btn.innerText;
    btn.innerText = "✓ Copied";
    btn.style.background = "var(--success)";
    
    setTimeout(() => { 
        btn.innerText = originalText; 
        btn.style.background = "";
    }, 1500);
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('themeToggle').innerText = isDark ? "☀️" : "🌙";
}

window.onload = () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggle').innerText = "☀️";
    }
};

//feedback
if (localStorage.getItem('feedbackSubmitted')) {
    feedbackBox.style.display = 'none';
}

feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const scriptURL = 'https://script.google.com/macros/s/AKfycbz299Jx-uyI7IGlGpKwTj84nVRHIz8HuAKz8MURfh4u_zlCIjpUVHctIDlLL3uZzunLhg/exec';
    const formData = new FormData(feedbackForm);

    fetch(scriptURL, { method: 'POST', body: formData})
        .then(response => {
            feedbackForm.style.display = 'none';
            document.getElementById('thank-you-msg').style.display = 'block';
            localStorage.setItem('feedbackSubmitted', 'true');
        })
        .catch(error => console.error('Error!', error.message));
});

document.getElementById('close-feedback').onclick = () => feedbackBox.style.display = 'none';