import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Logger middleware
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Health check
app.get('/make-server-1ec6f4bd/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create order
app.post('/make-server-1ec6f4bd/orders', async (c) => {
  try {
    const orderData = await c.req.json();
    
    // Validate required fields
    const { name, email, phone } = orderData;
    if (!name || !email || !phone) {
      return c.json({ error: 'Missing required fields: name, email, phone' }, 400);
    }

    // Generate order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create order object
    const order = {
      id: orderId,
      name,
      email,
      phone,
      organization: orderData.organization || '',
      message: orderData.message || '',
      product: 'TennisBot Pro',
      price: 5000,
      currency: 'USD',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store order in database
    await kv.set(`order:${orderId}`, order);
    
    // Store in customer list for easy retrieval
    const customerOrders = await kv.get(`customer:${email}:orders`) || [];
    customerOrders.push(orderId);
    await kv.set(`customer:${email}:orders`, customerOrders);

    // Add to orders index
    const allOrders = await kv.get('orders:all') || [];
    allOrders.push(orderId);
    await kv.set('orders:all', allOrders);

    console.log(`Order created successfully: ${orderId} for ${email}`);
    
    return c.json({ 
      success: true, 
      orderId,
      message: 'Order created successfully. We will contact you within 24 hours.' 
    });
  } catch (error) {
    console.log(`Error creating order: ${error}`);
    return c.json({ error: 'Failed to create order. Please try again.' }, 500);
  }
});

// Get order by ID
app.get('/make-server-1ec6f4bd/orders/:orderId', async (c) => {
  try {
    const orderId = c.req.param('orderId');
    const order = await kv.get(`order:${orderId}`);
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    return c.json({ order });
  } catch (error) {
    console.log(`Error fetching order: ${error}`);
    return c.json({ error: 'Failed to fetch order' }, 500);
  }
});

// Get all orders (admin endpoint)
app.get('/make-server-1ec6f4bd/admin/orders', async (c) => {
  try {
    const allOrderIds = await kv.get('orders:all') || [];
    const orders = [];
    
    for (const orderId of allOrderIds) {
      const order = await kv.get(`order:${orderId}`);
      if (order) {
        orders.push(order);
      }
    }
    
    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ orders });
  } catch (error) {
    console.log(`Error fetching all orders: ${error}`);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// Update order status (admin endpoint)
app.put('/make-server-1ec6f4bd/admin/orders/:orderId/status', async (c) => {
  try {
    const orderId = c.req.param('orderId');
    const { status } = await c.req.json();
    
    if (!status) {
      return c.json({ error: 'Status is required' }, 400);
    }
    
    const order = await kv.get(`order:${orderId}`);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    order.status = status;
    order.updatedAt = new Date().toISOString();
    
    await kv.set(`order:${orderId}`, order);
    
    console.log(`Order ${orderId} status updated to: ${status}`);
    
    return c.json({ success: true, order });
  } catch (error) {
    console.log(`Error updating order status: ${error}`);
    return c.json({ error: 'Failed to update order status' }, 500);
  }
});

// Get customer orders
app.get('/make-server-1ec6f4bd/customers/:email/orders', async (c) => {
  try {
    const email = c.req.param('email');
    const orderIds = await kv.get(`customer:${email}:orders`) || [];
    const orders = [];
    
    for (const orderId of orderIds) {
      const order = await kv.get(`order:${orderId}`);
      if (order) {
        orders.push(order);
      }
    }
    
    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ orders });
  } catch (error) {
    console.log(`Error fetching customer orders: ${error}`);
    return c.json({ error: 'Failed to fetch customer orders' }, 500);
  }
});

// Contact/inquiry endpoint
app.post('/make-server-1ec6f4bd/contact', async (c) => {
  try {
    const contactData = await c.req.json();
    
    const { name, email, subject, message } = contactData;
    if (!name || !email || !message) {
      return c.json({ error: 'Missing required fields: name, email, message' }, 400);
    }

    const inquiryId = `inquiry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const inquiry = {
      id: inquiryId,
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    await kv.set(`inquiry:${inquiryId}`, inquiry);
    
    // Add to inquiries index
    const allInquiries = await kv.get('inquiries:all') || [];
    allInquiries.push(inquiryId);
    await kv.set('inquiries:all', allInquiries);

    console.log(`Inquiry created successfully: ${inquiryId} from ${email}`);
    
    return c.json({ 
      success: true, 
      inquiryId,
      message: 'Thank you for your inquiry. We will respond within 24 hours.' 
    });
  } catch (error) {
    console.log(`Error creating inquiry: ${error}`);
    return c.json({ error: 'Failed to submit inquiry. Please try again.' }, 500);
  }
});

// Get statistics (admin endpoint)
app.get('/make-server-1ec6f4bd/admin/stats', async (c) => {
  try {
    const allOrderIds = await kv.get('orders:all') || [];
    const allInquiryIds = await kv.get('inquiries:all') || [];
    
    let totalRevenue = 0;
    let pendingOrders = 0;
    let completedOrders = 0;
    
    for (const orderId of allOrderIds) {
      const order = await kv.get(`order:${orderId}`);
      if (order) {
        totalRevenue += order.price;
        if (order.status === 'pending') pendingOrders++;
        if (order.status === 'completed') completedOrders++;
      }
    }
    
    const stats = {
      totalOrders: allOrderIds.length,
      totalInquiries: allInquiryIds.length,
      totalRevenue,
      pendingOrders,
      completedOrders,
      averageOrderValue: allOrderIds.length > 0 ? totalRevenue / allOrderIds.length : 0
    };
    
    return c.json({ stats });
  } catch (error) {
    console.log(`Error fetching stats: ${error}`);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

Deno.serve(app.fetch);