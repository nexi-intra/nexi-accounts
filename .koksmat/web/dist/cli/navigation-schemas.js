"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
const zod_1 = require("zod");
// Define the supported languages
const SupportedLanguage = zod_1.z.enum(["en", "da"]);
// Define the TranslatedString schema
const TranslatedString = zod_1.z.object({
    en: zod_1.z.string(),
    da: zod_1.z.string(),
});
// Define the NavItem schema
const NavItem = zod_1.z.object({
    title: TranslatedString,
    url: zod_1.z.string(),
    icon: zod_1.z.any(), // We can't easily validate ReactElement with Zod, so we use any
    isActive: zod_1.z.boolean().optional(),
    items: zod_1.z
        .array(zod_1.z.object({
        title: TranslatedString,
        url: zod_1.z.string(),
    }))
        .optional(),
});
// Define the TreeNode schema
const TreeNode = zod_1.z.lazy(() => zod_1.z.object({
    id: zod_1.z.string(),
    text: zod_1.z.string(),
    icon: zod_1.z.enum(["folder", "file", "fileText", "fileCode"]),
    children: zod_1.z.array(TreeNode).optional(),
    action: zod_1.z.string().optional(), // Assuming ActionType is a string
}));
// Define the SidebarData schema
const SidebarData = zod_1.z.object({
    language: SupportedLanguage,
    teams: zod_1.z.array(zod_1.z.object({
        name: TranslatedString,
        logo: zod_1.z.any(), // ReactElement
        plan: TranslatedString,
    })),
    navMain: zod_1.z.array(NavItem),
    projects: zod_1.z.array(zod_1.z.object({
        name: TranslatedString,
        url: zod_1.z.string(),
        icon: zod_1.z.any(), // ReactElement
        moreIcon: zod_1.z.any(), // ReactElement
        actions: zod_1.z.array(zod_1.z.object({
            label: TranslatedString,
            icon: zod_1.z.any(), // ReactElement
        })),
    })),
    moreProjectsIcon: zod_1.z.any(), // ReactElement
    user: zod_1.z.object({
        name: zod_1.z.string(),
        email: zod_1.z.string(),
        avatar: zod_1.z.string(),
    }),
    userMenuItems: zod_1.z.array(zod_1.z.object({
        label: TranslatedString,
        icon: zod_1.z.any(), // ReactElement
    })),
});
// Export the schemas
exports.schemas = {
    SupportedLanguage,
    TranslatedString,
    NavItem,
    TreeNode,
    SidebarData,
};
