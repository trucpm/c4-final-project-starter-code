import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger('Attach storage logger');
// TODO: Implement the fileStogare logic
export class AttachmentUtils {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE
    ) {}
    
    async updateAttachmentUrl(todoId: string, userId: string, url: string): Promise<string> {
        logger.info('Update Attachment URL: ');
        await this.docClient.update({
          TableName: this.todosTable,
          Key: {
            todoId: todoId,
            userId: userId
          },
          UpdateExpression: "set attachmentUrl = :url",
          ExpressionAttributeValues: {
            ":url": url,
          }
        }).promise();
        
        return url;
    }

}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        logger.info('Create local DynamoDB instance');
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient();
}