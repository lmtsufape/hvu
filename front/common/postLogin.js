import api from "./http-common-key";

export async function postLogin(login, password) {
  try {
    const response = await api.post(
      "realms/lmts/protocol/openid-connect/token",
      {
        client_id: "app_lmts",
        client_secret: "8S5xt4pa7tG4ynmnMX44mE063dKF890V",
        username: login,
        password: password,
        grant_type: "password",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const token = response.data.access_token;
    const refresh_token = response.data.refresh_token;
    console.log(response.data);
    localStorage.setItem("token", token);
    localStorage.setItem("refresh_token", refresh_token);
    console.log(token);
    console.log(refresh_token);
    return response.data;
  } catch (error) {
    throw error;
  }
}
