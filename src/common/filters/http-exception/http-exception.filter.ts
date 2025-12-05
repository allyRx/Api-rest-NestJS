import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException > implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
  
    let errorMessage = 
      (typeof exceptionResponse === 'string') 
        ? {message: exceptionResponse}
        : (exceptionResponse as object);

    response.status(status).json({
        ...errorMessage,
        timestamp: new Date().toISOString()
      });
  }
}
/**
 * Custom HTTP Exception Filter to handle HttpExceptions globally.
 * Catches HttpExceptions and formats the response with additional details.
 */