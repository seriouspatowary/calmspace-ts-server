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
exports.UserPromptModel = exports.UserPrompt = void 0;
// models/UserPrompt.ts
const typegoose_1 = require("@typegoose/typegoose");
const User_1 = require("../models/User"); // Adjust path as needed
require("reflect-metadata");
class UserPrompt {
}
exports.UserPrompt = UserPrompt;
__decorate([
    (0, typegoose_1.prop)({ ref: () => User_1.User, required: true, unique: true }),
    __metadata("design:type", Object)
], UserPrompt.prototype, "userId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], UserPrompt.prototype, "age", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], UserPrompt.prototype, "gender", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], UserPrompt.prototype, "maxBudget", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], UserPrompt.prototype, "minBudget", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], UserPrompt.prototype, "language", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: () => new Date() }),
    __metadata("design:type", Date)
], UserPrompt.prototype, "createdAt", void 0);
// Create the model
exports.UserPromptModel = (0, typegoose_1.getModelForClass)(UserPrompt, {
    schemaOptions: { timestamps: true },
});
//# sourceMappingURL=Promt.js.map