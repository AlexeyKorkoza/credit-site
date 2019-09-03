import sender from './sender';

const createClientCard = data => {
    return sender(`${API_URL}/api/v1/clients-cards`, 'post', data)
        .catch(err => console.error(err.message, 'createClientCard'));
};

export {
    createClientCard,
};