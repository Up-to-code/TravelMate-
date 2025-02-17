"use client"

import type React from "react"
import { useState } from "react"
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"

const { width } = Dimensions.get("window")
const CARD_WIDTH = width * 0.6
const CARD_HEIGHT = CARD_WIDTH * 1.3

interface Destination {
  id: string
  name: string
  location: string
  image: string
  rating: number
}

const categories = ["All", "Beaches", "Mountains", "Cities", "Historical", "Adventure"]

const destinations: Destination[] = [
  {
    id: "1",
    name: "Bali",
    location: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Santorini",
    location: "Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&h=250",
    rating: 4.7,
  },
  {
    id: "3",
    name: "Machu Picchu",
    location: "Peru",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=400&h=250",
    rating: 4.9,
  },
  {
    id: "4",
    name: "Tokyo",
    location: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&h=250",
    rating: 4.6,
  },
  {
    id: "5",
    name: "Paris",
    location: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&h=250",
    rating: 4.5,
  },
]

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

const DestinationCard: React.FC<{ destination: Destination }> = ({ destination }) => {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  const onPressIn = () => {
    scale.value = withSpring(0.95)
  }

  const onPressOut = () => {
    scale.value = withSpring(1)
  }

  return (
    <AnimatedTouchable style={[styles.card, animatedStyle]} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Image source={{ uri: destination.image }} style={styles.cardImage} />
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.cardGradient}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{destination.name}</Text>
          <Text style={styles.cardSubtitle}>{destination.location}</Text>
          <View style={styles.ratingContainer}>
            <Feather name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{destination.rating.toFixed(1)}</Text>
          </View>
        </View>
      </LinearGradient>
    </AnimatedTouchable>
  )
}

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All")
  const scrollY = useSharedValue(0)

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(scrollY.value, [0, 100], [120, 80], Extrapolate.CLAMP),
    }
  })

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.header, headerStyle]}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={24} color="#757575" style={styles.searchIcon} />
            <TextInput style={styles.searchInput} placeholder="Where to?" placeholderTextColor="#BDBDBD" />
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Feather name="user" size={24} color="#333333" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <Text style={styles.sectionTitle}>Explore Destinations</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.categoryButton, activeCategory === category && styles.activeCategoryButton]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[styles.categoryText, activeCategory === category && styles.activeCategoryText]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FlatList
            data={destinations}
            renderItem={({ item }) => <DestinationCard destination={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsContainer}
            snapToInterval={CARD_WIDTH + 20}
            decelerationRate="fast"
          />

          <Text style={styles.sectionTitle}>Trending Now</Text>
          <FlatList
            data={destinations.slice(0, 3)}
            renderItem={({ item }) => <DestinationCard destination={item} />}
            keyExtractor={(item) => `trending-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsContainer}
            snapToInterval={CARD_WIDTH + 20}
            decelerationRate="fast"
          />

          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <FlatList
            data={destinations.slice(2, 5)}
            renderItem={({ item }) => <DestinationCard destination={item} />}
            keyExtractor={(item) => `recommended-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsContainer}
            snapToInterval={CARD_WIDTH + 20}
            decelerationRate="fast"
          />
        </Animated.ScrollView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    paddingVertical: 12,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#F0F0F0",
  },
  activeCategoryButton: {
    backgroundColor: "#333333",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#757575",
  },
  activeCategoryText: {
    color: "#FFFFFF",
  },
  destinationsContainer: {
    paddingHorizontal: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
    justifyContent: "flex-end",
    padding: 16,
  },
  cardContent: {
    justifyContent: "flex-end",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 4,
  },
})

export default App

