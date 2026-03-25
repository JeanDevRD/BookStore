import context from "../context/AppContext.js";

export async function GetIndex(req, res, next) {
    try {
        const result = await context.AuthorModel.findAll();
        const authors = result.map((result) => result.dataValues);

        res.render("author/index", {
            authorsList: authors,
            hasAuthors: authors.length > 0,
            "page-tittle": "Authors list"
        });
    } catch (ex) {
        console.error("Error fetching Authors", ex);
    }
}

export function GetCreate(req, res, next) {
    res.render("author/save", {
        editMode: false,
        "page-title": "New author"
    });
}

export async function PostCreate(req, res, next) {
    const { name, email } = req.body;
    try {
        await context.AuthorModel.Create({ name: name, email: email });
        return res.redirect("/author/index")
    } catch (ex) {
        console.error("Error creating Author", ex)
    }
}

export async function getEdit(req, res, next) {
    const id = req.params.authorId
    try {
        const result = await context.authors.findOne({ where: { id: id } })
        const author = result.map((result) => result.dataValues)
       return res.render("author/save", {
            editMode: true,
            "page-title": `Editing author: ${author.name}`,
            author: author,
        })
    } catch {
        console.error("Error fatching Author", ex)
    }
}

export async function PostEdit(req, res, next) {
    const { name, email, id } = req.body;

    try {
        const result = context.AuthorModel.findOne({ where: { id: id } })

        if (!result) {
            return res.redirect("/author/index")
        }
        await context.AuthorModel.update({ name: name, email: email },
            { where: { id: id } }
        );
        return res.redirect("/author/index")

    } catch (ex) {
        console.error("Error in PostEdit:", err);
    }
}

export async function Delete(req,res,next){
    const id = req.body.id;
    
    try{
        const result = await context.AuthorModel.findOne({where: {id: id}})
        if(!result){
            return res.redirect("authors/index")
        }
        await context.destroy({where: {id: id}});
    }
    catch(ex){
        console.log("Error deleting author", ex)
    }
}

