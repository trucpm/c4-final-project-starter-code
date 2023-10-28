import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    // TODO: Implement creating a new TODO item
    let userId = getUserId(event);
    const {todoId, name, dueDate, createdAt, done} = await createTodo(userId, newTodo);
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: {todoId, name, dueDate, createdAt, done}
      })
    };
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
