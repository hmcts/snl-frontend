
export function getLocalStorage(): Storage {
    return (typeof window !== 'undefined') ? localStorage : null;
}

