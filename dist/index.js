"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const tour_routes_1 = __importDefault(require("./routes/tour.routes"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const app = (0, express_1.default)();
app.use(express_1.default.json());
if (process.env.NODE_ENV === "dev") {
    app.use((0, morgan_1.default)("dev"));
}
const db = ((_a = process.env.DATABASE) === null || _a === void 0 ? void 0 : _a.replace("<PASSWORD>", String(process.env.DATABASE_PASSWORD))) + "";
mongoose_1.default
    .connect(db)
    .then(() => console.log("DATABASE CONNECTED!! "))
    .catch((err) => console.log(err));
app.use("/api/v1/tours", tour_routes_1.default);
app.get("*", (req, res) => {
    res.status(404).json({ message: "Error. Page Not Found", app: "Natours" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
