// ВСЕМ ПРИВЕТ С ВАМИ БАААААТОНОС

function initiateSignup() {
    const form = document.querySelector('#signup-form');
    const PATH = 'http://localhost:8080/auth/signup';
    console.log(form);
    console.dir(form);

    form.onsubmit = (event) => {
        event.preventDefault();
    }

    const usernameInput = form[0];
    const usernameErrorText = usernameInput.nextElementSibling;
    const emailInput = form[1]
    const emalErrorText = emailInput.nextElementSibling;
    const passwordInput = form[2];
    const passwordErrorText = passwordInput.nextElementSibling;
    const errorTextElement = document.querySelector('.error-text')
    let isEmailOk = false;
    let isPasswordOk = false;
    let isUsernameOk = false;

    const sendButton = form[3];

    usernameInput.addEventListener('change', (event) => {
        isUsernameOk = checkUsernameInput(usernameInput, usernameErrorText);
        console.log(isUsernameOk);
    });

    emailInput.addEventListener('change', (event) => {
        isEmailOk = checkEmailInput(emailInput, emalErrorText);
    });

    passwordInput.addEventListener('change', (event) => {
        isPasswordOk = checkPasswordInput(passwordInput, passwordErrorText);
    });


    sendButton.addEventListener('click', async (event) => {
        console.log(isUsernameOk, isEmailOk, isPasswordOk);
        if ((await isUsernameOk) && (await isEmailOk) && isPasswordOk) {
            const payload = JSON.stringify({
                username: usernameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            })

            console.warn(payload);

            fetch(PATH, {
                method: "POST",
                body: payload,
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors"
            }).then(async (response) => {
                if (response.ok) {
                    const data = await response.json();
                    alert('horay!!!');
                    window.location.replace("http://localhost:8080/horay");
                    errorTextElement.classList.add('hidden');
                } else {
                    errorTextElement.classList.remove('hidden');
                    errorTextElement.innerHTML = 'SERVER_ERROR';
                }
            })
        } else {
            errorTextElement.classList.remove('hidden');
        }
    })
}

function initiateLogin() {
    const PATH = 'http://localhost:8080/auth/login';
    const form = document.querySelector('#login-form');

    form.onsubmit = (event) => {
        event.preventDefault();
    }

    const credentialInput = form[0];
    const passwordInput = form[1];
    const sendButton = form[2];
    const errorTextElement = form.nextElementSibling;

    sendButton.addEventListener('click', (event) => {
        const payload = JSON.stringify({
            credential: credentialInput.value,
            password: passwordInput.value
        })

        fetch(PATH, {
            method: "POST",
            body: payload,
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors"
        }).then((response) => {
            if (response.ok) {
                window.location.replace("http://localhost:8080/horay");
                console.log("horay!!!");
                errorTextElement.classList.add('hidden');
            } else {
                //console.log("horay!!!");
                errorTextElement.classList.remove('hidden');
            }
        })
    })
}

function checkEmailInput(input, errorTextElement) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(input.value)) {
        errorTextElement.classList.remove('hidden');
        errorTextElement.innerText = "Wrong email format";
        if(input.value == '') {
            errorTextElement.innerText = "Email is required";
        }
        return Promise.resolve(false);
    } else {
        return fetch('http://localhost:8080/auth/emailValidation', {
            method: "POST",
            body: JSON.stringify({
                username: '',
                email: input.value,
                password: '',
            }),
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
        })
        .then(response => {
            if (response.ok) {
                errorTextElement.classList.add('hidden');
                return true;
            } else {
                errorTextElement.classList.remove('hidden');
                errorTextElement.innerText = "This email is already used";
                return false;
            }
        })
    }
}

function checkUsernameInput(input, errorTextElement) {
    if (input.value.length < 3) {
        errorTextElement.classList.remove('hidden');
        errorTextElement.innerText = "Username must be at least 3 charachters long";
        if(input.value == '') {
            errorTextElement.innerText = "Username is required";
        }
        return Promise.resolve(false);
    } else {
        return fetch('http://localhost:8080/auth/usernameValidation', {
            method: "POST",
            body: JSON.stringify({
                username: input.value.trim(),
                email: '',
                password: '',
            }),
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
        })
        .then(response => {
            if (response.ok) {
                errorTextElement.classList.add('hidden');
                return true;
            } else {
                errorTextElement.classList.remove('hidden');
                errorTextElement.innerText = "This username is already used";
                return false;
            }
        })
    }
}

function checkPasswordInput(input, errorTextElement) {
    if (input.value.length < 3) {
        errorTextElement.classList.remove('hidden');
        errorTextElement.innerText = "Password must be at least 3 charachters long";
        if(input.value == '') {
            errorTextElement.innerText = "Password is required";
        }
        return 0;
    } else {
        errorTextElement.classList.add('hidden');
        return 1;
    }
}

document.addEventListener('DOMContentLoaded',(event) => {
    if (document.querySelector('#login-form')) {
        initiateLogin();
    }

    if (document.querySelector('#signup-form')) {
        initiateSignup();
    }
})