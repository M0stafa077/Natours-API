import { Aggregate, Query, Schema, model } from "mongoose";
import slugify from "slugify";

const toursSchema = new Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true,
        maxlength: [40, "A tour name must not exceed 40 characters"],
        minlength: [10, "A tour name must have 10 or more characters"],
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"],
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a difficulty"],
        enum: {
            values: ["easy", "medium", "difficult"],
            message: "Difficulty is either: easy, medium, difficult",
        },
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"],
    },
    priceDiscount: {
        type: Number,
        vlidate: {
            validator: function (val: number) {
                return val < (this as any).price;
            },
        },
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a description"],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false,
    },
});
// [TODO] whreeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
toursSchema.pre<tour>("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});
toursSchema.pre<Query<tour, tour>>("findOneAndUpdate", async function (next) {
    const currentDoc = await this.model.findOne(this.getQuery());
    const update = this.getUpdate() as Partial<tour>;
    if (currentDoc) {
        if (update.priceDiscount && update.priceDiscount >= currentDoc.price) {
            next(
                new Error(
                    "Discount price should be less than the actual price."
                )
            );
        } else {
            next();
        }
    } else {
        next(new Error("Document not found."));
    }
});
toursSchema.pre<Query<tour, tour>>(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } }).select("-secretTour");
    next();
});
toursSchema.post(/^find/, function (docs, next) {
    next();
});
toursSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});
const Tour = model("Tour", toursSchema);

export default Tour;
