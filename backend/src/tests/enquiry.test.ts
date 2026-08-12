import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../server.js';
import { WhatsAppMessageFormatter } from '../services/notifications/providers/whatsapp/whatsapp-message.formatter.js';
import { WhatsAppService } from '../services/whatsapp/whatsapp.service.js';

const app = createApp();

describe('NAMO Hotel Backend Stateless API Test Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/v1/health', () => {
    it('should return health status 200 with service metadata', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.service).toBe('namo-hotel-backend');
      expect(response.body.data.status).toBe('ok');
    });
  });

  describe('WhatsApp Message Formatter', () => {
    it('should format curated enquiry message correctly according to specification', () => {
      const formatted = WhatsAppMessageFormatter.format({
        name: 'Rahul Sharma',
        phone: '+919876543210',
        email: 'guest@example.com',
        hotel: 'Deluxe Room',
        checkIn: '2026-08-20',
        checkOut: '2026-08-23',
        guests: 2,
        message: 'Airport pickup required.',
        source: 'Hotel Website',
      });

      expect(formatted).toContain('🏨 NEW HOTEL ENQUIRY');
      expect(formatted).toContain('Name: Rahul Sharma');
      expect(formatted).toContain('Phone: +919876543210');
      expect(formatted).toContain('Email: guest@example.com');
      expect(formatted).toContain('Check-in: 2026-08-20');
      expect(formatted).toContain('Check-out: 2026-08-23');
      expect(formatted).toContain('Guests: 2 Guests');
      expect(formatted).toContain('Room / Property: Deluxe Room');
      expect(formatted).toContain('Airport pickup required.');
      expect(formatted).toContain('Source: Hotel Website');
    });
  });

  describe('POST /api/enquiry Stateless Endpoint', () => {
    it('should reject enquiry with missing name', async () => {
      const response = await request(app).post('/api/enquiry').send({
        phone: '+919876543210',
        email: 'guest@example.com',
        message: 'Airport pickup required.',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject enquiry with invalid email format', async () => {
      const response = await request(app).post('/api/enquiry').send({
        name: 'Rahul Sharma',
        phone: '+919876543210',
        email: 'invalid-email-string',
        message: 'Airport pickup required.',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject enquiry when check-out is before check-in', async () => {
      const response = await request(app).post('/api/enquiry').send({
        name: 'Rahul Sharma',
        phone: '+919876543210',
        email: 'guest@example.com',
        checkIn: '2026-08-25',
        checkOut: '2026-08-20',
        message: 'Invalid dates request',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should process valid enquiry and return 200 with success message', async () => {
      vi.spyOn(WhatsAppService, 'sendNotification').mockResolvedValue({
        status: 'sent',
        messageId: 'test_msg_id_123',
      });

      const response = await request(app).post('/api/enquiry').send({
        name: 'Rahul Sharma',
        phone: '+919876543210',
        email: 'guest@example.com',
        hotel: 'Pushkar Dhani',
        checkIn: '2026-08-20',
        checkOut: '2026-08-23',
        guests: 2,
        message: 'Airport pickup required.',
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Your enquiry has been sent successfully. Our team will contact you shortly.');
    });
  });
});

