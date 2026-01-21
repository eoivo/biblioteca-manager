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
 */
export function isValidCpf(cpf: string): boolean {
    const cleanCpf = sanitizeCpf(cpf);

    if (cleanCpf.length !== 11) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(cleanCpf)) {
        return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(10))) return false;

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

/**
 * Formata telefone para exibição
 */
export function formatTelefone(telefone: string): string {
    const clean = telefone.replace(/\D/g, '');
    if (clean.length === 11) {
        return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (clean.length === 10) {
        return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
}
