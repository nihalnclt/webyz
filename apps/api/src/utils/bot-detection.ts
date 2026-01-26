const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /crawling/i,
  /facebook/i,
  /google/i,
  /baidu/i,
  /bing/i,
  /yahoo/i,
  /yandex/i,
  /duckduckgo/i,
  /slurp/i,
  /wget/i,
  /curl/i,
];

export const isBot = (userAgent: string): boolean => {
  if (!userAgent) return false;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
};
