/**
 * Schema barrel export — all tables, enums, and relations.
 * Drizzle-kit and the client both import from here.
 */

// ---- Users ----
export { users, usersRelations, userRoleEnum } from "./users";

// ---- Sites ----
export { sites, sitesRelations } from "./sites";
export type { SiteTheme, SiteSeoDefaults } from "./sites";

// ---- Pages ----
export { pages, pagesRelations, pageStatusEnum } from "./pages";
export type { BlockData, PageSeo } from "./pages";

// ---- Blocks (reusable templates) ----
export { blocks, blocksRelations, blockTypeEnum } from "./blocks";
export type { BlockTemplateData } from "./blocks";

// ---- Media ----
export { media, mediaRelations } from "./media";
