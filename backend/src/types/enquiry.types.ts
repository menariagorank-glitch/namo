export type WhatsAppStatus = 'pending' | 'sent' | 'failed' | 'not_configured';

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface TravelDetails {
  destination?: string;
  hotel?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export interface IEnquiryInput {
  name: string;
  phone: string;
  email: string;
  destination?: string;
  hotel?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  interests?: string[];
  message: string;
  source?: string;
  page?: string;
}

export interface IEnquiryResult {
  success: boolean;
  message: string;
  whatsappStatus?: WhatsAppStatus;
  messageId?: string;
}



