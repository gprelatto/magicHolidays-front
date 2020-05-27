import axios from 'axios';

const options = {
    headers: {
        'Content-type': 'application/json',
        'X-Api-Key': process.env.API_KEY
    }
}

export function getRequest() {
    return axios.get('https://magicholidays-api.herokuapp.com/suppliers/',
        options)
};

export const postRequest = (data) => {
    return axios.post('https://magicholidays-api.herokuapp.com/suppliers/',
    {
        description: data
    }, options)
}

export default getRequest();