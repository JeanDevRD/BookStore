import express from "express"
import {engine} from "express-handlebars"
import { GetSection } from "./utils/helpers/Section.js"
import { Equals } from "./utils/helpers/Compare.js"
import path from "path"
import { projectRoot } from "./utils/Paths.js"
import multer from "multer";
import "./utils/LoadEnvConfiguration.js"
import context from "./context/AppContext.js"
import authorRoutes from "./routes/AuthorRoutes.js";
import categoryRoutes from "./routes/CategoryRoutes.js";
import bookRoutes from "./routes/BookRoutes.js";
import publisherRoutes from "./routes/PublisherRoutes.js";
import homeRoutes from "./routes/HomeRoutes.js"


const app = express();

app.engine("hbs",
    engine({
        layoutsDir: "views/layouts",
        defaultLayout: "layout",
        extname: "hbs",
        helpers: {
            eq: Equals,
            section: GetSection
        },
    })
);

app.set("view engine", "hbs")
app.set("views","views")

app.use(express.urlencoded());
app.use(express.static(path.join(projectRoot, "public")));

const imageStorageForCoverImageBooks = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(projectRoot, "public", "Images", "coverImages" ));
    },
    filename: (req,file,cb) => {
        const ramdomNumber = Math.Floor(Math.random() * 100000);
        const fileName = `${file.originalname}/${ramdomNumber}`;
        cb(null, fileName)
    }
});

app.use(multer({ storage: imageStorageForCoverImageBooks}).single("coverImage"));

app.use("/home", homeRoutes);
app.use("/authors", authorRoutes);
app.use("/categories", categoryRoutes);
app.use("/books", bookRoutes);
app.use("/publishers", publisherRoutes);

app.use((req,res) => {
    res.status(400).render("404", {"page-tittle": "Not Found"})
});

try{
    await context.sequelize.async({alter: true});
    app.listen(process.env.PORT || 5000);
    console.log("Database is running")
}
catch(ex){
    console.log(`Error conecting database: ${ex}`)
}
