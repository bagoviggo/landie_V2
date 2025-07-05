// API route for MaintenanceRequest CRUD operations

import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/lib/db';
import { MaintenanceRequest } from '@/app/models/types';
import type { MaintenanceRequestRow } from '@/app/models/types';

export async function GET(req: NextRequest) {
  // List all maintenance requests
  try {
    const requests = await sql<MaintenanceRequestRow[]>`
      SELECT request_id AS "requestId", property_id AS "propertyId", tenant_id AS "tenantId", description, status, created_at AS "createdAt", updated_at AS "updatedAt" FROM maintenance_requests`;
    const result: MaintenanceRequest[] = requests.map(r => ({
      requestId: r.requestId,
      propertyId: r.propertyId,
      tenantId: r.tenantId,
      description: r.description,
      status: r.status as 'pending' | 'completed',
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt)
    }));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch maintenance requests', details: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Create new maintenance request
  try {
    const body = await req.json();
    const { propertyId, tenantId, description, status } = body;
    if (!propertyId || !tenantId || !description || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const [row] = await sql<MaintenanceRequestRow[]>`
      INSERT INTO maintenance_requests (
        property_id, tenant_id, description, status, created_at, updated_at
      ) VALUES (
        ${propertyId}, ${tenantId}, ${description}, ${status}, NOW(), NOW()
      ) RETURNING request_id AS "requestId", property_id AS "propertyId", tenant_id AS "tenantId", description, status, created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    const created: MaintenanceRequest = {
      requestId: row.requestId,
      propertyId: row.propertyId,
      tenantId: row.tenantId,
      description: row.description,
      status: row.status as 'pending' | 'completed',
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create maintenance request', details: String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // Update maintenance request
  try {
    const body = await req.json();
    const { requestId, description, status } = body;
    if (!requestId) {
      return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });
    }
    const [row] = await sql<MaintenanceRequestRow[]>`
      UPDATE maintenance_requests SET
        description = COALESCE(${description}, description),
        status = COALESCE(${status}, status),
        updated_at = NOW()
      WHERE request_id = ${requestId}
      RETURNING request_id AS "requestId", property_id AS "propertyId", tenant_id AS "tenantId", description, status, created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    if (!row) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    const updated: MaintenanceRequest = {
      requestId: row.requestId,
      propertyId: row.propertyId,
      tenantId: row.tenantId,
      description: row.description,
      status: row.status as 'pending' | 'completed',
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update maintenance request', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  // Delete maintenance request
  try {
    const body = await req.json();
    const { requestId } = body;
    if (!requestId) {
      return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });
    }
    await sql`DELETE FROM maintenance_requests WHERE request_id = ${requestId}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete maintenance request', details: String(error) }, { status: 500 });
  }
}
