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
exports.ProgressBar = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const User_1 = require("../models/User");
class ProgressBar {
}
exports.ProgressBar = ProgressBar;
__decorate([
    (0, typegoose_1.prop)({ ref: () => User_1.User, required: true, unique: true }),
    __metadata("design:type", Object)
], ProgressBar.prototype, "userId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], ProgressBar.prototype, "QuestionScore", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 100 }),
    __metadata("design:type", Number)
], ProgressBar.prototype, "counselorScore", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: () => new Date() }),
    __metadata("design:type", Date)
], ProgressBar.prototype, "date", void 0);
const ProgressBarModel = (0, typegoose_1.getModelForClass)(ProgressBar);
exports.default = ProgressBarModel;
//# sourceMappingURL=ProgressBar.js.map