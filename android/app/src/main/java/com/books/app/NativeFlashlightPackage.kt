package com.books.app

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class NativeFlashlightPackage : BaseReactPackage() { // NAME наследуемся от BaseReactPackage

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
    if (name == NativeFlashlightModule.NAME) {
      NativeFlashlightModule(reactContext)
    } else {
      null
    }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
      NativeFlashlightModule.NAME to ReactModuleInfo(
        name = NativeFlashlightModule.NAME, // NAME имя должно совпадать с именем в спецификации
        className = NativeFlashlightModule.NAME, // NAME имя должно совпадать с именем в спецификации
        canOverrideExistingModule = false,
        needsEagerInit = false,
        isCxxModule = false,
        isTurboModule = true
      )
    )
  }
}