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

export const editSupplier = (data) => {
    return axios.put('https://magicholidays-api.herokuapp.com/suppliers/' + data.id + '/',
    {
        id: data.id,
        description: data.description
    }, options)
}

export const deleteSupplier = (data) => {
    return axios.delete('https://magicholidays-api.herokuapp.com/suppliers/' + data.id + '/',
        options)
}

export const postProductCategory = (data) => {
    return axios.post('https://magicholidays-api.herokuapp.com/productCategories/',
    {
        supplier: data.supplierId,
        description: data.description
    }, options)
}

export const editProductCategory = (data) => {
    return axios.put('https://magicholidays-api.herokuapp.com/productCategories/' + data.id + '/',
    {
        id: data.id,
        supplier: data.supplierId,
        description: data.description
    }, options)
}

export const deleteProductCategory = (data) => {
    return axios.delete('https://magicholidays-api.herokuapp.com/productCategories/' + data.id + '/',
        options)
}

export const postProduct = (data) => {
    return axios.post('https://magicholidays-api.herokuapp.com/products/',
    {
        product_category: data.product_category.toString(),
        description: data.description
    }, options)
}


export default getRequest;