(function () {
    var img = new Image();
    img.onload = function () {
        document.getElementById('bgImage').classList.add('loaded');
    };
    img.src = 'https://files.catbox.moe/ixl2qb.png';
})();

var currentStep = 0;
var countdownInterval = null;

var TARGET_DATE = getNextSaturdayNoon();

function getNextSaturdayNoon() {
    var now = new Date();
    var vienna = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Vienna' }));
    var day = vienna.getDay();
    var daysUntilSaturday = (6 - day + 7) % 7;
    if (daysUntilSaturday === 0 && vienna.getHours() >= 12) {
        daysUntilSaturday = 7;
    }
    var target = new Date(vienna);
    target.setDate(vienna.getDate() + daysUntilSaturday);
    target.setHours(12, 0, 0, 0);
    var offset = target.getTime() - vienna.getTime();
    return new Date(now.getTime() + offset);
}

function goTo(step) {
    document.querySelector('.step[data-step="' + currentStep + '"]').classList.remove('active');
    document.querySelector('.step[data-step="' + step + '"]').classList.add('active');

    document.querySelectorAll('.progress-segment').forEach(function (seg, i) {
        seg.classList.toggle('active', i <= step);
    });

    currentStep = step;

    if (step === 2) {
        startCountdown();
    } else if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

function toggleRules() {
    var cb = document.getElementById('acceptRules');
    setTimeout(function () {
        document.getElementById('rulesNext').disabled = !cb.checked;
    }, 0);
}

function copyIP() {
    navigator.clipboard.writeText('mc.amadeus.buzz').then(function () {
        var btn = document.getElementById('copyBtn');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        btn.classList.add('copied');
        setTimeout(function () {
            btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
}

function startCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    var now = new Date();
    var diff = TARGET_DATE.getTime() - now.getTime();
    var countdownEl = document.getElementById('countdown');

    if (diff <= 0) {
        countdownEl.classList.add('hidden');
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        return;
    }

    countdownEl.classList.remove('hidden');

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    var seconds = Math.floor((diff % 60000) / 1000);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}
