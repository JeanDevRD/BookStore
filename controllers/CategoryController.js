import context from "../context/AppContext.js"

export async function GetIndex(req, res, next) {
    try {
        const result = await context.CategoryModel.findAll()
        const categories = result.map((result) => result.dataValues)
        res.render("category/index", {
            categoriesList: categories,
            hasCategories: categories.length > 0,
            "page-title": "Categories"
        });
    }
    catch (ex) {
        console.error("Error, fetching categories")
    }
}

export async function GetCreate(req, res, next) { 
    res.render("category/save", {
        editMode: false,
        "page-title": "New category"
    });
}

export async function PostCreate(req, res, next) {
    const { name, description } = req.body;

    try {
        await context.CategoryModel.create({ name: name, description: description })
        res.redirect("/categories/index") 
    } catch (ex) {
        console.error("Error creating category", ex)
    }
}

export async function GetEdit(req, res, next){
    const id = req.params.categoryId;
    
    try{
        const result = await context.CategoryModel.findOne({where: {id: id}});
        if(!result){
         return res.redirect("/categories/index") 
        }

        const category = result.dataValues

        res.render("category/save", {
            editMode: true,
            category: category,
            "page-title": `Edit category ${category.name}`
        });
    }
    catch(ex){
        console.error("Error fetching category")
    }
}

export async function PostEdit(req, res, next){
    const {name , description, id} = req.body;

    try{
        const result = await context.CategoryModel.findOne({where: {id: id}})

        if(!result){
            return res.redirect("/categories/index") 
        }

        await context.CategoryModel.update(
            {name: name, description: description},
            {where: {id: id}}
        )

        return res.redirect("/categories/index") 
    

    }catch(ex){
        console.error("Error fetching category")
    }
}

export async function Delete(req,res,next){
    const id = req.body.id;

    try{
        const result = await context.CategoryModel.findOne({where: {id: id}})

        if(!result){
            return res.redirect("/categories/index") 
        }

        await context.CategoryModel.destroy({where: {id: id}});
        return res.redirect("/categories/index") 
    }
    catch(ex){
        console.error("error in Delete", ex)
    }
}

export async function GetDelete(req, res, next) {
    const id = req.params.categoryId;
    try {
        const result = await context.CategoryModel.findOne({ where: { id: id } });
        if (!result) return res.redirect("/categories/index");
        const category = result.dataValues;
        return res.render("category/delete", {
            category: category,
            "page-title": `Eliminar categoría: ${category.name}`
        });
    } catch (ex) {
        console.error("Error fetching category for delete", ex);
    }
}