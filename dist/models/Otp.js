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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const typegoose_1 = require("@typegoose/typegoose");
let Otp = class Otp {
};
exports.Otp = Otp;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Otp.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Otp.prototype, "otp", void 0);
__decorate([
    (0, typegoose_1.prop)({
        default: Date.now,
        expires: 300, // document expires after 300 seconds (5 mins)
    }),
    __metadata("design:type", Date)
], Otp.prototype, "created_at", void 0);
exports.Otp = Otp = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: { createdAt: 'created_at', updatedAt: false },
        },
    })
], Otp);
const OtpModel = (0, typegoose_1.getModelForClass)(Otp);
exports.default = OtpModel;
//# sourceMappingURL=Otp.js.map