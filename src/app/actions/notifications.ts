'use server';

/**
 * Server action to send order notifications to Discord.
 * Keeps the webhook URL server-side.
 */
export async function sendOrderToDiscord(orderData: {
  id: string;
  productName: string;
  quantity: string;
  totalAmount: number;
  customerName: string;
  customerPhoneNumber: string;
  customerEmail: string;
  customerAddress: string;
  notes?: string;
}) {
  const webhookUrl = 'https://discord.com/api/webhooks/1481672886216556626/vTvWqGzBaZdlk-t5B71J45LkAZMZiXv4BDdU607Coi9_srkK2ZecWgpPnZ7lSI7C6Lly';
  
  const embed = {
    title: '🎮 New Order Alert!',
    description: `A new order has been placed for **${orderData.productName}**.`,
    color: 0x1a80e6, // Castro Blue
    fields: [
      { name: 'Order ID', value: `\`${orderData.id}\``, inline: true },
      { name: 'Quantity', value: orderData.quantity, inline: true },
      { name: 'Total Price', value: `Rs. ${Math.round(orderData.totalAmount).toLocaleString()}`, inline: true },
      { name: 'Customer', value: orderData.customerName, inline: true },
      { name: 'Phone', value: orderData.customerPhoneNumber, inline: true },
      { name: 'Email', value: orderData.customerEmail, inline: true },
      { name: 'Address', value: orderData.customerAddress },
      { name: 'Notes', value: orderData.notes || 'None' },
    ],
    footer: {
      text: 'Castro Nepal Admin Notification System',
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content: `📦 **New Order Received!** (ID: ${orderData.id})`,
        embeds: [embed] 
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to send Discord webhook:', error);
    return false;
  }
}
