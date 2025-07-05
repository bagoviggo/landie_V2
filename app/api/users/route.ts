// API route for User CRUD operations

import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/lib/db';
import { User } from '@/app/models/types';

export async function GET(req: NextRequest) {
  // List all users
  try {
    const users = await sql<User[]>`SELECT user_id AS "userId", email, password_hash AS "passwordHash", role, created_at AS "createdAt", updated_at AS "updatedAt" FROM users`;
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users', details: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Create new user
  try {
    const body = await req.json();
    const { email, passwordHash, role } = body;
    if (!email || !passwordHash || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const [user] = await sql<User[]>`
      INSERT INTO users (email, password_hash, role, created_at, updated_at)
      VALUES (${email}, ${passwordHash}, ${role}, NOW(), NOW())
      RETURNING user_id AS "userId", email, password_hash AS "passwordHash", role, created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user', details: String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // Update user
  try {
    const body = await req.json();
    const { userId, email, passwordHash, role } = body;
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    const [user] = await sql<User[]>`
      UPDATE users SET
        email = COALESCE(${email}, email),
        password_hash = COALESCE(${passwordHash}, password_hash),
        role = COALESCE(${role}, role),
        updated_at = NOW()
      WHERE user_id = ${userId}
      RETURNING user_id AS "userId", email, password_hash AS "passwordHash", role, created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  // Delete user
  try {
    const body = await req.json();
    const { userId } = body;
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    const result = await sql`DELETE FROM users WHERE user_id = ${userId}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user', details: String(error) }, { status: 500 });
  }
}
