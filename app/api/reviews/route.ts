// API route for Review CRUD operations


import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/lib/db';
import { Review } from '@/app/models/types';
import type { ReviewRow } from '@/app/models/types';

export async function GET(req: NextRequest) {
  // List all reviews
  try {
    const reviews = await sql<ReviewRow[]>`
      SELECT review_id AS "reviewId", property_id AS "propertyId", user_id AS "userId", rating, comment, created_at AS "createdAt" FROM reviews`;
    const result: Review[] = reviews.map(r => ({
      reviewId: r.reviewId,
      propertyId: r.propertyId,
      userId: r.userId,
      rating: r.rating,
      comment: r.comment,
      createdAt: new Date(r.createdAt)
    }));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews', details: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Create new review
  try {
    const body = await req.json();
    const { propertyId, userId, rating, comment } = body;
    if (!propertyId || !userId || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const [row] = await sql<ReviewRow[]>`
      INSERT INTO reviews (property_id, user_id, rating, comment, created_at)
      VALUES (${propertyId}, ${userId}, ${rating}, ${comment || ''}, NOW())
      RETURNING review_id AS "reviewId", property_id AS "propertyId", user_id AS "userId", rating, comment, created_at AS "createdAt"
    `;
    const created: Review = {
      reviewId: row.reviewId,
      propertyId: row.propertyId,
      userId: row.userId,
      rating: row.rating,
      comment: row.comment,
      createdAt: new Date(row.createdAt)
    };
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review', details: String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // Update review
  try {
    const body = await req.json();
    const { reviewId, rating, comment } = body;
    if (!reviewId) {
      return NextResponse.json({ error: 'Missing reviewId' }, { status: 400 });
    }
    const [row] = await sql<ReviewRow[]>`
      UPDATE reviews SET
        rating = COALESCE(${rating}, rating),
        comment = COALESCE(${comment}, comment)
      WHERE review_id = ${reviewId}
      RETURNING review_id AS "reviewId", property_id AS "propertyId", user_id AS "userId", rating, comment, created_at AS "createdAt"
    `;
    if (!row) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    const updated: Review = {
      reviewId: row.reviewId,
      propertyId: row.propertyId,
      userId: row.userId,
      rating: row.rating,
      comment: row.comment,
      createdAt: new Date(row.createdAt)
    };
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  // Delete review
  try {
    const body = await req.json();
    const { reviewId } = body;
    if (!reviewId) {
      return NextResponse.json({ error: 'Missing reviewId' }, { status: 400 });
    }
    await sql`DELETE FROM reviews WHERE review_id = ${reviewId}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review', details: String(error) }, { status: 500 });
  }
}
