// API route for Review CRUD operations

import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/lib/db';
import { Review } from '@/app/models/types';

export async function GET(req: NextRequest) {
  // List all reviews
  try {
    const reviews = await sql<Review[]>`SELECT review_id AS "reviewId", property_id AS "propertyId", user_id AS "userId", rating, comment, created_at AS "createdAt" FROM reviews`;
    return NextResponse.json(reviews);
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
    const [review] = await sql<Review[]>`
      INSERT INTO reviews (property_id, user_id, rating, comment, created_at)
      VALUES (${propertyId}, ${userId}, ${rating}, ${comment || ''}, NOW())
      RETURNING review_id AS "reviewId", property_id AS "propertyId", user_id AS "userId", rating, comment, created_at AS "createdAt"
    `;
    return NextResponse.json(review, { status: 201 });
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
    const [review] = await sql<Review[]>`
      UPDATE reviews SET
        rating = COALESCE(${rating}, rating),
        comment = COALESCE(${comment}, comment)
      WHERE review_id = ${reviewId}
      RETURNING review_id AS "reviewId", property_id AS "propertyId", user_id AS "userId", rating, comment, created_at AS "createdAt"
    `;
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json(review);
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
