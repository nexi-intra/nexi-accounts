"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuHandler = exports.exportSidebar = exports.sidebarDataToTreeNodes = void 0;
const sidebar_data_1 = require("@/app/sidebar-data");
// Function to convert a NavItem to a TreeNode
function navItemToTreeNode(navItem) {
    const treeNode = {
        id: navItem.url,
        text: navItem.title.en, // Using English title as the primary text
        translations: {
            en: navItem.title.en, // Store English translation as well
        },
        icon: navItem.icon,
    };
    // Add translations for all available languages
    Object.entries(navItem.title).forEach(([lang, text]) => {
        treeNode.translations[lang] = text;
    });
    if (navItem.items && navItem.items.length > 0) {
        treeNode.children = navItem.items.map((item) => ({
            id: item.url,
            text: item.title.en,
            translations: {
                en: item.title.en,
                ...Object.fromEntries(Object.entries(item.title)),
            },
            icon: "file",
        }));
    }
    return treeNode;
}
// Function to convert sidebarData to TreeNode structure
function sidebarDataToTreeNodes(data) {
    try {
        return data.navMain.map(navItemToTreeNode);
    }
    catch (error) {
        console.error("Error converting sidebar data to TreeNodes:", error instanceof Error ? error.message : String(error));
        return [];
    }
}
exports.sidebarDataToTreeNodes = sidebarDataToTreeNodes;
// Function to export sidebar data
function exportSidebar() {
    try {
        const treeNodes = sidebarDataToTreeNodes(sidebar_data_1.sidebarData);
        return JSON.stringify(treeNodes, null, 2);
    }
    catch (error) {
        console.error("Error exporting sidebar:", error instanceof Error ? error.message : String(error));
        throw new Error("Failed to export sidebar data");
    }
}
exports.exportSidebar = exportSidebar;
class MenuHandler {
    async exportNodes() {
        return sidebarDataToTreeNodes(sidebar_data_1.sidebarData);
    }
    async importNodes(nodes) {
        throw new Error("Menu import not implemented");
    }
}
exports.MenuHandler = MenuHandler;
