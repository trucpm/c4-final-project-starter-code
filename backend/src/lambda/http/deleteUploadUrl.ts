import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import { deleteAttachmentPresignedUrl } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    let userId = getUserId(event);
    await deleteAttachmentPresignedUrl(todoId, userId);

    return {
      statusCode: 201,
      body: JSON.stringify({})
    };
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      origin: "*",
      credentials: true
    })
  )
