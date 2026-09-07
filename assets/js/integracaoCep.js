(function() {
  'use strict';

  const cepInput = document.querySelector('#cep');
  const streetInput = document.querySelector('#street');
  const neighborhoodInput = document.querySelector('#neighborhood');
  const cityInput = document.querySelector('#city');
  const stateInput = document.querySelector('#state');
  const cepFeedback = document.querySelector('#cep-feedback');
  const searchCepButton = document.querySelector('#search-cep');
  const searchAddressButton = document.querySelector('#search-address');

  if (!cepInput || !streetInput || !cityInput || !stateInput) return;

  const formatCep = value => {
    const numbers = value.replace(/\D/g, '').slice(0, 8);
    return numbers.length > 5 ? `${numbers.slice(0, 5)}-${numbers.slice(5)}` : numbers;
  };
  const cleanCep = value => value.replace(/\D/g, '');
  let lastSearchedCep = '';

  const showCepFeedback = message => {
    if (cepFeedback) cepFeedback.textContent = message;
  };

  const fillAddress = data => {
    streetInput.value = data.logradouro || '';
    if (neighborhoodInput) neighborhoodInput.value = data.bairro || '';
    cityInput.value = data.localidade || '';
    stateInput.value = data.uf || '';
  };

  const searchByCep = async () => {
    const cep = cleanCep(cepInput.value);
    if (cep.length !== 8) {
      showCepFeedback('Digite um CEP válido com 8 números.');
      return;
    }

    if (cep === lastSearchedCep) return;
    lastSearchedCep = cep;

    showCepFeedback('Buscando endereço...');
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error('Não foi possível conectar à API de CEP.');
      const data = await response.json();
      if (data.erro) throw new Error('CEP não encontrado.');
      fillAddress(data);
      showCepFeedback('Endereço preenchido pelo CEP.');
    } catch (error) {
      lastSearchedCep = '';
      showCepFeedback(error.message || 'Não foi possível consultar o CEP.');
    }
  };

  cepInput.addEventListener('input', () => {
    cepInput.value = formatCep(cepInput.value);
    if (cleanCep(cepInput.value).length === 8) searchByCep();
  });
  cepInput.addEventListener('blur', searchByCep);
  if (searchCepButton) searchCepButton.addEventListener('click', searchByCep);

  if (searchAddressButton && neighborhoodInput) {
    searchAddressButton.addEventListener('click', async () => {
      const state = stateInput.value;
      const city = cityInput.value.trim();
      const street = streetInput.value.trim();
      if (!state || !city || !street) {
        showCepFeedback('Preencha UF, cidade e rua para localizar o CEP.');
        return;
      }

      showCepFeedback('Buscando CEP pelo endereço...');
      try {
        const query = `${state}/${encodeURIComponent(city)}/${encodeURIComponent(street)}`;
        const response = await fetch(`https://viacep.com.br/ws/${query}/json/`);
        const addresses = await response.json();
        if (!Array.isArray(addresses) || addresses.length === 0) throw new Error('CEP não encontrado para esse endereço.');
        cepInput.value = formatCep(addresses[0].cep);
        fillAddress(addresses[0]);
        showCepFeedback(addresses.length > 1 ? 'Mais de um endereço encontrado; o primeiro foi selecionado.' : 'CEP encontrado.');
      } catch (error) {
        showCepFeedback(error.message || 'Não foi possível localizar o CEP.');
      }
    });
  }
})();
