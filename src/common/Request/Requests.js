import axios from 'axios';

const options = {
    headers: {
        'Content-type': 'application/json',
        'X-Api-Key': process.env.REACT_APP_API_KEY
    }
}

export const getRequest = (endpoint) => {
    return axios.get('https://magicholidays-api.herokuapp.com/' + endpoint +'/',
        options)
};

export const postSupplier = (data) => {
    return axios.post('https://magicholidays-api.herokuapp.com/suppliers/',
    {
        description: data
    }, options)
}

export const postProductCategory = (data) => {
    return axios.post('https://magicholidays-api.herokuapp.com/productCategories/',
    {
        supplier: data.supplier.id.toString(),
        description: data.description
    }, options)
}

export const postProduct = (data) => {
    return axios.post('https://magicholidays-api.herokuapp.com/products/',
    {
        product_category: data.product_category.toString(),
        description: data.description
    }, options)
}

export default getRequest;