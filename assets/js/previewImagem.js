(function () {
  'use strict';

  const imageInput = document.querySelector('#profile-image');
  const imagePreview = document.querySelector('#profile-image-preview');
  const maxSize = 2 * 1024 * 1024;

  if (!imageInput || !imagePreview) return;

  imageInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > maxSize) {
      imageInput.value = '';
      imagePreview.src = '';
      imagePreview.classList.add('d-none');
      window.alert('A imagem deve ter no máximo 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      imagePreview.src = reader.result;
      imagePreview.classList.remove('d-none');
    });
    reader.readAsDataURL(file);
  });
})();
