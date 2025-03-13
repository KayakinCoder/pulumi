import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// every lambda function must have an iam role attached
const role = new aws.iam.Role('my-function-role', {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: "lambda.amazonaws.com"
  })
});

// our lambda function, with a hardcoded function definition. normally, you'll write your
// function code in a separate repo and deploy it either as a .zip or a container. 
const lambdaFunction = new aws.lambda.Function('my-function', {
  role: role.arn,
  handler: "index.handler",
  runtime: aws.lambda.Runtime.NodeJS22dX,
  code: new pulumi.asset.AssetArchive({
    "index.js": new pulumi.asset.StringAsset(
      "exports.handler = (e, c, cb) => cb(null, {statusCode: 200, body: 'Hello, world!'});",
    ),
  }),
});

// creats a publicly available URL we can hit to invoke our function
const lambdaUrl = new aws.lambda.FunctionUrl("my-function-url", {
  functionName: lambdaFunction.arn,
  authorizationType: "NONE",
});

export const functionName = lambdaFunction.name;
export const functionUrl = lambdaUrl.functionUrl;
