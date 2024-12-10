import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Employee System API",
      version: "1.0.0",
      description: "API for managing employee data",
    },
    servers: [
      {
        url: "http://localhost:7000", // Replace with your actual server URL
      },
    ],
  },
  apis: ["./routes/*.js", "./model/*.js"], // Update paths if necessary
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
