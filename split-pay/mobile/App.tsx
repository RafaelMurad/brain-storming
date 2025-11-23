import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isYours: boolean;
  sharedWith: number;
}

interface BillData {
  tableNumber: number;
  restaurant: string;
  items: OrderItem[];
  yourTotal: number;
  totalBill: number;
  tip: number;
}

const sampleBill: BillData = {
  tableNumber: 5,
  restaurant: "The Golden Fork",
  totalBill: 89.95,
  yourTotal: 42.48,
  tip: 0,
  items: [
    { id: '1', name: 'Ribeye Steak', price: 34.99, quantity: 1, isYours: true, sharedWith: 1 },
    { id: '2', name: 'House Wine', price: 9.99, quantity: 1, isYours: true, sharedWith: 2 },
    { id: '3', name: 'Grilled Salmon', price: 24.99, quantity: 1, isYours: false, sharedWith: 1 },
    { id: '4', name: 'Margherita Pizza', price: 16.99, quantity: 1, isYours: false, sharedWith: 1 },
    { id: '5', name: 'Sparkling Water', price: 3.99, quantity: 1, isYours: false, sharedWith: 1 },
  ],
};

type Screen = 'scan' | 'bill' | 'payment' | 'success';

export default function App() {
  const [screen, setScreen] = useState<Screen>('bill');
  const [bill, setBill] = useState<BillData>(sampleBill);
  const [selectedTip, setSelectedTip] = useState<number>(15);
  const [customTip, setCustomTip] = useState<string>('');

  const tipAmount = bill.yourTotal * (selectedTip / 100);
  const finalTotal = bill.yourTotal + tipAmount;

  const yourItems = bill.items.filter(i => i.isYours);
  const otherItems = bill.items.filter(i => !i.isYours);

  if (screen === 'scan') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.scanContainer}>
          <View style={styles.scanHeader}>
            <TouchableOpacity style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.scanTitle}>Scan QR Code</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.scanFrame}>
            <View style={styles.scanCorner} />
            <View style={[styles.scanCorner, { right: 0 }]} />
            <View style={[styles.scanCorner, { bottom: 0 }]} />
            <View style={[styles.scanCorner, { bottom: 0, right: 0 }]} />
          </View>
          <Text style={styles.scanText}>Point your camera at the QR code on your table</Text>
          <TouchableOpacity style={styles.scanBtn} onPress={() => setScreen('bill')}>
            <Ionicons name="flashlight" size={20} color="#fff" />
            <Text style={styles.scanBtnText}>Turn on flashlight</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (screen === 'success') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={64} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSubtitle}>Thank you for dining at</Text>
          <Text style={styles.successRestaurant}>{bill.restaurant}</Text>
          <View style={styles.successCard}>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Amount Paid</Text>
              <Text style={styles.successValue}>${finalTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Tip</Text>
              <Text style={styles.successValue}>${tipAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Table</Text>
              <Text style={styles.successValue}>{bill.tableNumber}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.doneBtn} onPress={() => setScreen('scan')}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (screen === 'payment') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient colors={['#10b981', '#059669']} style={styles.paymentHeader}>
          <TouchableOpacity onPress={() => setScreen('bill')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.paymentTitle}>Complete Payment</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        <ScrollView style={styles.paymentContent}>
          {/* Amount Summary */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Your Total</Text>
            <Text style={styles.amountValue}>${finalTotal.toFixed(2)}</Text>
            <View style={styles.amountBreakdown}>
              <Text style={styles.breakdownText}>Subtotal: ${bill.yourTotal.toFixed(2)}</Text>
              <Text style={styles.breakdownText}>Tip ({selectedTip}%): ${tipAmount.toFixed(2)}</Text>
            </View>
          </View>

          {/* Tip Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add a tip</Text>
            <View style={styles.tipOptions}>
              {[10, 15, 18, 20, 25].map((tip) => (
                <TouchableOpacity
                  key={tip}
                  style={[styles.tipBtn, selectedTip === tip && styles.tipBtnActive]}
                  onPress={() => setSelectedTip(tip)}
                >
                  <Text style={[styles.tipText, selectedTip === tip && styles.tipTextActive]}>{tip}%</Text>
                  <Text style={[styles.tipAmount, selectedTip === tip && styles.tipTextActive]}>
                    ${(bill.yourTotal * (tip / 100)).toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.customTipBtn}>
              <Text style={styles.customTipText}>Custom amount</Text>
            </TouchableOpacity>
          </View>

          {/* Payment Methods */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            {[
              { icon: 'card', name: 'Credit Card •••• 4242', type: 'Visa' },
              { icon: 'logo-apple', name: 'Apple Pay', type: '' },
              { icon: 'logo-google', name: 'Google Pay', type: '' },
            ].map((method, i) => (
              <TouchableOpacity key={i} style={[styles.paymentMethod, i === 0 && styles.paymentMethodActive]}>
                <View style={styles.methodIcon}>
                  <Ionicons name={method.icon as any} size={20} color={i === 0 ? '#10b981' : '#6b7280'} />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  {method.type && <Text style={styles.methodType}>{method.type}</Text>}
                </View>
                {i === 0 && <Ionicons name="checkmark-circle" size={24} color="#10b981" />}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Pay Button */}
        <View style={styles.payFooter}>
          <TouchableOpacity style={styles.payBtn} onPress={() => setScreen('success')}>
            <Text style={styles.payBtnText}>Pay ${finalTotal.toFixed(2)}</Text>
          </TouchableOpacity>
          <View style={styles.secureRow}>
            <Ionicons name="lock-closed" size={14} color="#6b7280" />
            <Text style={styles.secureText}>Secured by Stripe</Text>
          </View>
        </View>
      </View>
    );
  }

  // Bill Screen
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient colors={['#10b981', '#059669']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => setScreen('scan')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{bill.restaurant}</Text>
            <Text style={styles.tableNumber}>Table {bill.tableNumber}</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn}>
            <Ionicons name="refresh" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Your Amount Card */}
        <View style={styles.yourAmountCard}>
          <View>
            <Text style={styles.yourLabel}>Your share</Text>
            <Text style={styles.yourAmount}>${bill.yourTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalInfo}>
            <Text style={styles.totalLabel}>Total bill</Text>
            <Text style={styles.totalAmount}>${bill.totalBill.toFixed(2)}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Your Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Items</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{yourItems.length}</Text>
            </View>
          </View>
          {yourItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemIcon}>
                <Ionicons name="restaurant" size={18} color="#10b981" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.sharedWith > 1 && (
                  <View style={styles.sharedBadge}>
                    <Ionicons name="people" size={12} color="#6b7280" />
                    <Text style={styles.sharedText}>Split {item.sharedWith} ways</Text>
                  </View>
                )}
              </View>
              <Text style={styles.itemPrice}>
                ${(item.price / item.sharedWith).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Other Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Other Items on Table</Text>
            <TouchableOpacity>
              <Text style={styles.claimText}>Claim item</Text>
            </TouchableOpacity>
          </View>
          {otherItems.map((item) => (
            <View key={item.id} style={[styles.itemCard, styles.itemCardOther]}>
              <View style={[styles.itemIcon, styles.itemIconOther]}>
                <Ionicons name="restaurant-outline" size={18} color="#6b7280" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, styles.itemNameOther]}>{item.name}</Text>
              </View>
              <Text style={[styles.itemPrice, styles.itemPriceOther]}>${item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Split Summary */}
        <View style={styles.splitSummary}>
          <View style={styles.splitRow}>
            <View style={styles.splitGuest}>
              <View style={[styles.guestAvatar, { backgroundColor: '#10b981' }]}>
                <Text style={styles.guestInitial}>Y</Text>
              </View>
              <Text style={styles.guestName}>You</Text>
            </View>
            <Text style={styles.guestAmount}>${bill.yourTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.splitRow}>
            <View style={styles.splitGuest}>
              <View style={[styles.guestAvatar, { backgroundColor: '#3b82f6' }]}>
                <Text style={styles.guestInitial}>J</Text>
              </View>
              <Text style={styles.guestName}>Jordan</Text>
            </View>
            <Text style={styles.guestAmount}>$29.98</Text>
          </View>
          <View style={styles.splitRow}>
            <View style={styles.splitGuest}>
              <View style={[styles.guestAvatar, { backgroundColor: '#f59e0b' }]}>
                <Text style={styles.guestInitial}>S</Text>
              </View>
              <Text style={styles.guestName}>Sam</Text>
            </View>
            <Text style={styles.guestAmount}>$20.98</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Your Total</Text>
          <Text style={styles.totalValue}>${bill.yourTotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.payButton} onPress={() => setScreen('payment')}>
          <Ionicons name="card" size={20} color="#fff" />
          <Text style={styles.payButtonText}>Pay Your Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },

  // Scan Screen
  scanContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  scanHeader: { position: 'absolute', top: 60, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  scanTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  scanFrame: { width: 260, height: 260, position: 'relative', marginBottom: 40 },
  scanCorner: { position: 'absolute', width: 40, height: 40, borderColor: '#10b981', borderTopWidth: 4, borderLeftWidth: 4 },
  scanText: { color: '#6b7280', textAlign: 'center', fontSize: 16, marginBottom: 30 },
  scanBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, backgroundColor: '#1a1a1a', borderRadius: 12 },
  scanBtnText: { color: '#fff', fontSize: 16 },

  // Success Screen
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  successIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  successSubtitle: { color: '#6b7280', fontSize: 16 },
  successRestaurant: { color: '#10b981', fontSize: 18, fontWeight: '600', marginBottom: 32 },
  successCard: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 20, width: '100%', marginBottom: 32 },
  successRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  successLabel: { color: '#6b7280', fontSize: 16 },
  successValue: { color: '#fff', fontSize: 16, fontWeight: '600' },
  successDivider: { height: 1, backgroundColor: '#333' },
  doneBtn: { backgroundColor: '#10b981', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 12 },
  doneBtnText: { color: '#fff', fontSize: 18, fontWeight: '600' },

  // Header
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  refreshBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  restaurantInfo: { alignItems: 'center' },
  restaurantName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  tableNumber: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  yourAmountCard: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  yourLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  yourAmount: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  totalInfo: { alignItems: 'flex-end' },
  totalLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  totalAmount: { color: '#fff', fontSize: 18, fontWeight: '600' },

  // Content
  content: { flex: 1, padding: 16 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  badge: { backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  claimText: { color: '#10b981', fontSize: 14, fontWeight: '500' },

  // Item Cards
  itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, marginBottom: 8 },
  itemCardOther: { backgroundColor: '#141414', opacity: 0.7 },
  itemIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#10b98120', alignItems: 'center', justifyContent: 'center' },
  itemIconOther: { backgroundColor: '#33333350' },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemName: { color: '#fff', fontSize: 15, fontWeight: '500' },
  itemNameOther: { color: '#9ca3af' },
  itemPrice: { color: '#10b981', fontSize: 16, fontWeight: '600' },
  itemPriceOther: { color: '#6b7280' },
  sharedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  sharedText: { color: '#6b7280', fontSize: 12 },

  // Split Summary
  splitSummary: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, marginBottom: 100 },
  splitRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  splitGuest: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  guestAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  guestInitial: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  guestName: { color: '#fff', fontSize: 15 },
  guestAmount: { color: '#fff', fontSize: 15, fontWeight: '600' },

  // Bottom Actions
  bottomActions: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#1a1a1a', borderTopWidth: 1, borderTopColor: '#333', padding: 20, paddingBottom: 36 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalText: { color: '#6b7280', fontSize: 16 },
  totalValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  payButton: { backgroundColor: '#10b981', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 12 },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },

  // Payment Screen
  paymentHeader: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  paymentTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  paymentContent: { flex: 1, padding: 16 },
  amountCard: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24 },
  amountLabel: { color: '#6b7280', fontSize: 14, marginBottom: 8 },
  amountValue: { color: '#fff', fontSize: 42, fontWeight: 'bold', marginBottom: 12 },
  amountBreakdown: { alignItems: 'center' },
  breakdownText: { color: '#6b7280', fontSize: 14 },
  tipOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tipBtn: { flex: 1, minWidth: '18%', backgroundColor: '#1a1a1a', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  tipBtnActive: { backgroundColor: '#10b98120', borderColor: '#10b981' },
  tipText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  tipTextActive: { color: '#10b981' },
  tipAmount: { color: '#6b7280', fontSize: 12, marginTop: 4 },
  customTipBtn: { backgroundColor: '#1a1a1a', padding: 12, borderRadius: 12, alignItems: 'center' },
  customTipText: { color: '#6b7280', fontSize: 14 },
  paymentMethod: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#333' },
  paymentMethodActive: { borderColor: '#10b981' },
  methodIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#33333350', alignItems: 'center', justifyContent: 'center' },
  methodInfo: { flex: 1, marginLeft: 12 },
  methodName: { color: '#fff', fontSize: 15, fontWeight: '500' },
  methodType: { color: '#6b7280', fontSize: 13 },
  payFooter: { padding: 20, paddingBottom: 36, backgroundColor: '#1a1a1a', borderTopWidth: 1, borderTopColor: '#333' },
  payBtn: { backgroundColor: '#10b981', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  payBtnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  secureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 },
  secureText: { color: '#6b7280', fontSize: 12 },
});
