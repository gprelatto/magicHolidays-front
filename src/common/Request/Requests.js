import axios from 'axios';

function getAuthHeaders() {
    let auth = JSON.parse(localStorage.getItem('auth'));

    return {
        headers: {
            'Content-type': 'application/json',
            'mail': auth.mail,
            'token': auth.token
        }
    }
}

export const getRequest = (endpoint, props) => {
    let response = axios.get('https://magicholidays-api.herokuapp.com/' + endpoint + '/',
        getAuthHeaders())

    return response;
};

export const postSupplier = (data) => {
    return axios.post('https://magicholidays-api.herokuapp.com/suppliers/',
    {
        description: data
    }, getAuthHeaders())
}

export const editSupplier = (data) => {
    return axios.put('https://magicholidays-api.herokuapp.com/suppliers/' + data.id + '/',
    {
        id: data.id,
        description: data.description
    }, getAuthHeaders())
}

export const deleteSupplier = (data) => {
    return axios.delete('https://magicholidays-api.herokuapp.com/suppliers/' + data.id + '/',
        getAuthHeaders())
}

export const postProductCategory = (data) => {
    return axios.post('https://magicholidays-api.herokuapp.com/productCategories/',
    {
        supplier: data.supplier.id.toString(),
        description: data.description
    }, getAuthHeaders())
}

export const editProductCategory = (data) => {
    return axios.put('https://magicholidays-api.herokuapp.com/productCategories/' + data.id + '/',
    {
        id: data.id,
        supplier: data.supplierId.toString(),
        description: data.description
    }, getAuthHeaders())
}

export const deleteProductCategory = (data) => {
    return axios.delete('https://magicholidays-api.herokuapp.com/productCategories/' + data.id + '/',
    getAuthHeaders())
}

export const postProduct = (data) => {
    return axios.post('https://magicholidays-api.herokuapp.com/products/',
    {
        product_category: data.product_category.toString(),
        description: data.description
    }, getAuthHeaders())
}

export const editProduct = (data) => {
    return axios.put('https://magicholidays-api.herokuapp.com/products/' + data.id + '/',
    {
        id: data.id,
        product_category: data.prodCategoryId,
        description: data.description
    }, getAuthHeaders())
}

export const deleteProduct = (data) => {
    return axios.delete('https://magicholidays-api.herokuapp.com/products/' + data.id + '/',
        getAuthHeaders())
}

export const postCustomer = (data) => {
    return axios.post('https://magicholidays-api.herokuapp.com/customers/',
    {
        fullname: data.fullname,
        mail: data.mail,
        phone: data.phone,
        country: data.country
    }, getAuthHeaders())
}

export const editCustomer = (data) => {
    return axios.put('https://magicholidays-api.herokuapp.com/customers/' + data.id + '/',
    {
        id: data.id,
        fullname: data.fullname,
        mail: data.mail,
        phone: data.phone,
        country: data.country
    }, getAuthHeaders())
}

export const deleteCustomer = (data) => {
    return axios.delete('https://magicholidays-api.herokuapp.com/customers/' + data.id + '/',
        getAuthHeaders())
}

export default getRequest;