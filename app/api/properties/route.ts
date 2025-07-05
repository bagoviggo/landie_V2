// API route for Property CRUD operations

import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/lib/db';

import { Property } from '@/app/models/types';

// Type for flat SQL result
type PropertyRow = {
  propertyId: string;
  title: string;
  description: string;
  "location.address": string;
  "location.latitude": number;
  "location.longitude": number;
  price: number;
  type: string;
  size: number;
  amenities: string;
  images: string;
  createdAt: string;
  updatedAt: string;
};

export async function GET(req: NextRequest) {
  // List all properties
  try {
    const properties = await sql<PropertyRow[]>`
      SELECT property_id AS "propertyId", title, description, 
        location_address AS "location.address", location_latitude AS "location.latitude", location_longitude AS "location.longitude",
        price, type, size, amenities, images, created_at AS "createdAt", updated_at AS "updatedAt"
      FROM properties`;
    const result: Property[] = properties.map(p => ({
      propertyId: p.propertyId,
      title: p.title,
      description: p.description,
      location: {
        address: p["location.address"],
        latitude: p["location.latitude"],
        longitude: p["location.longitude"]
      },
      price: p.price,
      type: p.type,
      size: p.size,
      amenities: p.amenities ? JSON.parse(p.amenities) : [],
      images: p.images ? JSON.parse(p.images) : [],
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt)
    }));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties', details: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Create new property
  try {
    const body = await req.json();
    const { title, description, location, price, type, size, amenities, images } = body;
    if (!title || !location || !location.address || !location.latitude || !location.longitude || !price || !type || !size) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const [propertyRow] = await sql<PropertyRow[]>`
      INSERT INTO properties (
        title, description, location_address, location_latitude, location_longitude,
        price, type, size, amenities, images, created_at, updated_at
      ) VALUES (
        ${title}, ${description || ''}, ${location.address}, ${location.latitude}, ${location.longitude},
        ${price}, ${type}, ${size}, ${JSON.stringify(amenities || [])}, ${JSON.stringify(images || [])}, NOW(), NOW()
      ) RETURNING 
        property_id AS "propertyId", title, description, 
        location_address AS "location.address", location_latitude AS "location.latitude", location_longitude AS "location.longitude",
        price, type, size, amenities, images, created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    const created: Property = {
      propertyId: propertyRow.propertyId,
      title: propertyRow.title,
      description: propertyRow.description,
      location: {
        address: propertyRow["location.address"],
        latitude: propertyRow["location.latitude"],
        longitude: propertyRow["location.longitude"]
      },
      price: propertyRow.price,
      type: propertyRow.type,
      size: propertyRow.size,
      amenities: propertyRow.amenities ? JSON.parse(propertyRow.amenities) : [],
      images: propertyRow.images ? JSON.parse(propertyRow.images) : [],
      createdAt: new Date(propertyRow.createdAt),
      updatedAt: new Date(propertyRow.updatedAt)
    };
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create property', details: String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // Update property
  try {
    const body = await req.json();
    const { propertyId, title, description, location, price, type, size, amenities, images } = body;
    if (!propertyId) {
      return NextResponse.json({ error: 'Missing propertyId' }, { status: 400 });
    }
    const [propertyRow] = await sql<PropertyRow[]>`
      UPDATE properties SET
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        location_address = COALESCE(${location?.address}, location_address),
        location_latitude = COALESCE(${location?.latitude}, location_latitude),
        location_longitude = COALESCE(${location?.longitude}, location_longitude),
        price = COALESCE(${price}, price),
        type = COALESCE(${type}, type),
        size = COALESCE(${size}, size),
        amenities = COALESCE(${amenities ? JSON.stringify(amenities) : null}, amenities),
        images = COALESCE(${images ? JSON.stringify(images) : null}, images),
        updated_at = NOW()
      WHERE property_id = ${propertyId}
      RETURNING 
        property_id AS "propertyId", title, description, 
        location_address AS "location.address", location_latitude AS "location.latitude", location_longitude AS "location.longitude",
        price, type, size, amenities, images, created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    if (!propertyRow) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    const updated: Property = {
      propertyId: propertyRow.propertyId,
      title: propertyRow.title,
      description: propertyRow.description,
      location: {
        address: propertyRow["location.address"],
        latitude: propertyRow["location.latitude"],
        longitude: propertyRow["location.longitude"]
      },
      price: propertyRow.price,
      type: propertyRow.type,
      size: propertyRow.size,
      amenities: propertyRow.amenities ? JSON.parse(propertyRow.amenities) : [],
      images: propertyRow.images ? JSON.parse(propertyRow.images) : [],
      createdAt: new Date(propertyRow.createdAt),
      updatedAt: new Date(propertyRow.updatedAt)
    };
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update property', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  // Delete property
  try {
    const body = await req.json();
    const { propertyId } = body;
    if (!propertyId) {
      return NextResponse.json({ error: 'Missing propertyId' }, { status: 400 });
    }
    await sql`DELETE FROM properties WHERE property_id = ${propertyId}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete property', details: String(error) }, { status: 500 });
  }
}
