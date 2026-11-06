
package com.flashlightapp

import android.content.Context
import android.content.pm.PackageManager
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.Manifest
import android.media.AudioManager
import android.media.ToneGenerator
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*

class FlashlightModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private val cameraManager =
        reactContext.getSystemService(Context.CAMERA_SERVICE) as CameraManager

    private val toneGenerator =
        ToneGenerator(AudioManager.STREAM_NOTIFICATION, 80)

    override fun getName(): String = "FlashlightModule"

    @ReactMethod
    fun setTorch(enabled: Boolean, promise: Promise) {
        try {
            val permission = ContextCompat.checkSelfPermission(
                reactContext,
                Manifest.permission.CAMERA
            )

            if (permission != PackageManager.PERMISSION_GRANTED) {
                promise.reject("E_PERMISSION", "Camera permission not granted")
                return
            }

            val cameraId = cameraManager.cameraIdList.firstOrNull { id ->
                val characteristics =
                    cameraManager.getCameraCharacteristics(id)

                characteristics.get(CameraCharacteristics.FLASH_INFO_AVAILABLE) == true &&
                characteristics.get(CameraCharacteristics.LENS_FACING) ==
                    CameraCharacteristics.LENS_FACING_BACK
            }

            if (cameraId == null) {
                promise.reject("E_NO_FLASH", "No flashlight found")
                return
            }

            cameraManager.setTorchMode(cameraId, enabled)
            promise.resolve(true)

        } catch (e: Exception) {
            promise.reject("E_TORCH", e.message, e)
        }
    }

    @ReactMethod
    fun playToggleSound(enabled: Boolean, promise: Promise) {
        try {
            val tone = if (enabled) {
                ToneGenerator.TONE_PROP_BEEP
            } else {
                ToneGenerator.TONE_PROP_NACK
            }

            toneGenerator.startTone(tone, 150)
            promise.resolve(true)

        } catch (e: Exception) {
            promise.reject("E_SOUND", e.message, e)
        }
    }

    // VIBRATION TEST
    @ReactMethod
    fun testVibration(promise: Promise) {
        try {
            val vibrator = reactContext.getSystemService(
                Context.VIBRATOR_SERVICE
            ) as Vibrator

            if (!vibrator.hasVibrator()) {
                promise.reject("E_NO_VIBRATOR", "Device has no vibrator")
                return
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(
                    VibrationEffect.createOneShot(
                        1000,
                        VibrationEffect.DEFAULT_AMPLITUDE
                    )
                )
            } else {
                @Suppress("DEPRECATION")
                vibrator.vibrate(1000)
            }

            promise.resolve(true)

        } catch (e: Exception) {
            promise.reject("E_VIBRATION", e.message, e)
        }
    }
}
