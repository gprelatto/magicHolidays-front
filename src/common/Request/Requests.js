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

const baseUrl = 'http://mhtravelagency-api.herokuapp.com/';

export const redirectToUnforbidden = (props) => {
    localStorage.setItem("auth", JSON.stringify({}));
    props.history.push('/auth/forbidden');
}

export const getRequest = (endpoint) => {
    let response = axios.get(baseUrl + endpoint + '/',
        getAuthHeaders())

    return response;
};

export const postSupplier = (data) => {
    return axios.post(baseUrl + 'suppliers/',
    {
        description: data
    }, getAuthHeaders())
}

export const editSupplier = (data) => {
    return axios.put(baseUrl + 'suppliers/' + data.id + '/',
    {
        id: data.id,
        description: data.description
    }, getAuthHeaders())
}

export const deleteSupplier = (data) => {
    return axios.delete(baseUrl + 'suppliers/' + data.id + '/',
        getAuthHeaders())
}

export const postProductCategory = (data) => {
    return axios.post(baseUrl + 'productCategories/',
    {
        supplier: data.supplier.id.toString(),
        description: data.description
    }, getAuthHeaders())
}

export const editProductCategory = (data) => {
    return axios.put(baseUrl + 'productCategories/' + data.id + '/',
    {
        id: data.id,
        supplier: data.supplierId.toString(),
        description: data.description
    }, getAuthHeaders())
}

export const deleteProductCategory = (data) => {
    return axios.delete(baseUrl + 'productCategories/' + data.id + '/',
    getAuthHeaders())
}

export const postProduct = (data) => {
    return axios.post(baseUrl + 'products/',
    {
        product_category: data.product_category.toString(),
        description: data.description
    }, getAuthHeaders())
}

export const editProduct = (data) => {
    return axios.put(baseUrl + 'products/' + data.id + '/',
    {
        id: data.id,
        product_category: data.prodCategoryId,
        description: data.description
    }, getAuthHeaders())
}

export const deleteProduct = (data) => {
    return axios.delete(baseUrl + 'products/' + data.id + '/',
        getAuthHeaders())
}

export const postCustomer = (data) => {
    return axios.post(baseUrl + 'customers/',
    {
        fullname: data.fullname,
        mail: data.mail,
        phone: data.phone,
        country: data.country,
        created_by: data.created_by
    }, getAuthHeaders())
}

export const editCustomer = (data) => {
    return axios.put(baseUrl + 'customers/' + data.id + '/',
    {
        id: data.id,
        fullname: data.fullname,
        mail: data.mail,
        phone: data.phone,
        country: data.country
    }, getAuthHeaders())
}

export const deleteCustomer = (data) => {
    return axios.delete(baseUrl + 'customers/' + data.id + '/',
        getAuthHeaders())
}

export const editProfile = (data) => {
    return axios.post(baseUrl + 'getProfile/',
    {
        id: data.id,
        name: data.name,
        lastname: data.lastname,
        mail: data.mail,
        phone: data.phone,
        country: data.country,
        user_type: data.user_type
    }, getAuthHeaders())
}

export const postUser = (data) => {
    return axios.post(baseUrl + 'users/',
    {
        name: data.name,
        lastname: data.lastname,
        mail: data.mail,
        phone: data.phone,
        country: data.country,
        user_type: data.user_type,
        password: data.password
    }, getAuthHeaders())
}

export const editUser = (data) => {
    return axios.put(baseUrl + 'users/' + data.id + '/',
    {
        id: data.id,
        name: data.name,
        lastname: data.lastname,
        mail: data.mail,
        phone: data.phone,
        country: data.country,
        user_type: data.user_type
    }, getAuthHeaders())
}

export const deleteUser = (data) => {
    return axios.delete(baseUrl + 'users/' + data.id + '/',
        getAuthHeaders())
}

export const postRez = (data) => {
    return axios.post(baseUrl + 'reservations/', data, getAuthHeaders())
}

export const editRez = (data) => {
    return axios.put(baseUrl + 'reservations/' + data.id + '/', data, getAuthHeaders())
}

export const deleteRez = (data) => {
    return axios.delete(baseUrl + 'reservations/' + data + '/', getAuthHeaders())
}

export const postPrepay = (data) => {
    return axios.post(baseUrl + 'prepay/',
    data, getAuthHeaders())
}

export const postPay = (data) => {
    return axios.post(baseUrl + 'pay/',
    data, getAuthHeaders())
}

export default getRequest;