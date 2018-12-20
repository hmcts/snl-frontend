export interface IcalendarTransformer<T1, T2> {
    transform(element: T1): T2;
}
