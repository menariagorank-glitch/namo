import { IEnquiryInput } from '../../../../types/enquiry.types.js';

export class WhatsAppMessageFormatter {
  /**
   * Formats a raw enquiry input into a clean, curated WhatsApp message.
   * Deterministic, concise, phone-optimized, and free of database/internal IDs.
   */
  public static format(input: IEnquiryInput): string {
    const name = (input.name || 'Guest').trim();
    const phone = (input.phone || 'N/A').trim();
    const email = (input.email || 'N/A').trim();

    const checkIn = (input.checkIn || 'N/A').trim();
    const checkOut = (input.checkOut || 'N/A').trim();
    const guests = input.guests ? `${input.guests} Guest${input.guests > 1 ? 's' : ''}` : 'N/A';
    const roomOrProperty = (input.hotel || input.destination || 'NAMO Property').trim();

    const message = (input.message || 'N/A').trim();
    const source = (input.source || 'Hotel Website').trim();

    return [
      '🏨 NEW HOTEL ENQUIRY',
      '',
      'Guest Details',
      '━━━━━━━━━━━━━━━━━━',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      '',
      'Stay Details',
      '━━━━━━━━━━━━━━━━━━',
      `Check-in: ${checkIn}`,
      `Check-out: ${checkOut}`,
      `Guests: ${guests}`,
      `Room / Property: ${roomOrProperty}`,
      '',
      'Enquiry',
      '━━━━━━━━━━━━━━━━━━',
      message,
      '',
      '━━━━━━━━━━━━━━━━━━',
      `Source: ${source}`,
    ].join('\n');
  }
}

