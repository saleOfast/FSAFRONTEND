export interface IApiResponse<T> {
    left_leave(left_leave: any): string | undefined;
    data: T,
    message: string;
    status: number;
}

export interface IGeoCoordinate {
    latitude: number;
    longitude: number;
}

export interface ISelectOption {
    label: string;
    value: string | boolean | number;
    disabled?: boolean;
    mode?: any
}

export interface IPagination {
    pageNumber: number;
    pageSize: number;
}
