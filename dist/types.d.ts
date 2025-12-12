export type Theme = 'dark' | 'light' | string;
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
export type State = 'hover' | 'active' | 'focus' | 'visited' | 'focus-visible' | 'focus-within' | 'disabled' | 'enabled' | 'checked' | string;
export type BreakpointStrategy = 'mobile-first' | 'desktop-first' | 'exact';
export interface StyleConditions {
    theme?: Theme;
    breakpoint?: Breakpoint;
    state?: State;
}
export interface ParsedStyle {
    property: string;
    value: string;
    conditions: StyleConditions;
}
export interface ParsedStyles {
    styles: ParsedStyle[];
}
export interface GetStyleOptions {
    theme?: Theme;
    state?: State;
    breakpoint?: Breakpoint;
    breakpointStrategy?: BreakpointStrategy;
}
//# sourceMappingURL=types.d.ts.map