import api from "./http-common-back";


export async function postLogin(login, password){
    localStorage.clear();
    try{
        const response = await api.post("/auth/login", {
            email: login,
            senha: password,
        },{headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        } } )
        const token = response.data.access_token;
        const refresh_token = response.data.refresh_token;
        const roles = response.data.roles;
        console.log(response.data);
        localStorage.setItem('token', token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('roles', JSON.stringify(roles)); // Para recuperar: const roles = JSON.parse(localStorage.getItem('roles'));
        console.log(token);
        console.log(refresh_token);
        console.log(roles);
        return response.data;
    }catch (error){
        throw (error);
    }
}