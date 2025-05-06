
import { AuthData } from "@/entities/model";
import { TurboModule, TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
    setState(isActive:boolean, isRequest:boolean): void;
    saveState(): Promise<AuthData | null>;
    
}

export default TurboModuleRegistry.get<Spec>('Notification') as Spec;
