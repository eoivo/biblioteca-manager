import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';

class LoginDto {
  @ApiProperty({
    example: 'admin@biblioteca.com',
    description: 'Email ou CPF do usuário',
  })
  identifier: string;

  @ApiProperty({ example: 'admin123', description: 'Senha do usuário' })
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login do usuário',
    description: 'Autentica usuário e retorna token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(
      body.identifier,
      body.password,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.authService.login(user);
  }
}
