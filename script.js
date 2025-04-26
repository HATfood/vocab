document.addEventListener('DOMContentLoaded', () => {
    const termList = document.getElementById('term-list');
    const termForm = document.getElementById('term-form');
    const termCountSpan = document.getElementById('term-count');
    let termCounter = 1; // شمارنده اولیه چون یک ردیف از قبل هست

    // تابع برای اضافه کردن ردیف جدید
    function addTermPair() {
        termCounter++; // افزایش شمارنده کلی

        const newPair = document.createElement('div');
        newPair.classList.add('term-pair');

        const termInput = document.createElement('input');
        termInput.type = 'text';
        termInput.name = 'term[]';
        termInput.classList.add('term-input');
        termInput.placeholder = `کلمه/اصطلاح تخصصی ${termCounter}`;
        termInput.required = true; // الزامی کردن فیلدها

        const definitionInput = document.createElement('input');
        definitionInput.type = 'text';
        definitionInput.name = 'definition[]';
        definitionInput.classList.add('definition-input');
        definitionInput.placeholder = `معنی/توضیح ${termCounter}`;
        definitionInput.required = true; // الزامی کردن فیلدها

        // اضافه کردن قابلیت Enter به فیلد معنی جدید
        definitionInput.addEventListener('keydown', handleEnterKey);

        newPair.appendChild(termInput);
        newPair.appendChild(definitionInput);
        termList.appendChild(newPair);

        updateCounterDisplay(); // آپدیت نمایش شمارنده

        // فوکوس روی فیلد کلمه جدید
        termInput.focus();
    }

    // تابع برای مدیریت کلید Enter
    function handleEnterKey(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // جلوگیری از ارسال فرم یا رفتن به خط بعد در input

            // فقط اگر در آخرین فیلد معنی Enter زده شد، ردیف جدید اضافه کن
            const allDefinitionInputs = termList.querySelectorAll('.definition-input');
            if (event.target === allDefinitionInputs[allDefinitionInputs.length - 1]) {
                 // اینجا میتونید محدودیت 20 تا رو اعمال کنید
                 if (termCounter < 20) {
                     addTermPair();
                 } else {
                     alert("شما به حداکثر تعداد اصطلاح (20) رسیده‌اید.");
                     // فوکوس روی دکمه ثبت
                     termForm.querySelector('.submit-btn').focus();
                 }
            } else {
                // اگر Enter در فیلد معنی ردیف‌های قبلی زده شد، به فیلد کلمه ردیف بعدی برو
                const currentPair = event.target.closest('.term-pair');
                const nextPair = currentPair.nextElementSibling;
                if (nextPair) {
                    const nextTermInput = nextPair.querySelector('.term-input');
                    if (nextTermInput) {
                        nextTermInput.focus();
                    }
                } else {
                     // اگر آخرین ردیف بود و هنوز به 20 نرسیده بودیم (این حالت نباید پیش بیاد طبق منطق بالا ولی محض احتیاط)
                     if (termCounter < 20) {
                         addTermPair();
                     }
                }
            }
        }
    }

    // تابع برای آپدیت شمارنده روی صفحه
    function updateCounterDisplay() {
        termCountSpan.textContent = termCounter;
    }

    // اضافه کردن event listener اولیه به اولین فیلد معنی که در HTML وجود دارد
    const firstDefinitionInput = termList.querySelector('.definition-input');
    if (firstDefinitionInput) {
        firstDefinitionInput.addEventListener('keydown', handleEnterKey);
    }

    // اطمینان از اینکه نام‌های آرایه‌ای به درستی ارسال می‌شوند
    // Formspree معمولاً این را به خوبی مدیریت می‌کند، نیازی به کار اضافه نیست.

    // آپدیت اولیه شمارنده
    updateCounterDisplay();
});
