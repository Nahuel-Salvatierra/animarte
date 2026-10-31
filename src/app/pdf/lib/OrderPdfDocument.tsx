'use client';

import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

export type OrderPdfItem = {
  title: string;
  amount: number;
  imageDataUrl: string;
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    color: '#252525',
    fontFamily: 'Helvetica',
  },
  brand: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    marginBottom: 16,
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  item: {
    width: '48%',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  image: {
    width: 72,
    height: 72,
    objectFit: 'cover',
  },
  itemTitle: {
    fontSize: 11,
    marginBottom: 4,
  },
  amount: {
    fontSize: 10,
    color: '#555555',
  },
});

export function OrderPdfDocument({
  storeName,
  items,
}: {
  storeName: string;
  items: OrderPdfItem[];
}) {
  return (
    <Document title={`Pedido Animarte - ${storeName}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>Animarte</Text>
        <Text style={styles.subtitle}>Nombre de la tienda: {storeName}</Text>
        <View style={styles.grid}>
          {items.map((item, index) => (
            <View key={`${item.title}-${index}`} style={styles.item} wrap={false}>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image */}
              <Image src={item.imageDataUrl} style={styles.image} />
              <View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.amount}>Cantidad: {item.amount}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
