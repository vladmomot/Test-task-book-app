import Foundation
import AVFoundation
import React

@objc(FlashlightModule)
class FlashlightModule: NSObject, RCTBridgeModule {
  private var torchDevice: AVCaptureDevice? {
    return AVCaptureDevice.default(for: .video)
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc
  static func moduleName() -> String! {
    return "FlashlightModule"
  }
  
  @objc
  func turnOn(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let device = torchDevice, device.hasTorch else {
      reject("FLASHLIGHT_UNAVAILABLE", "Flashlight is not available on this device", nil)
      return
    }
    
    do {
      try device.lockForConfiguration()
      device.torchMode = .on
      device.unlockForConfiguration()
      resolve(nil)
    } catch {
      reject("CAMERA_ACCESS_ERROR", "Failed to access camera: \(error.localizedDescription)", error)
    }
  }
  
  @objc
  func turnOff(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let device = torchDevice, device.hasTorch else {
      reject("FLASHLIGHT_UNAVAILABLE", "Flashlight is not available on this device", nil)
      return
    }
    
    do {
      try device.lockForConfiguration()
      device.torchMode = .off
      device.unlockForConfiguration()
      resolve(nil)
    } catch {
      reject("CAMERA_ACCESS_ERROR", "Failed to access camera: \(error.localizedDescription)", error)
    }
  }
  
  @objc
  func toggle(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let device = torchDevice, device.hasTorch else {
      reject("FLASHLIGHT_UNAVAILABLE", "Flashlight is not available on this device", nil)
      return
    }
    
    do {
      try device.lockForConfiguration()
      let newState = device.torchMode == .off
      device.torchMode = newState ? .on : .off
      device.unlockForConfiguration()
      resolve(newState)
    } catch {
      reject("CAMERA_ACCESS_ERROR", "Failed to access camera: \(error.localizedDescription)", error)
    }
  }
  
  @objc
  func isOn(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let device = torchDevice, device.hasTorch else {
      reject("FLASHLIGHT_UNAVAILABLE", "Flashlight is not available on this device", nil)
      return
    }
    
    resolve(device.torchMode == .on)
  }
  
  @objc
  func isAvailable(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let device = torchDevice else {
      resolve(false)
      return
    }
    resolve(device.hasTorch)
  }
}

