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
const typegoose_1 = require("@typegoose/typegoose");
// 1. Article Content Class
class ArticleContent {
}
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], ArticleContent.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], ArticleContent.prototype, "body", void 0);
// 2. Main Article Class
let Article = class Article {
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Article.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Article.prototype, "author", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Article.prototype, "designation", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Article.prototype, "imgSrc", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Article.prototype, "createdAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Article.prototype, "category", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Article.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Article.prototype, "desc", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [ArticleContent] }),
    __metadata("design:type", Array)
], Article.prototype, "content", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Article.prototype, "message", void 0);
Article = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            collection: 'articles',
        }
    })
], Article);
// 3. Export the model
const ArticleModel = (0, typegoose_1.getModelForClass)(Article);
exports.default = ArticleModel;
//# sourceMappingURL=Blog.js.map