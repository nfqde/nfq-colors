declare module 'onecolor' {
    interface ColorObject {
        equals(colorObj: ColorObject | false): boolean;
        hex(): string;
    }

    export default function color(colorString: string): ColorObject | false;
}