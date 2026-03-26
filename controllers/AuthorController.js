import context from "../context/AppContext.js";

export async function GetIndex(req, res, next) {
    try {
        const result = await context.AuthorModel.findAll();
        const authors = result.map((result) => result.dataValues);

        res.render("author/index", {
            authorsList: authors,
            hasAuthors: authors.length > 0,
            "page-title": "Authors list"
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

        const existing = await context.AuthorModel.findOne({ where: { email: email } });
        if (existing) {
            return res.render("author/save", {
                editMode: false,
                error: "Este email ya está registrado por otro autor.",
                formData: { name, email },
                "page-title": "New author"
            });
        }

        await context.AuthorModel.create({ name: name, email: email });
        return res.redirect("/authors/index");
    } catch (ex) {
        console.error("Error creating Author", ex);
    }
}

export async function GetEdit(req, res, next) {
    const id = req.params.authorId;
    try {
        const result = await context.AuthorModel.findOne({ where: { id: id } });
        const author = result.dataValues;
        return res.render("author/save", {
            editMode: true,
            "page-title": `Editing author: ${author.name}`,
            author: author,
        });
    } catch (ex) {
        console.error("Error fatching Author", ex);
    }
}

export async function PostEdit(req, res, next) {
    const { name, email, id } = req.body;

    try {
        const result = await context.AuthorModel.findOne({ where: { id: id } });

        if (!result) {
            return res.redirect("/authors/index");
        }

        const existing = await context.AuthorModel.findOne({ where: { email: email } });
        if (existing && existing.dataValues.id != id) {
            return res.render("author/save", {
                editMode: true,
                error: "Este email ya está registrado por otro autor.",
                author: { id, name, email },
                "page-title": `Editing author: ${name}`
            });
        }

        await context.AuthorModel.update({ name: name, email: email },
            { where: { id: id } }
        );
        return res.redirect("/authors/index");

    } catch (ex) {
        console.error("Error in PostEdit:", ex);
    }
}

export async function GetDelete(req, res, next) {
    const id = req.params.authorId;
    try {
        const result = await context.AuthorModel.findOne({ where: { id: id } });
        if (!result) {
            return res.redirect("/authors/index");
        }
        const author = result.dataValues;
        return res.render("author/delete", {
            author: author,
            "page-title": `Eliminar autor: ${author.name}`
        });
    } catch (ex) {
        console.error("Error fetching author for delete", ex);
    }
}

export async function Delete(req, res, next) {
    const id = req.body.id;

    try {
        const result = await context.AuthorModel.findOne({ where: { id: id } });
        if (!result) {
            return res.redirect("/authors/index");
        }
        await context.AuthorModel.destroy({ where: { id: id } });
        return res.redirect("/author/index"); 
    }
    catch (ex) {
        console.log("Error deleting author", ex);
    }
}