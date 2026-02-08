import { LiyaChatConfig } from './types';
import { LiyaChatWidget } from './widget';

export type { LiyaChatConfig, ThemeConfig, Message, Session } from './types';
export { LiyaChatWidget } from './widget';
export { sendMessage, getSessionHistory, createSession, uploadFile } from './api';
/**
 * Initialize Liya Chat Widget
 * @param config Configuration options
 * @returns LiyaChatWidget instance
 */
export declare function init(config: LiyaChatConfig): LiyaChatWidget;
/**
 * Get current widget instance
 */
export declare function getInstance(): LiyaChatWidget | null;
/**
 * Destroy widget instance
 */
export declare function destroy(): void;
declare const LiyaChat: {
    init: typeof init;
    getInstance: typeof getInstance;
    destroy: typeof destroy;
    LiyaChatWidget: typeof LiyaChatWidget;
};
export default LiyaChat;
