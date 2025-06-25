/**
 * @fileoverview Dependency injection container configuration.
 * Automatically registers repositories and services for the TSyringe IoC container.
 */

import "reflect-metadata";
import { container } from "tsyringe";
import { glob } from "glob";
import path from "path";

/**
 * Generates interface token name from class name.
 * Converts class names like "PlayerRepo" to interface tokens like "IPlayerRepo".
 * 
 * @param {string} className - The name of the repository class
 * @returns {string} The corresponding interface token
 * @example
 * getInterfaceToken("PlayerRepo") // Returns "IPlayerRepo"
 */
const getInterfaceToken = (className: string) => {
  return "I" + className.replace("Repo", "") + "Repo";
};

/**
 * Registers all repositories and services with the TSyringe container.
 * Automatically discovers and registers:
 * - All repository classes from the repos directory
 * - All service classes from the App/services directory
 * 
 * @async
 * @function registerDependencies
 * @returns {Promise<void>} Promise that resolves when all dependencies are registered
 * @throws {Error} When dependency registration fails
 */
export async function registerDependencies() {
  const repoPath = path.join(__dirname, "repos");

  const repoFiles = await glob(`${repoPath}/*.ts`);
  for (const filePath of repoFiles) {
    const absolutePath = path.resolve(filePath);
    const module = await import(absolutePath);

    for (const exportedName in module) {
      const RepoClass = module[exportedName];
      if (typeof RepoClass === "function") {
        const token = getInterfaceToken(exportedName);
        container.register(token, { useClass: RepoClass });
        console.log(`✅ Registered ${exportedName} -> ${token}`);
      }
    }
  }
  const servicePath = path.resolve(__dirname, "../../App/services");
  const appFiles = await glob(`${servicePath}/*.ts`);
  for (const filePath of appFiles) {
    const absolutePath = path.resolve(filePath);
    const module = await import(absolutePath);

    for (const exportedName in module) {
      const ServiceClass = module[exportedName];
      if (typeof ServiceClass === "function") {
        container.register(ServiceClass, { useClass: ServiceClass });
        console.log(`✅ Registered service: ${exportedName}`);
      }
    }
  }
}
