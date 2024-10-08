import swaggerJsdoc, { SwaggerDefinition, Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import logger from "./logger.config.js";

// Swagger definition
const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0", // You can use '2.0' for older versions
  info: {
    title: "Splitwise API Documentation", // Title of the API documentation
    version: "1.0.0", // Version of the API
    description: "Splitwise API documentation for developers",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  servers: [
    {
      url: "http://localhost:4004/api/v1", // The URL of your API
      description: "Development server",
    },
    // {
    //   url: "http://localhost:4004/api/v1", // The URL of your API
    //   description: "Development server",
  //   - url: http://api.example.com/v1
  //   description: Optional server description, e.g. Main (production) server
  // - url: http://staging-api.example.com
  //   description: Optional server description, e.g. Internal staging server for testing
    // },
  ],
};

// Options for the swagger-jsdoc
const options: Options = {
  swaggerDefinition,
  apis: [
    "./src/routes/*.ts",
    "./src/models/*.ts",
    "./docs/swagger-docs/routes/*.ts",
    "./docs/swagger-docs/routes/expense/*.ts",
    "./docs/swagger-docs/models/*.ts",
  ], // Path to the API docs (JSDoc comments in your code)
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Application, port: number) {
  // Swagger page
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(`Docs available at http://localhost:${port}/api-docs`);
}

export default swaggerDocs;
