package com.books.app

import android.content.Context
import android.content.SharedPreferences
import com.books.app.NativeFlashlightSpec // NAME добавляем импорт спецификации
import com.facebook.react.bridge.ReactApplicationContext
import android.hardware.camera2.CameraManager
import com.facebook.react.bridge.Promise

class NativeFlashlightModule(reactContext: ReactApplicationContext) : NativeFlashlightSpec(reactContext) { // NAME наследуемся от спецификации 

  override fun getName() = NAME

  override fun toggleFlashlight(isOn: Boolean, promise: Promise) {
    try {
      val cameraManager =
        reactApplicationContext.getSystemService(Context.CAMERA_SERVICE) as CameraManager

      val cameraId = cameraManager.cameraIdList[0]
        cameraManager.setTorchMode(cameraId, isOn)

      promise.resolve(null)

    } catch (e: Exception) {
      promise.reject("FLASH_ERROR", e)
    }
  }

  companion object {
    const val NAME = "NativeFlashlight" // NAME имя должно совпадать с именем в спецификации
  }
}