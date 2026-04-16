/** 1枚のQR画像ファイルの最大サイズ（バイト） */
export const MAX_QR_IMAGE_FILE_BYTES = 5 * 1024 * 1024;

/** 1回のQR画像インポートで処理する最大枚数 */
export const MAX_QR_IMAGE_FILES_PER_BATCH = 40;

/** QRデコード用 canvas の最大辺（ピクセル）。これを超える画像は縮小してから解析する */
export const MAX_QR_DECODE_EDGE_PX = 2048;

/** バックアップファイル（テキスト）の最大サイズ（バイト） */
export const MAX_BACKUP_IMPORT_FILE_BYTES = 10 * 1024 * 1024;

/** バックアップテキスト貼り付けの最大文字数 */
export const MAX_BACKUP_IMPORT_TEXT_CHARS = 2 * 1024 * 1024;

/** otpauth 行インポートの最大行数（DoS防止） */
export const MAX_OTPAUTH_IMPORT_LINES = 10_000;
