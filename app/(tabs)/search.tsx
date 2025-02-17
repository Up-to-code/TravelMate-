"use client"

import React, { useState, useCallback, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useDebounce } from "use-debounce"
import { MotiView, AnimatePresence } from "moti"
import { Ionicons } from "@expo/vector-icons"
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"

const { width, height } = Dimensions.get("window")
const CARD_WIDTH = width * 0.7
const CARD_HEIGHT = height * 0.3

const CATEGORIES: { id: number; name: string; icon: "globe-outline" | "bed-outline" | "airplane-outline" | "bicycle-outline" | "restaurant-outline" }[] = [
  { id: 1, name: "All", icon: "globe-outline" },
  { id: 2, name: "Hotels", icon: "bed-outline" },
  { id: 3, name: "Flights", icon: "airplane-outline" },
  { id: 4, name: "Activities", icon: "bicycle-outline" },
  { id: 5, name: "Food", icon: "restaurant-outline" },
]

const POPULAR_DESTINATIONS = [
  {
    id: "1",
    name: "Bali",
    location: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250",
  },
  {
    id: "2",
    name: "Santorini",
    location: "Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&h=250",
  },
  {
    id: "3",
    name: "Machu Picchu",
    location: "Peru",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=400&h=250",
  },
  {
    id: "4",
    name: "Tokyo",
    location: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&h=250",
  },
]

interface SearchResult {
  id: string
  title: string
  location: string
  rating: number
  image: string
}

const TravelSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300)
  const [activeCategory, setActiveCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const inputRef = useRef(null)
  const insets = useSafeAreaInsets()
  const scrollY = useSharedValue(0)

  const styles = getStyles(insets)

  const handleSearch = useCallback(async () => {
    if (debouncedSearchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSearchResults([
      {
        id: "1",
        title: "Eiffel Tower",
        location: "Paris, France",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=400&h=250",
      },
      {
        id: "2",
        title: "Colosseum",
        location: "Rome, Italy",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&h=250",
      },
      {
        id: "3",
        title: "Taj Mahal",
        location: "Agra, India",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&h=250",
      },
    ])
    setIsLoading(false)
  }, [debouncedSearchQuery])

  React.useEffect(() => {
    handleSearch()
  }, [handleSearch])

  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity style={styles.resultItem}>
      <Image source={{ uri: item.image }} style={styles.resultImage} />
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={StyleSheet.absoluteFillObject} />
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultLocation}>{item.location}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderSkeleton = () => (
    <MotiView
      from={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 1000, loop: true }}
      style={styles.skeletonContainer}
    >
      {[1, 2, 3].map((_, index) => (
        <View key={index} style={styles.skeletonItem}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonContent}>
            <View style={[styles.skeletonText, { width: "70%" }]} />
            <View style={[styles.skeletonText, { width: "50%" }]} />
          </View>
        </View>
      ))}
    </MotiView>
  )

  const renderCategories = () => (
    <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>Explore</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryButton, activeCategory === category.name && styles.categoryButtonActive]}
            onPress={() => setActiveCategory(category.name)}
          >
            <Ionicons name={category.icon} size={24} color={activeCategory === category.name ? "#FBFBFB" : "#000000"} />
            <Text style={[styles.categoryText, activeCategory === category.name && styles.categoryTextActive]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  )

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(scrollY.value > 50 ? 1 : 0),
      transform: [{ translateY: withSpring(scrollY.value > 50 ? 0 : -100) }],
    }
  })

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerStyle]}>
        <BlurView intensity={100} style={StyleSheet.absoluteFill} />
        <Text style={styles.headerTitle}>Discover</Text>
      </Animated.View>
      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={24} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Where do you want to go?"
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          <AnimatePresence>
            {searchQuery !== "" && (
              <MotiView
                from={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#8E8E93" />
                </TouchableOpacity>
              </MotiView>
            )}
          </AnimatePresence>
        </View>

        {renderCategories()}

        {isLoading ? (
          renderSkeleton()
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.resultsContainer}
          />
        ) : debouncedSearchQuery !== "" ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search" size={64} color="#8E8E93" />
            <Text style={styles.noResultsText}>No results found. Try different keywords.</Text>
          </View>
        ) : (
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.popularSection}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <FlatList
              data={POPULAR_DESTINATIONS}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularContainer}
              decelerationRate="fast"
              snapToInterval={CARD_WIDTH + 16}
              snapToAlignment="center"
              renderItem={({ item, index }) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInRight.delay(index * 100).duration(500)}
                  style={styles.popularItem}
                >
                  <TouchableOpacity>
                    <Image source={{ uri: item.image }} style={styles.popularImage} />
                    <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={StyleSheet.absoluteFillObject} />
                    <View style={styles.popularContent}>
                      <Text style={styles.popularName}>{item.name}</Text>
                      <Text style={styles.popularLocation}>{item.location}</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              )}
            />
          </Animated.View>
        )}
      </Animated.ScrollView>
    </View>
  )
}

const getStyles = (insets: { top: number }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FBFBFB",
    },
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 60 + insets.top,
      justifyContent: "flex-end",
      paddingBottom: 10,
      zIndex: 1000,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#000000",
      textAlign: "center",
    },
    content: {
      flex: 1,
      paddingTop: insets.top,
    },
    searchBarContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      margin: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: "#000000",
    },
    clearButton: {
      padding: 4,
    },
    categoriesSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: "#000000",
      marginHorizontal: 16,
      marginBottom: 16,
    },
    categoriesContainer: {
      paddingHorizontal: 16,
      gap: 12,
    },
    categoryButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
      gap: 8,
      backgroundColor: "#FFFFFF",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    categoryButtonActive: {
      backgroundColor: "#000000",
    },
    categoryText: {
      fontSize: 14,
      color: "#000000",
      fontWeight: "600",
    },
    categoryTextActive: {
      color: "#FBFBFB",
    },
    resultsContainer: {
      paddingHorizontal: 16,
      gap: 16,
    },
    resultItem: {
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    resultImage: {
      width: "100%",
      height: 200,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    resultContent: {
      padding: 16,
    },
    resultTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    resultLocation: {
      fontSize: 16,
      color: "#FBFBFB",
      marginBottom: 8,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    ratingText: {
      marginLeft: 4,
      fontSize: 14,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    noResultsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 64,
    },
    noResultsText: {
      fontSize: 16,
      color: "#8E8E93",
      textAlign: "center",
      marginTop: 16,
    },
    popularSection: {
      marginBottom: 24,
    },
    popularContainer: {
      paddingHorizontal: 16,
      gap: 16,
    },
    popularItem: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 16,
      overflow: "hidden",
    },
    popularImage: {
      width: "100%",
      height: "100%",
      borderRadius: 16,
    },
    popularContent: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
    },
    popularName: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    popularLocation: {
      fontSize: 16,
      color: "rgba(255,255,255,0.9)",
    },
    skeletonContainer: {
      paddingHorizontal: 16,
    },
    skeletonItem: {
      flexDirection: "row",
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      marginBottom: 16,
      overflow: "hidden",
    },
    skeletonImage: {
      width: 100,
      height: 100,
      backgroundColor: "#E5E5EA",
    },
    skeletonContent: {
      flex: 1,
      padding: 12,
    },
    skeletonText: {
      height: 16,
      backgroundColor: "#E5E5EA",
      marginBottom: 8,
      borderRadius: 4,
    },
  })

export default TravelSearchScreen

