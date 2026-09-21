(function () {
  'use strict';

  const storageKey = 'astralMindHelpProfile';
  const getProfile = () => JSON.parse(localStorage.getItem(storageKey) || 'null');
  const saveProfile = profile => localStorage.setItem(storageKey, JSON.stringify(profile));
  const getDemoProfile = () => {
    const isProfessional = window.location.pathname.endsWith('perfil-profissional.html');
    return isProfessional ? {
      accountType: 'professional',
      name: 'Dra. Camila Mendes',
      email: 'camila.mendes@exemplo.com',
      phone: '(18) 99876-5432',
      profession: 'Psicóloga Clínica',
      professional_registration: 'CRP 06/123456',
      specialty: 'Psicologia clínica e ansiedade',
      service_modality: 'online',
      professional_bio: 'Atendimento acolhedor para adultos, com foco em ansiedade, autoconhecimento e equilíbrio emocional.',
      image: 'assets/img/psicologa.jpg'
    } : {
      accountType: 'patient',
      name: 'Mariana Oliveira',
      email: 'mariana.oliveira@exemplo.com',
      phone: '(18) 99123-4567',
      street: 'Rua das Acácias',
      number: '245',
      neighborhood: 'Jardim Europa',
      city: 'Presidente Prudente',
      state: 'SP',
      complement: 'Apartamento 12',
      image: 'assets/img/pessoa_refletindo.jpg'
    };
  };
  const readFile = file => new Promise((resolve, reject) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    } else {
      resolve('');
    }
  });

  const registrationForm = document.querySelector('#registration-form') || document.querySelector('form[action="forms/contact.php"]');
  if (registrationForm && document.querySelector('#account-type')) {
    registrationForm.addEventListener('submit', async event => {
      event.preventDefault();
      const formData = new FormData(registrationForm);
      const password = formData.get('password');
      const confirmation = formData.get('password_confirmation');
      if (password === confirmation) {
        const profile = Object.fromEntries(formData.entries());
        profile.accountType = formData.get('account_type');
        const imageInput = document.querySelector('#profile-image');
        profile.image = await readFile(imageInput && imageInput.files[0]);
        delete profile.password;
        delete profile.password_confirmation;
        delete profile.profile_image;
        saveProfile(profile);
        window.location.href = profile.accountType === 'professional' ? 'perfil-profissional.html' : 'perfil-ajuda.html';
      } else {
        window.alert('As senhas precisam ser iguais.');
      }
    });
  }

  const loginForm = document.querySelector('#login form');
  if (loginForm) {
    loginForm.addEventListener('submit', event => {
      event.preventDefault();
      const profile = getProfile();
      const email = loginForm.querySelector('[name="email"]').value.trim().toLowerCase();
      const feedback = document.querySelector('#login-feedback');
      if (profile && profile.email && profile.email.toLowerCase() === email) {
        window.location.href = profile.accountType === 'professional' ? 'perfil-profissional.html' : 'perfil-ajuda.html';
      } else if (!profile || !profile.email) {
        window.location.href = 'perfil-ajuda.html';
      } else {
        feedback.textContent = 'Este e-mail não corresponde ao cadastro salvo neste navegador.';
        feedback.className = 'form-text text-center text-danger';
      }
    });
  }

  const profileForm = document.querySelector('[data-profile-form]');
  if (profileForm) {
    const profile = getProfile() || getDemoProfile();

  profileForm.querySelectorAll('[name]').forEach(field => {
    if (field.type !== 'file' && profile[field.name] !== undefined) field.value = profile[field.name];
  });
  document.querySelectorAll('[data-profile]').forEach(element => {
    const value = profile[element.dataset.profile];
    if (value) element.textContent = value;
  });
  const profileImage = document.querySelector('#profile-image');
  const profileImagePreview = document.querySelector('#profile-image-preview');
  const avatar = document.querySelector('.profile-avatar');
  if (profile.image) {
    if (avatar) avatar.src = profile.image;
    if (profileImagePreview) {
      profileImagePreview.src = profile.image;
      profileImagePreview.classList.remove('d-none');
    }
  }

  profileForm.addEventListener('submit', async event => {
    event.preventDefault();
    const updatedProfile = { ...profile, ...Object.fromEntries(new FormData(profileForm).entries()) };
    const file = profileImage && profileImage.files[0];
    delete updatedProfile.profile_image;
    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        updatedProfile.image = await readFile(file);
      } else {
        window.alert('A imagem deve ter no máximo 2 MB.');
      }
    }
    saveProfile(updatedProfile);
    if (avatar && updatedProfile.image) avatar.src = updatedProfile.image;
    const status = document.querySelector('.profile-status');
    if (status) {
      status.textContent = 'Alterações salvas com sucesso.';
      status.className = 'profile-status text-success';
    }
  });
  }
})();
