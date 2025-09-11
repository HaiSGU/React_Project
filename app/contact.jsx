import { StyleSheet, View } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="envelope.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Contact Us</ThemedText>
      </ThemedView>

      <ThemedText>
        Have a question, feedback, or need support? We’re always here to help!
      </ThemedText>

      <Collapsible title="Contact Information">
        <View style={styles.row}>
          <Ionicons name="location-sharp" size={20} color="#333" />
          <ThemedText style={styles.text}>123 Nguyen Van Cu, District 5, Ho Chi Minh City</ThemedText>
        </View>
        <View style={styles.row}>
          <FontAwesome name="phone" size={20} color="#333" />
          <ThemedText style={styles.text}>1900 1234 (8:00 AM – 10:00 PM, daily)</ThemedText>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="email" size={20} color="#333" />
          <ThemedText style={styles.text}>support@foodfastapp.com</ThemedText>
        </View>
      </Collapsible>

      <Collapsible title="Customer Support">
        <View style={styles.row}>
          <Ionicons name="search" size={20} color="#333" />
          <ThemedText style={styles.text}>Track your order: Go to My Orders in the app</ThemedText>
        </View>
        <View style={styles.row}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#333" />
          <ThemedText style={styles.text}>Share feedback: Use the Rate & Feedback section</ThemedText>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="support-agent" size={20} color="#333" />
          <ThemedText style={styles.text}>Urgent help: Call our hotline for immediate support</ThemedText>
        </View>
      </Collapsible>

      <Collapsible title="Follow Us">
        <ThemedText>Stay connected with FoodFastApp for deals & updates:</ThemedText>
        <View style={styles.socialRow}>
          <ExternalLink href="https://fb.com/foodfastapp">
            <FontAwesome name="facebook-square" size={28} color="#1877f2" />
          </ExternalLink>
          <ExternalLink href="https://instagram.com/foodfastapp">
            <FontAwesome name="instagram" size={28} color="#E4405F" />
          </ExternalLink>
          <ExternalLink href="https://twitter.com/foodfastapp">
            <FontAwesome name="twitter-square" size={28} color="#1DA1F2" />
          </ExternalLink>
        </View>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  text: {
    flex: 1,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 16,
  },
});
