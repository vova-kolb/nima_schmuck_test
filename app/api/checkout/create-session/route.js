import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const toAbsoluteImage = (src, origin) => {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('//')) return `https:${src}`;
  const prefix = src.startsWith('/') ? '' : '/';
  return `${origin}${prefix}${src}`;
};

export async function POST(request) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe secret key is missing on the server.' },
      { status: 500 },
    );
  }

  let payload = null;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const origin =
    request.headers.get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';

  const items = Array.isArray(payload?.items) ? payload.items : [];
  if (!items.length) {
    return NextResponse.json({ error: 'No items to checkout.' }, { status: 400 });
  }

  const lineItems = items.map((item) => {
    const unitAmount = Math.round(Math.max(0, Number(item.price) || 0) * 100);
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const imageUrl = toAbsoluteImage(item.image, origin);

    return {
      quantity,
      price_data: {
        currency: 'chf',
        unit_amount: unitAmount,
        product_data: {
          name: item.name || 'Product',
          metadata: item.id ? { id: String(item.id) } : undefined,
          images: imageUrl ? [imageUrl] : undefined,
        },
      },
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Unable to create Stripe session.' },
      { status: 500 },
    );
  }
}
