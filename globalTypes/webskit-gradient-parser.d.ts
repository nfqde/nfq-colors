declare module 'webskit-gradient-parser' {
    export interface GradientObject {
        conicAngle: number;
        firstParameterIsColor: boolean;
        gradientDefinition: string;
        linearAngle: number;
        position: {
            x: string;
            y: string;
        };
        shape: string;
        size: string;
        stops: [string, string][];
        type: string;
    }

    interface GradientParser {
        parse(gradientString: string): string;
    }

    export default {} as GradientParser;
}