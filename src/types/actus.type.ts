type Actus = {
    title: string;
    resume: string;
    date?: string;
    images: Images[];
    description: string;
    link?: [string, string];
};
type Images = {
    src: string;
    alt: string;
};
export type { Actus, Images };