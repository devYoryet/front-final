// src/utils/cognitoConfig.js
export const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_BM2KEBPZM",
  client_id: "53h6m5krqkq8phqtf63ed0otu5",
  redirect_uri: "http://localhost:3000/auth/callback",
  post_logout_redirect_uri: "http://localhost:3000/",
  response_type: "code",
  scope: "openid email profile",
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: true,
};

export const cognitoDomain = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_BM2KEBPZM";
export const clientId = "53h6m5krqkq8phqtf63ed0otu5";