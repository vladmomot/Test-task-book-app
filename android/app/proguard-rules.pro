# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}
-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

-keepclassmembers class * {
  @com.facebook.react.bridge.ReactMethod *;
}
-keepclassmembers class * {
  @com.facebook.react.uimanager.UIProp *;
}
-keepclassmembers class * {
  @com.facebook.react.uimanager.annotations.ReactProp *;
}
-keepclassmembers class * {
  @com.facebook.react.uimanager.annotations.ReactPropGroup *;
}

-dontwarn com.facebook.react.**
-keep,includedescriptorclasses class com.facebook.react.bridge.** { *; }
-keep,includedescriptorclasses class com.facebook.react.turbomodule.** { *; }
-keepclassmembers class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keepclassmembers class * extends com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers class * {
  @com.facebook.react.uimanager.annotations.ReactProp *;
  @com.facebook.react.uimanager.annotations.ReactPropGroup *;
}
-keepclassmembers class * extends com.facebook.react.uimanager.ViewManager {
  public <init>(com.facebook.react.bridge.ReactApplicationContext);
}
-keepclassmembers class * extends com.facebook.react.uimanager.ViewManager {
  public <init>(android.content.Context, android.util.AttributeSet, int);
}
-keepclassmembers class * extends com.facebook.react.uimanager.ViewManager {
  public <init>(android.content.Context, android.util.AttributeSet);
}
-keepclassmembers class * extends com.facebook.react.uimanager.ViewManager {
  public <init>(android.content.Context);
}
-keepclassmembers class * extends com.facebook.react.bridge.JavaScriptModule {
  public *;
}
-keepclassmembers class * {
  @com.facebook.react.module.annotations.ReactModule *;
}

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# React Native Firebase
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }
-dontwarn com.swmansion.gesturehandler.**

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-dontwarn com.swmansion.reanimated.**

# React Native Screens
-keep class com.swmansion.rnscreens.** { *; }
-dontwarn com.swmansion.rnscreens.**

# React Native SVG
-keep class com.horcrux.svg.** { *; }
-dontwarn com.horcrux.svg.**

# React Native Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }
-dontwarn com.th3rdwave.safeareacontext.**

# React Native Boot Splash
-keep class com.zoontek.rnbootsplash.** { *; }
-dontwarn com.zoontek.rnbootsplash.**

# React Native Toast Message
-keep class com.toast.** { *; }
-dontwarn com.toast.**

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# Gson
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep Parcelable implementations
-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

# Keep Serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep application class
-keep public class * extends android.app.Application

# Keep MainActivity
-keep public class com.books.app.MainActivity { *; }
-keep public class com.books.app.MainApplication { *; }