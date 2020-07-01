const { response } = require("../src/utils");
const { default: fetch } = require("node-fetch");
const SWA_EMU_AUTH_URI = process.env.SWA_EMU_AUTH_URI || `//localhost:4242`;

module.exports = async function (context, req) {
  let { state, code } = req.query;

  state = decodeURIComponent(state);

  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;
  const oauthUri = `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&state=${state}`;
  const githubOauthResponse = await fetch(oauthUri, {
    method: "POST",
    headers: {
      accept: "application/json",
    },
  });

  const token = await githubOauthResponse.json();
  console.log(JSON.stringify(token));

  const location = `${SWA_EMU_AUTH_URI}/.auth/login/done`;
  context.res = response({
    context,
    status: 302,
    cookies: [
      {
        name: "Nonce",
        value: "deleted",
        path: "/",
        expires: new Date(1970),
      },
      {
        name: "RedirectCount",
        value: "deleted",
        path: "/",
        expires: new Date(1970),
      },
      {
        name: "AppServiceAuthSession",
        value: process.env.AppServiceAuthSession,
        path: "/",
        secure: false,
        HttpOnly: false,
        SameSite: "None",
      },
    ],
    headers: {
      location,
    },
  });
};