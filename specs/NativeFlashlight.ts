import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  toggleFlashlight: (isOn: boolean) => Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeFlashlight'); // NAME имя должно совпадать с именем, указанным в NativeFlashlightModule.kt
