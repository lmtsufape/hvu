import api from "./http-common-key";


async function loginClient(){
    try{
        const response = await api.post("realms/lmts/protocol/openid-connect/token",{
            client_id: "create_user",
            client_secret: "mesAECIaCcLkTmJB0riLGmqA14bSCTuH",
            grant_type: "client_credentials"
        },{headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        } })
        const token = response.data.access_token;
        console.log(token);
        localStorage.setItem('tokenClient', token);
        return token;
    }catch (error){
        console.log(error);
    }
}

export async function postRegister(email, name, password, groups){
    const token = await loginClient();
    try{
        
        const response = await api.post("admin/realms/lmts/users",{
            username: email,
	        emailVerified:true,
	        enabled:true,
            firstName:name,
            groups: [
                groups
            ],
            credentials:[
                {
                type:"password", value:password, temporary:false	
                }
            ]
        }, {headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }})
        return response;
    }catch(error){
        throw (error);
    }
}