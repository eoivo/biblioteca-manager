import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Verifica se a API está rodando',
  })
  @ApiResponse({
    status: 200,
    description: 'API está online',
    schema: { example: 'BiblioManager API is running!' },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
