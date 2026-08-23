export type PayrollRow = {
  recipient: string;
  amount: bigint;
  vestingId?: bigint;
  cliffTs?: bigint;
  endTs?: bigint;
  sessionKeyId?: bigint;
  secret?: bigint;
};

export type RunMode = "execute" | "simulate";
