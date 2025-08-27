import swaggerJsdoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";
import logger from "./logger.config.js";

// Utility function to load YAML files
function loadYamlFile(filePath: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return YAML.load(path.join(__dirname, filePath));
}

// Determine the base path based on environment
const basePath = process.env.NODE_ENV === 'production' ? '../docs' : '../docs';

// Load base OpenAPI YAML file
const openapiMain = loadYamlFile(`${basePath}/swagger-docs/openapi.yaml`);

// Load and merge other module-specific YAML files
const authenticationDoc = loadYamlFile(
  `${basePath}/swagger-docs/authentication.swagger.yaml`
);
const userDoc = loadYamlFile(`${basePath}/swagger-docs/user.swagger.yaml`);
const groupDoc = loadYamlFile(`${basePath}/swagger-docs/group.swagger.yaml`);
const expenseDoc = loadYamlFile(
  `${basePath}/swagger-docs/expense/expense.swagger.yaml`
);
const groupExpenseDoc = loadYamlFile(
  `${basePath}/swagger-docs/expense/group.expense.swagger.yaml`
);
const userExpenseDoc = loadYamlFile(
  `${basePath}/swagger-docs/expense/user.expense.swagger.yaml`
);

// Merge paths from all YAML files into the main spec
openapiMain.paths = {
  ...openapiMain.paths,
  ...authenticationDoc.paths,
  ...userDoc.paths,
  ...groupDoc.paths,
  ...expenseDoc.paths,
  ...groupExpenseDoc.paths,
  ...userExpenseDoc.paths,
};

// Options for the swagger-jsdoc
const options: Options = {
  swaggerDefinition: openapiMain,
  apis: [],
  // Path to the API docs (JSDoc comments in the code). No need for JSDoc comments in the codebase, as the YAML files are used for this.
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Application, port: number) {
  // Swagger page with custom options
  const swaggerOptions = {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      displayRequestDuration: true,
      filter: true,
      deepLinking: true,
    }
  };

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

  // Docs in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(`Docs available at http://localhost:${port}/api-docs`);
  logger.info(`Docs also available at http://0.0.0.0:${port}/api-docs`);
}

export default swaggerDocs;
