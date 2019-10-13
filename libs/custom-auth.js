'use strict';

const jwt     = require('jsonwebtoken');

module.exports.handler = async (event) => {

  console.log(`request body is valid JSON`, { requestBody: event });
  //verify token
  let effect = 'allow';
  try {
    let decoded = jwt.verify(event.authorizationToken, 'secrect');
  } catch(err) {
    console.log(err);
    effect = 'deny';
  }
  return buildPolicy('user',effect,event.methodArn);
   
};

function buildPolicy(principalId, effect, resource) {
  var authResponse = {};
  authResponse.principalId = principalId;

  if (effect && resource) {
    var policyDocument = {
      Version: '2012-10-17', // default version
      Statement: [
        {
          Action: 'execute-api:Invoke', // default action
          Effect: effect,
          Resource: resource
        }
      ]
    };
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}

