# SplitPay

**Smart Bill Splitting for Restaurants** - QR-based payment system where guests can scan and pay their share.

## Monetization
- **Free (for guests)**: Scan, view bill, pay your share
- **Restaurant Basic ($29/mo)**: Up to 20 tables, QR codes, basic analytics
- **Restaurant Pro ($79/mo)**: Unlimited tables, custom branding, advanced analytics, POS integration
- **Enterprise ($199/mo)**: Multi-location, API access, dedicated support, white-label option

## Features

### Restaurant Dashboard (Web)
- Table management with real-time status
- Create orders and assign items to guests
- Drag-and-drop item assignment
- Generate unique QR codes per table
- Track payments in real-time
- Split bills automatically
- Analytics and reporting
- POS system integration

### Guest App (Mobile)
- Scan QR code to view your bill
- See items assigned to you
- View split breakdown
- Claim unassigned items
- Add tip (percentage presets or custom)
- Multiple payment methods (Card, Apple Pay, Google Pay)
- Payment confirmation receipt
- Share receipt via email/SMS

## Tech Stack
- **Web**: Next.js 14, Tailwind CSS, QRCode.react, Stripe
- **Mobile**: Expo, React Native, expo-camera, expo-barcode-scanner

## Ports
- Web (Restaurant Dashboard): http://localhost:4014

## How It Works
1. **Restaurant creates order** - Staff adds items and assigns to guests
2. **QR code generated** - Unique code for each table session
3. **Guests scan** - Each guest scans with their phone
4. **View & claim items** - See what's yours, claim shared items
5. **Pay your share** - Add tip and pay securely
6. **Real-time updates** - Restaurant sees payments instantly
