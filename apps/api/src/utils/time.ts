export const toUnixSeconds = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

export const toClickHouseDateTime64 = (date: Date) => {
  return date.toISOString().replace("T", " ").replace("Z", "");
};
