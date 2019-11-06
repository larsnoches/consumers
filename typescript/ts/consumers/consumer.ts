enum ConsumerKind {
    Person = 1,
    Organisation = 2
}

interface Consumer {
    id?: number;
    name: string;
    kind: ConsumerKind;
    num: string;
}

export { ConsumerKind, Consumer };