"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import { useSignUp } from "@clerk/clerk-expo"
import { Link, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const { width } = Dimensions.get("window")

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log("I am in sign up screen")
  }, [])

  const onSignUpPress = async () => {
    if (!isLoaded || isLoading) return
    setIsLoading(true)
    setError("")

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      })

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

      // Set pending verification state to true
      setPendingVerification(true)
    } catch (err: any) {
      console.error("Sign-up error:", err)
      setError(err.errors?.[0]?.message || "An error occurred during sign up")
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded || isLoading) return
    setIsLoading(true)
    setError("")

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId })
        console.log("Sign-up successful, redirecting to home")
        router.replace("/")
      } else {
        console.log("Email verification failed")
        setError("Email verification failed. Please try again.")
      }
    } catch (err: any) {
      console.error("Verification error:", err)
      setError(err.errors?.[0]?.message || "An error occurred during verification")
    } finally {
      setIsLoading(false)
    }
  }

  const renderInput = (label: string, value: string, setter: (text: string) => void, options: any = {}) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={setter}
          style={styles.input}
          placeholderTextColor="#999"
          editable={!isLoading}
          {...options}
        />
      </View>
    </View>
  )

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView bounces={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2264&auto=format&fit=crop",
              }}
              style={styles.headerImage}
            />
            <LinearGradient colors={["rgba(0,0,0,0.8)", "transparent"]} style={styles.gradient} />
          </View>

          <View style={styles.form}>
            <Text style={styles.title}>{pendingVerification ? "Verify Email" : "Create Account"}</Text>
            <Text style={styles.subtitle}>
              {pendingVerification ? "Enter the code sent to your email" : "Sign up to get started"}
            </Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#ff4444" />
                <Text style={styles.error}>{error}</Text>
              </View>
            ) : null}

            {!pendingVerification ? (
              <>
                {renderInput("First Name", firstName, setFirstName, { placeholder: "John" })}
                {renderInput("Last Name", lastName, setLastName, { placeholder: "Doe" })}
                {renderInput("Email", emailAddress, setEmailAddress, {
                  placeholder: "john@example.com",
                  keyboardType: "email-address",
                  autoCapitalize: "none",
                })}
                {renderInput("Password", password, setPassword, {
                  placeholder: "Enter your password",
                  secureTextEntry: true,
                })}

                <TouchableOpacity onPress={onSignUpPress} style={styles.button} disabled={isLoading}>
                  {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign Up</Text>}
                </TouchableOpacity>
              </>
            ) : (
              <>
                {renderInput("Verification Code", code, setCode, {
                  placeholder: "Enter verification code",
                  keyboardType: "number-pad",
                })}

                <TouchableOpacity onPress={onVerifyPress} style={styles.button} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Verify Email</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Link href="/sign-in" style={styles.link}>
                <Text style={styles.linkText}>Sign In</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 240,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  form: {
    flex: 1,
    padding: 24,
    marginTop: -40,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  error: {
    color: "#ff4444",
    marginLeft: 8,
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
  },
  button: {
    height: 52,
    backgroundColor: "#131313",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    paddingBottom: 24,
  },
  footerText: {
    color: "#666",
    marginRight: 8,
  },
  link: {
    marginLeft: 4,
  },
  linkText: {
    color: "#222222",
    fontWeight: "600",
  },
})

