document.addEventListener('DOMContentLoaded', () => {
    const termList = document.getElementById('term-list');
    const termForm = document.getElementById('term-form');
    const termCountSpan = document.getElementById('term-count');
    const addTermBtn = document.getElementById('add-term-btn');
    const successMessageDiv = document.getElementById('success-message');
    const errorMessageDiv = document.getElementById('error-message');
    let termCounter = 1; // شمارنده اولیه
    const maxTerms = 20; // حداکثر تعداد اصطلاحات

    // --- تابع برای بررسی پر بودن آخرین ردیف ---
    function isLastPairFilled() {
        const lastPair = termList.querySelector('.term-pair:last-child');
        if (!lastPair) return true; // اگر هیچ ردیفی نیست، یعنی می‌توان اولین را اضافه کرد

        const lastTermInput = lastPair.querySelector('.term-input');
        const lastDefinitionInput = lastPair.querySelector('.definition-input');

        // حذف استایل خطا اگر وجود دارد
        lastTermInput.classList.remove('input-error');
        lastDefinitionInput.classList.remove('input-error');

        let isFilled = true;
        if (lastTermInput.value.trim() === '') {
            lastTermInput.classList.add('input-error'); // افزودن کلاس خطا
            isFilled = false;
        }
        if (lastDefinitionInput.value.trim() === '') {
            lastDefinitionInput.classList.add('input-error'); // افزودن کلاس خطا
             isFilled = false;
        }
        return isFilled;
    }

    // --- تابع برای اضافه کردن ردیف جدید ---
    function addTermPair() {
        // 1. شرط پر بودن ردیف آخر
        if (!isLastPairFilled()) {
             alert("لطفاً ابتدا فیلدهای خالی ردیف آخر را پر کنید.");
             // فوکوس روی اولین فیلد خالی در ردیف آخر
             const lastPair = termList.querySelector('.term-pair:last-child');
             const firstEmpty = lastPair.querySelector('input.input-error');
             if (firstEmpty) firstEmpty.focus();
             return; // اگر پر نبود، خارج شو
        }

        // 2. شرط حداکثر تعداد
        if (termCounter >= maxTerms) {
            alert(`شما به حداکثر تعداد اصطلاح (${maxTerms}) رسیده‌اید.`);
            return; // اگر به حد نصاب رسیده، خارج شو
        }

        termCounter++; // افزایش شمارنده کلی

        const newPair = document.createElement('div');
        newPair.classList.add('term-pair');

        const termInput = document.createElement('input');
        termInput.type = 'text';
        termInput.name = 'term[]';
        termInput.classList.add('term-input');
        termInput.placeholder = `کلمه/اصطلاح تخصصی ${termCounter}`;
        termInput.required = true;

        const definitionInput = document.createElement('input');
        definitionInput.type = 'text';
        definitionInput.name = 'definition[]';
        definitionInput.classList.add('definition-input');
        definitionInput.placeholder = `معنی/توضیح ${termCounter}`;
        definitionInput.required = true;

        // اضافه کردن قابلیت Enter به فیلد معنی جدید
        definitionInput.addEventListener('keydown', handleEnterKey);

        newPair.appendChild(termInput);
        newPair.appendChild(definitionInput);
        termList.appendChild(newPair);

        updateCounterDisplay();

        // غیرفعال کردن دکمه افزودن اگر به حد نصاب رسیدیم
        if (termCounter >= maxTerms) {
             addTermBtn.disabled = true;
             addTermBtn.style.opacity = '0.5'; // کمی محو شود
        }

        // فوکوس روی فیلد کلمه جدید
        termInput.focus();
    }

    // --- تابع برای مدیریت کلید Enter ---
    function handleEnterKey(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // جلوگیری از ارسال فرم

            const allDefinitionInputs = termList.querySelectorAll('.definition-input');
            // فقط اگر در آخرین فیلد معنی Enter زده شد، تلاش برای اضافه کردن ردیف جدید
            if (event.target === allDefinitionInputs[allDefinitionInputs.length - 1]) {
                addTermPair(); // تابع addTermPair خودش همه شرط ها رو چک میکنه
            } else {
                // اگر Enter در فیلدهای میانی زده شد، به فیلد کلمه ردیف بعدی برو
                const currentPair = event.target.closest('.term-pair');
                const nextPair = currentPair.nextElementSibling;
                if (nextPair) {
                    const nextTermInput = nextPair.querySelector('.term-input');
                    if (nextTermInput) {
                        nextTermInput.focus();
                    }
                } else {
                    // اگر آخرین بود ولی هنوز به max نرسیده بودیم (که یعنی پر بوده)
                    // این حالت معمولا نباید پیش بیاد چون enter روی آخری باعث add میشه
                     if (termCounter < maxTerms) {
                         addTermPair();
                     }
                }
            }
        }
    }

    // --- تابع برای آپدیت شمارنده روی صفحه ---
    function updateCounterDisplay() {
        termCountSpan.textContent = termCounter;
    }

    // --- مدیریت کلیک روی دکمه افزودن دستی ---
    addTermBtn.addEventListener('click', addTermPair);

    // --- مدیریت ارسال فرم با AJAX ---
    termForm.addEventListener('submit', function(event) {
        event.preventDefault(); // جلوگیری از ارسال پیش‌فرض

        // بررسی مجدد پر بودن آخرین ردیف قبل از ارسال نهایی
        if (!isLastPairFilled()) {
            alert("لطفاً قبل از ثبت نهایی، فیلدهای خالی ردیف آخر را پر کنید.");
            const lastPair = termList.querySelector('.term-pair:last-child');
            const firstEmpty = lastPair.querySelector('input.input-error');
            if (firstEmpty) firstEmpty.focus();
            return;
        }

        // بررسی پر بودن فیلدهای نام و بخش
        const userNameInput = document.getElementById('user-name');
        const departmentInput = document.getElementById('department');
        let formIsValid = true;
        if (userNameInput.value.trim() === '') {
            userNameInput.style.borderColor = '#dc3545'; // قرمز
            formIsValid = false;
        } else {
             userNameInput.style.borderColor = '#ccc'; // بازگشت به حالت عادی
        }
        if (departmentInput.value.trim() === '') {
            departmentInput.style.borderColor = '#dc3545'; // قرمز
            formIsValid = false;
        } else {
            departmentInput.style.borderColor = '#ccc'; // بازگشت به حالت عادی
        }

        if (!formIsValid) {
            alert('لطفاً نام و بخش خود را وارد کنید.');
             // فوکوس روی اولین فیلد خالی اطلاعات کاربر
             if (userNameInput.value.trim() === '') userNameInput.focus();
             else if (departmentInput.value.trim() === '') departmentInput.focus();
            return;
        }


        const formData = new FormData(termForm);
        const submitButton = termForm.querySelector('.submit-btn');
        const originalButtonText = submitButton.textContent;

        // نمایش حالت لودینگ روی دکمه
        submitButton.disabled = true;
        submitButton.textContent = 'در حال ارسال...';
        errorMessageDiv.style.display = 'none'; // مخفی کردن پیام خطای قبلی

        fetch(termForm.action, {
            method: termForm.method,
            body: formData,
            headers: {
                'Accept': 'application/json' // درخواست پاسخ JSON از Formspree
            }
        }).then(response => {
            if (response.ok) {
                // موفقیت آمیز بود
                termForm.style.display = 'none'; // مخفی کردن فرم
                successMessageDiv.style.display = 'block'; // نمایش پیام موفقیت
                // نیازی به ریست دکمه نیست چون فرم مخفی شده
            } else {
                // خطا در سمت سرور (مثل خطای Formspree)
                response.json().then(data => { // سعی در خواندن جزئیات خطا اگر JSON باشد
                    if (Object.hasOwn(data, 'errors')) {
                        errorMessageDiv.querySelector('p').textContent = '❌ خطایی در ارسال رخ داد: ' + data["errors"].map(error => error["message"]).join(", ");
                    } else {
                         errorMessageDiv.querySelector('p').textContent = '❌ خطایی در ارسال رخ داد. لطفاً دوباره تلاش کنید.';
                    }
                    errorMessageDiv.style.display = 'block';
                }).catch(error => { // اگر پاسخ JSON نبود یا خطای دیگری رخ داد
                     errorMessageDiv.querySelector('p').textContent = '❌ خطایی در ارسال رخ داد. لطفاً دوباره تلاش کنید.';
                     errorMessageDiv.style.display = 'block';
                });
                 // بازگرداندن دکمه به حالت عادی
                 submitButton.disabled = false;
                 submitButton.textContent = originalButtonText;
            }
        }).catch(error => {
            // خطا در شبکه یا اتصال
            console.error('Fetch Error:', error);
            errorMessageDiv.querySelector('p').textContent = '❌ خطای شبکه. لطفاً اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید.';
            errorMessageDiv.style.display = 'block';
            // بازگرداندن دکمه به حالت عادی
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
    });

    // --- Event listener اولیه برای اولین فیلد معنی ---
    const firstDefinitionInput = termList.querySelector('.definition-input');
    if (firstDefinitionInput) {
        firstDefinitionInput.addEventListener('keydown', handleEnterKey);
    }

    // --- آپدیت اولیه شمارنده ---
    updateCounterDisplay();
});
