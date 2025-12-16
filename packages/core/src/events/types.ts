// biome-ignore lint/suspicious/noExplicitAny: describes a generalized type without tsc errors
export type EventListener<T = any> = (data: T) => void;
