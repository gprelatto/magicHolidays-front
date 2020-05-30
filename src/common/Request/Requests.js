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
        supplier: data.supplier.id.toString(),
        description: data.description
    }, options)
}

export const editProductCategory = (data) => {
    return axios.put('https://magicholidays-api.herokuapp.com/productCategories/' + data.id + '/',
    {
        id: data.id,
        supplier: data.supplierId.toString(),
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

export const editProduct = (data) => {
    return axios.put('https://magicholidays-api.herokuapp.com/products/' + data.id + '/',
    {
        id: data.id,
        product_category: data.prodCategoryId,
        description: data.description
    }, options)
}

export const deleteProduct = (data) => {
    return axios.delete('https://magicholidays-api.herokuapp.com/products/' + data.id + '/',
        options)
}

export const postCustomer = (data) => {
    return axios.post('https://magicholidays-api.herokuapp.com/customers/',
    {
        fullname: data.fullname,
        mail: data.mail,
        phone: data.phone,
        country: data.country
    }, options)
}

export const editCustomer = (data) => {
    return axios.put('https://magicholidays-api.herokuapp.com/customers/' + data.id + '/',
    {
        id: data.id,
        fullname: data.fullname,
        mail: data.mail,
        phone: data.phone,
        country: data.country
    }, options)
}

export const deleteCustomer = (data) => {
    return axios.delete('https://magicholidays-api.herokuapp.com/customers/' + data.id + '/',
        options)
}

export default getRequest;