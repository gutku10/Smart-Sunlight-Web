export declare type PickFirstConfig = {};
export declare type RoundRobinConfig = {};
export interface XdsConfig {
    balancerName: string;
    childPolicy: LoadBalancingConfig[];
    fallbackPolicy: LoadBalancingConfig[];
}
export interface GrpcLbConfig {
    childPolicy: LoadBalancingConfig[];
}
export interface PriorityChild {
    config: LoadBalancingConfig[];
}
export interface PriorityLbConfig {
    children: Map<string, PriorityChild>;
    priorities: string[];
}
export interface WeightedTarget {
    weight: number;
    child_policy: LoadBalancingConfig[];
}
export interface WeightedTargetLbConfig {
    targets: Map<string, WeightedTarget>;
}
export interface PickFirstLoadBalancingConfig {
    name: 'pick_first';
    pick_first: PickFirstConfig;
}
export interface RoundRobinLoadBalancingConfig {
    name: 'round_robin';
    round_robin: RoundRobinConfig;
}
export interface XdsLoadBalancingConfig {
    name: 'xds';
    xds: XdsConfig;
}
export interface GrpcLbLoadBalancingConfig {
    name: 'grpclb';
    grpclb: GrpcLbConfig;
}
export interface PriorityLoadBalancingConfig {
    name: 'priority';
    priority: PriorityLbConfig;
}
export interface WeightedTargetLoadBalancingConfig {
    name: 'weighted_target';
    weighted_target: WeightedTargetLbConfig;
}
export declare type LoadBalancingConfig = PickFirstLoadBalancingConfig | RoundRobinLoadBalancingConfig | XdsLoadBalancingConfig | GrpcLbLoadBalancingConfig | PriorityLoadBalancingConfig | WeightedTargetLoadBalancingConfig;
export declare function isRoundRobinLoadBalancingConfig(lbconfig: LoadBalancingConfig): lbconfig is RoundRobinLoadBalancingConfig;
export declare function isXdsLoadBalancingConfig(lbconfig: LoadBalancingConfig): lbconfig is XdsLoadBalancingConfig;
export declare function isGrpcLbLoadBalancingConfig(lbconfig: LoadBalancingConfig): lbconfig is GrpcLbLoadBalancingConfig;
export declare function isPriorityLoadBalancingConfig(lbconfig: LoadBalancingConfig): lbconfig is PriorityLoadBalancingConfig;
export declare function isWeightedTargetLoadBalancingConfig(lbconfig: LoadBalancingConfig): lbconfig is WeightedTargetLoadBalancingConfig;
export declare function validateConfig(obj: any): LoadBalancingConfig;
