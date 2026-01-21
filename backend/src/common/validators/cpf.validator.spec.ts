import { isValidCpf, sanitizeCpf, formatCpf } from './cpf.validator';

describe('CPF Validator', () => {
    describe('sanitizeCpf', () => {
        it('deve remover pontos e traço do CPF', () => {
            expect(sanitizeCpf('123.456.789-09')).toBe('12345678909');
        });

        it('deve manter apenas dígitos', () => {
            expect(sanitizeCpf('123-456-789-09')).toBe('12345678909');
        });

        it('deve retornar string vazia para CPF vazio', () => {
            expect(sanitizeCpf('')).toBe('');
        });
    });

    describe('isValidCpf', () => {
        // CPFs válidos para teste
        const cpfsValidos = [
            '12345678909',
            '529.982.247-25',
            '52998224725',
            '111.444.777-35',
        ];

        // CPFs inválidos
        const cpfsInvalidos = [
            '11111111111',  // todos iguais
            '00000000000',  // todos zeros
            '12345678900',  // dígito verificador errado
            '12345678',     // incompleto
            '123456789012', // muito longo
            '',             // vazio
        ];

        cpfsValidos.forEach((cpf) => {
            it(`deve aceitar CPF válido: ${cpf}`, () => {
                expect(isValidCpf(cpf)).toBe(true);
            });
        });

        cpfsInvalidos.forEach((cpf) => {
            it(`deve rejeitar CPF inválido: ${cpf}`, () => {
                expect(isValidCpf(cpf)).toBe(false);
            });
        });

        it('deve rejeitar CPF com todos dígitos iguais (22222222222)', () => {
            expect(isValidCpf('22222222222')).toBe(false);
        });

        it('deve aceitar CPF com formatação', () => {
            expect(isValidCpf('529.982.247-25')).toBe(true);
        });
    });

    describe('formatCpf', () => {
        it('deve formatar CPF corretamente', () => {
            expect(formatCpf('12345678909')).toBe('123.456.789-09');
        });

        it('deve retornar CPF original se tamanho inválido', () => {
            expect(formatCpf('123')).toBe('123');
        });

        it('deve formatar CPF já com formatação', () => {
            expect(formatCpf('123.456.789-09')).toBe('123.456.789-09');
        });
    });
});
