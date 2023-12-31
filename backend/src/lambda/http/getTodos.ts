import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils';
import { getAllTodos } from '../../businessLogic/todos'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    let userId = getUserId(event);
    const todos = await getAllTodos(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    };
  }
);

handler.use(
  cors({
    origin: "*",
    credentials: true
  })
)
