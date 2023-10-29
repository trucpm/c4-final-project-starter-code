import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import { TodoUpdate } from '../models/TodoUpdate';

// TODO: Implement businessLogic
const logger = createLogger('Todos Logger');

const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpire = process.env.SIGNED_URL_EXPIRATION

const todoAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();

export async function getAllTodos(userId:string): Promise<TodoItem[]> {
    return todoAccess.getAllTodos(userId);
}

export async function createTodo(userId:string, createTodoRequest:CreateTodoRequest): Promise<TodoItem> {
    const itemId = uuid.v4();

    return await todoAccess.createTodo({
        todoId: itemId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        createdAt: new Date().toISOString(),
        done: false
    });
}

export async function deleteTodo(todoId:string, userId:string) {
    await todoAccess.deleteTodo(todoId, userId);
}

export async function updateTodo(todoId:string, userId:string, updateTodoRequest:UpdateTodoRequest): Promise<TodoUpdate> {
    return await todoAccess.updateTodo(todoId, userId, {
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done
    });
}

function getUploadUrl(imageId: string) {
    logger.info('Get upload URL - UrlExpiration', urlExpire);
    
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: Number(urlExpire)
    })
}

export async function createAttachmentPresignedUrl(todoId:string, userId:string) {
    logger.info('Create attachment presigned url ');
    const imageId = uuid.v4();
    const url = `https://${bucketName}.s3.amazonaws.com/${imageId}`;
    await attachmentUtils.updateAttachmentUrl(todoId, userId, url);
    return getUploadUrl(imageId);
} 