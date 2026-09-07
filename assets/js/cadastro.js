(function() {
  'use strict';

  const accountType = document.querySelector('#account-type');
  const professionalFields = document.querySelector('#professional-fields');

  if (!accountType || !professionalFields) return;

  const professionalFieldsToValidate = professionalFields.querySelectorAll('input, select, textarea');
  const profession = document.querySelector('#profession');
  const registrationLabel = document.querySelector('#professional-registration-label');
  const registrationInput = document.querySelector('#professional-registration');

  const updateRegistrationLabel = () => {
    const registrationNames = {
      psychologist: ['CRP', 'Número do CRP'],
      doctor: ['CRM', 'Número do CRM'],
      physiotherapist: ['CREFITO', 'Número do CREFITO'],
      nutritionist: ['CRN', 'Número do CRN']
    };
    const [label, placeholder] = registrationNames[profession.value] || ['Registro profissional', 'Número do registro'];
    if (registrationLabel) registrationLabel.textContent = label;
    if (registrationInput) registrationInput.placeholder = placeholder;
  };

  accountType.addEventListener('change', () => {
    const isProfessional = accountType.value === 'professional';
    professionalFields.classList.toggle('d-none', !isProfessional);
    professionalFieldsToValidate.forEach(field => {
      field.required = isProfessional;
    });
  });

  if (profession) profession.addEventListener('change', updateRegistrationLabel);
})();
