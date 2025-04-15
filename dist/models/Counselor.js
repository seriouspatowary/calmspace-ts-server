"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counselor = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("./User"); // adjust the import as per your file structure
const Price_1 = require("./Price"); // adjust as needed
let Counselor = class Counselor {
};
exports.Counselor = Counselor;
__decorate([
    (0, typegoose_1.prop)({ ref: () => User_1.User, required: true, unique: true }),
    __metadata("design:type", Object)
], Counselor.prototype, "counselorId", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Counselor.prototype, "experience", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Counselor.prototype, "degree", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Counselor.prototype, "therapy", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Counselor.prototype, "info", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Counselor.prototype, "expertise", void 0);
__decorate([
    (0, typegoose_1.prop)({
        type: () => [String],
        validate: {
            validator: (val) => val.length <= 3,
            message: '{PATH} exceeds the limit of 3',
        },
    }),
    __metadata("design:type", Array)
], Counselor.prototype, "speciality", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [String] }),
    __metadata("design:type", Array)
], Counselor.prototype, "languages", void 0);
__decorate([
    (0, typegoose_1.prop)({ enum: ['online', 'offline'], default: 'offline' }),
    __metadata("design:type", String)
], Counselor.prototype, "status", void 0);
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", String)
], Counselor.prototype, "employeeId", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Price_1.Price }),
    __metadata("design:type", Object)
], Counselor.prototype, "priceId", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: () => new Date() }),
    __metadata("design:type", Date)
], Counselor.prototype, "registrationDate", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], Counselor.prototype, "adminVerified", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Counselor.prototype, "PhoneNumber", void 0);
exports.Counselor = Counselor = __decorate([
    (0, typegoose_1.pre)('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.isNew) {
                const user = yield mongoose_1.default.model('User').findById(this.counselorId);
                if (!user) {
                    throw new Error('User not found');
                }
                const initials = user.name
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);
                const date = new Date((_a = this.registrationDate) !== null && _a !== void 0 ? _a : Date.now());
                const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
                const count = (yield mongoose_1.default.model('Counselor').countDocuments()) + 1;
                const index = String(count).padStart(3, '0');
                this.employeeId = `${initials}${formattedDate}${index}`;
            }
        });
    })
], Counselor);
const CounselorModel = (0, typegoose_1.getModelForClass)(Counselor);
exports.default = CounselorModel;
//# sourceMappingURL=Counselor.js.map