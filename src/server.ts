import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import { Express } from "express";

var validUrl = require("valid-url");

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  app.get(
    "/filteredimage/",
    async (req: Express.Request, res: Express.Response) => {
      const fs = require("fs");

      const dir = "./src/util/tmp/";
    
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          console.log(file);

          deleteLocalFiles([String(dir + file)]);
        }
      } catch (error) {
        console.error();
      }

      const url = req.query.image_url;
      console.log("start getting image");
      if (validUrl.isUri(url)) {
        console.log("URL is valid");
        await filterImageFromURL(url)
          .then(function (image_path) {
            console.log(image_path);
            res.sendFile(String(image_path));
          })
          .catch((error) => {
            console.log(error);
            res.send("404, URL image not found");
          });
      } else {
        console.log("Not a valid URL");
      }
    }
  );

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
