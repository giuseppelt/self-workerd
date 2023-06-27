import { publish } from "./publish";
import { getConfig } from "./getConfig";


/**
 * The two operations for the Publisher
 * - publish -> add a new worker
 * - getConfig -> get a zip for all worker defs
 */

export default {
    publish,
    getConfig,
}
