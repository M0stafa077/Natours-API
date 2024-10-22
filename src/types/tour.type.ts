type tour = {
    id?: number;
    name: string;
    slug?: string;
    duration: number;
    maxGroupSize: number;
    difficulty: string;
    ratingsAverage?: number;
    ratingsQuantity?: number;
    price: number;
    summary: string;
    description?: string;
    imageCover: string;
    images?: Array<string>;
    startDates?: Array<string>;
    secretTour?: boolean;
};
