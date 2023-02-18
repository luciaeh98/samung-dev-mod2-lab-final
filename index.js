const 
    form        = document.querySelector('.form'),
    expressions = {	
	    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	    password: /^.{1,8}$/
    };

form?.addEventListener('submit', e => submitFormDataCallback(e));

function submitFormDataCallback(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    if (validateFields(formData)) alert('La inscripción fue exitosa');
}

function validateFields(formData) {
    const formDataObj = Object.fromEntries(formData.entries());
    const validationsResult = [];
    
    for (const [key, value] of formData.entries()) {
        const validationObject = {
            name: key,
            isValid: false,
            errorMessage: '',
            setIsValid: function() {
                this.isValid = this.errorMessage === '';
            }
        };

        if (value) {
            if (key === 'email' && !expressions.email.test(value)) {
                validationObject.errorMessage = 'Email inválido';
            }

            if (key === 'password' || key === 'confirmPassword') {
                if (!expressions.password.test(value))
                    validationObject.errorMessage = 'No debe tener más de 8 caracteres';
                else {
                    if (key === 'confirmPassword' && formDataObj.password !== formDataObj.confirmPassword) {
                        validationObject.errorMessage = 'Las contraseñas no coinciden';
                    }
                }
            }
        }
        else
            validationObject.errorMessage = 'Rellene este campo';

        validationObject.setIsValid();
        validationsResult.push(validationObject);
    }
    
    validationsResult?.forEach(obj => {
        const 
            inputElement    = document.querySelector(`[id=${obj.name}]`),
            spanElement     = inputElement.nextElementSibling;

        obj.isValid ? setValidField(inputElement, spanElement) : setInvalidField(inputElement, spanElement, obj.errorMessage);
    });

    return validationsResult.every(obj => obj.isValid);
}

function setValidField(inputElement, spanElement) {
    inputElement.classList.remove('form-group__input--error');
    inputElement.classList.add('form-group__input--success');
    spanElement.innerHTML = null;
}

function setInvalidField(inputElement, spanElement, errorMessage)
{
    inputElement.classList.remove('form-group__input--success');
    inputElement.classList.add('form-group__input--error');
    spanElement.innerHTML = errorMessage;
}