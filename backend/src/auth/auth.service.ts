import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usuariosService: UsuariosService,
        private jwtService: JwtService
    ) { }

    async validateUser(identifier: string, pass: string): Promise<any> {
        const user = await this.usuariosService.findByEmailOrUsername(identifier);
        if (user && await bcrypt.compare(pass, user.senha)) {
            const { senha, ...result } = user.toObject();
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = {
            username: user.username,
            sub: user._id,
            nome: user.nome,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: payload
        };
    }
}
