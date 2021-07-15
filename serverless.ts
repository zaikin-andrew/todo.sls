import { todo } from '@functions/todo';
import { AWSPartitial } from '@libs/aws-partial';

const serverlessConfiguration: AWSPartitial = {
  service: 'todo-sls',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: {
        forceExclude: ['aws-sdk'],
        concurrency: 5,
        serializedCompile: true,
        packager: 'npm',
      },
    },
    prune: {
      automatic: true,
      number: 3,
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-prune-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      TODO_TABLE_NAME: 'Todos-SLS-demo',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:DescribeTable',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:DeleteItem',
              'dynamodb:UpdateItem',
              'dynamodb:BatchGetItem',
              'dynamodb:BatchWriteItem',
            ],
            Resource: [
              'arn:aws:dynamodb:*:*:table/Todos-SLS-demo',
              'arn:aws:dynamodb:*:*:table/Todos-SLS-demo/index/*',
            ],
          },
        ],
      },
    },
    lambdaHashingVersion: '20201221',
    region: 'us-east-1',
    profile: 'flo',
    logs: {
      httpApi: true,
    },
    httpApi: {
      useProviderTags: true,
      payload: '2.0',
      cors: true,
    },
  },
  // import the function via paths
  ...todo,
};

module.exports = serverlessConfiguration;
