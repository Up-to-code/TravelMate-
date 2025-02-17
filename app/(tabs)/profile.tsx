import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar";
import { useUser } from "@clerk/clerk-expo";

export default function ProfileScreen() {
  const user = useUser()
  const ProfileOption = ({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) => (
    <TouchableOpacity style={styles.option}>
      <View style={styles.optionContent}>
        <Ionicons name={icon} size={22} color="#000" />
        <Text style={styles.optionText}>{text}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#C7C7CC" />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{
              uri: user.user?.imageUrl ?? "https://via.placeholder.com/150",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.user?.firstName ?? "John Doe"}</Text>
          <Text style={styles.email}>{user.user?.emailAddresses[0].emailAddress ?? "john.doe@example.com"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <ProfileOption icon="person-outline" text="Edit Profile" />
          <ProfileOption icon="lock-closed-outline" text="Change Password" />
          <ProfileOption icon="notifications-outline" text="Notifications" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <ProfileOption icon="moon-outline" text="Dark Mode" />
          <ProfileOption icon="language-outline" text="Language" />
        </View>

        <TouchableOpacity style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    backgroundColor: "white",
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 17,
    color: "#000",
    marginLeft: 12,
  },
  signOutButton: {
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  signOutText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
})

