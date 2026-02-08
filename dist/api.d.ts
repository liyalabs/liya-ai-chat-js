import { LiyaChatConfig, SendMessageResponse, SessionHistoryResponse, Session, FileAttachment } from './types';

export declare function initializeApi(cfg: LiyaChatConfig): void;
export declare function getConfig(): LiyaChatConfig;
export declare function sendMessage(message: string, sessionId?: string, fileIds?: string[]): Promise<SendMessageResponse>;
export declare function getSessionHistory(sessionId: string): Promise<SessionHistoryResponse>;
export declare function createSession(sessionName?: string): Promise<Session>;
export declare function uploadFile(sessionId: string, file: File): Promise<FileAttachment>;
