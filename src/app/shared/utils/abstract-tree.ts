export abstract class AbstractTree<T>  {
    children?: AbstractTree<T>[];
    checked?: boolean;
    disabled?: boolean;
    selected?: boolean;
    abstract getId(): number;
    abstract getParentId(): number;
    abstract getText(): string;
}



export type Table<T> = {
    [P in keyof T]?: T[P];
};
