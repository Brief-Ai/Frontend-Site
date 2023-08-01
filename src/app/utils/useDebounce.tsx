export default function debounce<F extends (...args: any[]) => any>(func: F, delay: number) {
    let debounceTimer: NodeJS.Timeout | null = null;

    return (...args: Parameters<F>) => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => func(...args), delay);
    };
}