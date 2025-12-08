import { api } from '@/api/axiosInstance';

interface ConfirmationEmailPayload {
  orderId: string;
  customerEmail: string;
  adminEmail: string;
  orderDetails: {
    fabric: { type: string; color: string };
    garment: string;
    design: { neckDesign: string; embroidery: string; painting: string };
    measurements: Record<string, number>;
    unit: string;
    customerInfo: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
  };
}

interface AcceptanceEmailPayload {
  orderId: string;
  customerEmail: string;
  amount: number;
  summary: string;
}

type EmailPayload = ConfirmationEmailPayload | AcceptanceEmailPayload;

export async function sendConfirmationEmail(tenant: string, payload: ConfirmationEmailPayload): Promise<void> {
  await api.post(`/${tenant}/orders/send-confirmation-email`, payload);
}

export async function sendAcceptanceEmail(tenant: string, payload: AcceptanceEmailPayload): Promise<void> {
  await api.post(`/${tenant}/orders/send-acceptance-email`, payload);
}

export async function sendEmail(tenant: string, type: 'confirmation' | 'acceptance', payload: EmailPayload): Promise<void> {
  if (type === 'confirmation') {
    await sendConfirmationEmail(tenant, payload as ConfirmationEmailPayload);
  } else {
    await sendAcceptanceEmail(tenant, payload as AcceptanceEmailPayload);
  }
}
