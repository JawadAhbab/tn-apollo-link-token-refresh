import { Func } from 'tn-typescript';
export declare type RefreshFunc = (props: RefreshProps) => void;
interface RefreshProps {
    onSuccess?: Func;
    onError?: Func;
    onFinally?: Func;
}
export interface TokenRefreshOptions {
    safety?: number;
    getAccessToken: () => string;
    beforeRefresh?: () => void;
    refresh: RefreshFunc;
}
export {};
