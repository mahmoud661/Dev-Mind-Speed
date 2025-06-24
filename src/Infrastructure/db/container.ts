import "reflect-metadata";
import { container } from "tsyringe";
import { glob } from "glob";
import path from "path";

const getInterfaceToken = (className: string) => {
  return "I" + className.replace("Repo", "") + "Repo";
};

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
