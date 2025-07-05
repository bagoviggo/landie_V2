// API route for Lease CRUD operations

import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/lib/db';
import { Lease } from '@/app/models/types';
import type { LeaseRow } from '@/app/models/types';


export async function GET(req: NextRequest) {
  // List all leases
  try {
    const leases = await sql<LeaseRow[]>`
      SELECT lease_id AS "leaseId", property_id AS "propertyId", tenant_id AS "tenantId", start_date AS "startDate", end_date AS "endDate", monthly_rent AS "monthlyRent", payment_frequency AS "paymentFrequency", created_at AS "createdAt", updated_at AS "updatedAt" FROM leases`;
    const result: Lease[] = leases.map(l => ({
      leaseId: l.leaseId,
      propertyId: l.propertyId,
      tenantId: l.tenantId,
      startDate: new Date(l.startDate),
      endDate: new Date(l.endDate),
      monthlyRent: l.monthlyRent,
      paymentFrequency: l.paymentFrequency,
      createdAt: new Date(l.createdAt),
      updatedAt: new Date(l.updatedAt)
    }));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leases', details: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Create new lease
  try {
    const body = await req.json();
    const { propertyId, tenantId, startDate, endDate, monthlyRent, paymentFrequency } = body;
    if (!propertyId || !tenantId || !startDate || !endDate || !monthlyRent || !paymentFrequency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const [leaseRow] = await sql<LeaseRow[]>`
      INSERT INTO leases (
        property_id, tenant_id, start_date, end_date, monthly_rent, payment_frequency, created_at, updated_at
      ) VALUES (
        ${propertyId}, ${tenantId}, ${startDate}, ${endDate}, ${monthlyRent}, ${paymentFrequency}, NOW(), NOW()
      ) RETURNING lease_id AS "leaseId", property_id AS "propertyId", tenant_id AS "tenantId", start_date AS "startDate", end_date AS "endDate", monthly_rent AS "monthlyRent", payment_frequency AS "paymentFrequency", created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    const created: Lease = {
      leaseId: leaseRow.leaseId,
      propertyId: leaseRow.propertyId,
      tenantId: leaseRow.tenantId,
      startDate: new Date(leaseRow.startDate),
      endDate: new Date(leaseRow.endDate),
      monthlyRent: leaseRow.monthlyRent,
      paymentFrequency: leaseRow.paymentFrequency,
      createdAt: new Date(leaseRow.createdAt),
      updatedAt: new Date(leaseRow.updatedAt)
    };
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lease', details: String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // Update lease
  try {
    const body = await req.json();
    const { leaseId, propertyId, tenantId, startDate, endDate, monthlyRent, paymentFrequency } = body;
    if (!leaseId) {
      return NextResponse.json({ error: 'Missing leaseId' }, { status: 400 });
    }
    const [leaseRow] = await sql<LeaseRow[]>`
      UPDATE leases SET
        property_id = COALESCE(${propertyId}, property_id),
        tenant_id = COALESCE(${tenantId}, tenant_id),
        start_date = COALESCE(${startDate}, start_date),
        end_date = COALESCE(${endDate}, end_date),
        monthly_rent = COALESCE(${monthlyRent}, monthly_rent),
        payment_frequency = COALESCE(${paymentFrequency}, payment_frequency),
        updated_at = NOW()
      WHERE lease_id = ${leaseId}
      RETURNING lease_id AS "leaseId", property_id AS "propertyId", tenant_id AS "tenantId", start_date AS "startDate", end_date AS "endDate", monthly_rent AS "monthlyRent", payment_frequency AS "paymentFrequency", created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    if (!leaseRow) {
      return NextResponse.json({ error: 'Lease not found' }, { status: 404 });
    }
    const updated: Lease = {
      leaseId: leaseRow.leaseId,
      propertyId: leaseRow.propertyId,
      tenantId: leaseRow.tenantId,
      startDate: new Date(leaseRow.startDate),
      endDate: new Date(leaseRow.endDate),
      monthlyRent: leaseRow.monthlyRent,
      paymentFrequency: leaseRow.paymentFrequency,
      createdAt: new Date(leaseRow.createdAt),
      updatedAt: new Date(leaseRow.updatedAt)
    };
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lease', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  // Delete lease
  try {
    const body = await req.json();
    const { leaseId } = body;
    if (!leaseId) {
      return NextResponse.json({ error: 'Missing leaseId' }, { status: 400 });
    }
    await sql`DELETE FROM leases WHERE lease_id = ${leaseId}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lease', details: String(error) }, { status: 500 });
  }
}
