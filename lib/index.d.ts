export declare const name = "bat";
export declare const inject: {
    required: string[];
    optional: any[];
};
declare module 'koishi' {
    interface Tables {
        p_system: p_system;
    }
    interface Tables {
        p_graze: p_graze;
    }
}
export interface p_system {
    id: number;
    userid: string;
    usersname: string;
    p: number;
    time: Date;
}
export interface p_graze {
    id: number;
    channelid: string;
    bullet: number;
    p: number;
    users: string;
}
export declare function apply(ctx: any): Promise<void>;
