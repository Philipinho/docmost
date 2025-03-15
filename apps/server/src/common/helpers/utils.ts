import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { User } from '@docmost/db/types/entity.types';
import { validate as isValidUUID } from 'uuid';
import { UserRole } from './types/permission';
import { PaginationResult } from '@docmost/db/pagination/pagination';

export const envPath = path.resolve(process.cwd(), '..', '..', '.env');

export async function hashPassword(password: string) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswordHash(
  plainPassword: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, passwordHash);
}

export type RedisConfig = {
  host: string;
  port: number;
  db: number;
  password?: string;
  family?: number;
};

export function parseRedisUrl(redisUrl: string): RedisConfig {
  // format - redis[s]://[[username][:password]@][host][:port][/db-number][?family=4|6]
  const url = new URL(redisUrl);
  const { hostname, port, password, pathname, searchParams } = url;
  const portInt = parseInt(port, 10);

  let db: number = 0;
  // extract db value if present
  if (pathname.length > 1) {
    const value = pathname.slice(1);
    if (!isNaN(parseInt(value))) {
      db = parseInt(value, 10);
    }
  }

  // extract family from query parameters
  let family: number | undefined;
  const familyParam = searchParams.get('family');
  if (familyParam && !isNaN(parseInt(familyParam))) {
    family = parseInt(familyParam, 10);
  }

  return { host: hostname, port: portInt, password, db, family };
}

export function createRetryStrategy() {
  return function (times: number): number {
    return Math.max(Math.min(Math.exp(times), 20000), 3000);
  };
}

export function extractDateFromUuid7(uuid7: string) {
  //https://park.is/blog_posts/20240803_extracting_timestamp_from_uuid_v7/
  const parts = uuid7.split('-');
  const highBitsHex = parts[0] + parts[1].slice(0, 4);
  const timestamp = parseInt(highBitsHex, 16);

  return new Date(timestamp);
}

export function extractPageSlugId(slug: string): string {
  if (!slug) {
    return undefined;
  }
  if (isValidUUID(slug)) {
    return slug;
  }
  const parts = slug.split("-");
  return parts.length > 1 ? parts[parts.length - 1] : slug;
}

export const anonymous: User = {
  id: 'anonymous',
  name: 'Anonymous',
  role: UserRole.GUEST,
  avatarUrl: '',
  email: '',
  invitedById: '',
  locale: '',
  password: '',
  settings: '',
  timezone: '',
  workspaceId: '',
  createdAt: undefined,
  deactivatedAt: undefined,
  deletedAt: undefined,
  emailVerifiedAt: undefined,
  lastActiveAt: undefined,
  lastLoginAt: undefined,
  updatedAt: undefined
}

export const emptyPaginationResult: PaginationResult<any> = {
  items: [],
  meta: { limit: 1, page: 1, hasNextPage: false, hasPrevPage: false }
}