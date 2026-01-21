/**
 * Validador de CPF conforme algoritmo oficial brasileiro
 * RN001: CPF deve ser válido conforme algoritmo oficial
 */

/**
 * Remove caracteres não numéricos do CPF
 */
export function sanitizeCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
}

/**
 * Valida se o CPF é válido conforme algoritmo oficial
 * @param cpf - CPF com ou sem formatação
 * @returns true se o CPF é válido
 */
export function isValidCpf(cpf: string): boolean {
    const cleanCpf = sanitizeCpf(cpf);

    // Deve ter exatamente 11 dígitos
    if (cleanCpf.length !== 11) {
        return false;
    }

    // Não pode ter todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cleanCpf)) {
        return false;
    }

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    if (remainder !== parseInt(cleanCpf.charAt(9))) {
        return false;
    }

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    if (remainder !== parseInt(cleanCpf.charAt(10))) {
        return false;
    }

    return true;
}

/**
 * Formata CPF para exibição: 000.000.000-00
 */
export function formatCpf(cpf: string): string {
    const cleanCpf = sanitizeCpf(cpf);
    if (cleanCpf.length !== 11) return cpf;
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
