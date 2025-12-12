// biome-ignore lint/suspicious/noExplicitAny:
export type EventListener<T = any> = (data: T) => void;
