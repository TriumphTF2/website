import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { BanProps } from "./components/bans/BanDetailsCard"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface BanStatus {
  ban: BanProps,
  isBanPermanent: boolean,
  isBanExpired: boolean,
  isBanUnbanned: boolean,
  isBanActive: boolean,
}

export const banStatusToString = (ban: BanStatus) => {
  if (ban.isBanPermanent) {
    return "Indefinite";
  }
  if (ban.isBanExpired) {
    return lengthToHumanReadable(ban.ban.ends - ban.ban.created);
  }
  if (ban.isBanUnbanned) {
    return lengthToHumanReadable(ban.ban.ends - ban.ban.created);
  }
  // not permanent, not expired, not unbanned...
  if (ban.isBanActive) {
    return lengthToHumanReadable(ban.ban.ends - ban.ban.created);
  }
  return "Unknown";
}

export const banStatusToLength = (ban: BanStatus) => {
  if (ban.isBanPermanent) {
    return 0; // permanent
  }
  if (ban.isBanExpired) {
    return -1
  }
  if (ban.isBanUnbanned) {
    return -2;
  }
  if (ban.isBanActive) {
    return ban.ban.ends - ban.ban.created
  }
  return 0;
}

export const banLengthParse = (ban: BanProps) => {
  const isBanPermanent = ban.created === ban.ends;
  const isBanExpired = (!isBanPermanent && ban.ends < Date.now() / 1000 && ban.removeType != 'U') || ban.removeType === 'E';
  const isBanUnbanned = ban.removeType === 'U' || ban.removedBy !== null;
  const isBanActive = !(isBanExpired || isBanUnbanned);
  return {
    ban: ban,
    isBanPermanent: isBanPermanent,
    isBanExpired: isBanExpired,
    isBanUnbanned: isBanUnbanned,
    isBanActive: isBanActive,
  } as BanStatus;
}

export const banProcessExpiration = (ban: BanProps) => {
  if (
    ban.created != ban.ends // not permanent
    && ban.removeType != 'U' // not unbanned
    && ban.ends > Date.now() / 1000 // not expired
  ) return `In about ~${lengthToHumanReadable(ban.ends - (Date.now() / 1000))}`
  if (ban.removeType === 'U') return 'Unbanned';
  if (
    ban.removeType === 'E'
    || (ban.created != ban.ends && ban.ends < Date.now() / 1000)
  ) return 'Expired';
  return 'Never';
  // ban.created != ban.ends && ban.removeType != 'U' && ban.ends > Date.now() / 1000 ? `In about ~${lengthToHumanReadable(ban.ends - (Date.now() / 1000))}` : ban.removeType ===
}



export const lengthToHumanReadable = (length: number) => {
  if (length === 0) {
    return "Permanent";
  }
  // We want to round it to a whole number of the most significant unit, eg: 2 weeks, 1 month, 1 year, etc...
  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "week", seconds: 604800 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
  ];
  for (const unit of units) {
    if (length >= unit.seconds) {
      const value = Math.ceil(length / unit.seconds);
      return `${value} ${unit.name}${value > 1 ? 's' : ''}`;
    }
  }
}

export const steamidConvert64 = (steamid: string) => {
  const baseline = BigInt("76561197960265728");
  const splitID = steamid.split(":");
  const product = BigInt(splitID[2]) * BigInt(2);
  const sum = product + baseline;
  return (sum + BigInt(splitID[1])).toString();
}
export const steamidConvert32 = (steamid: string) => {
  const z = (BigInt(steamid) - BigInt("76561197960265728")) / BigInt(2);
  const y = BigInt(steamid) % BigInt(2);
  return `STEAM_0:${y.toString()}:${z.toString()}`;
}
