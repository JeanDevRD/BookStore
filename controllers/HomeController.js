import context from "../context/AppContext.js"

export async function GetHome(req, res, next) {
    const { title, categoryId } = req.body;

    try {
        let books = await context.BookModel.findAll({
            include: [
                { model: context.AuthorModel },
                { model: context.CategoryModel },
                { model: context.PublisherModel }
            ]
        })

        let booksData = books.map(books => books.get({plain: true}));

        if(title){
            booksData = booksData.filter(t => 
                t.title.toLowerCase().includes(serchTerm.toLowerCase())
            );
        }

        if(categoryId){
            booksData.filter(p => p.categoryId == categoryId)
        }
        const categories = await context.CategoryModel.findAll()
        const categoriesData = categories.map(c => c.dataVaules);

        res.render("home/index",{
            "page-title": "home",
            categories: categoriesData,
            books: booksData,
            hasBooks: booksData.length > 0,
            formData: { title, categoryId }
        })
    } catch (ex) {
        console.log(`Error in get gome ${ex}`)
    }
}

export async function GetDetail(req, res, next) {
    const id = req.params.bookId;
    try {
        const result = await context.BookModel.findOne({
            where: { id },
            include: [
                { model: context.AuthorModel },
                { model: context.CategoryModel },
                { model: context.PublisherModel }
            ]
        });
        if (!result) return res.redirect("/home");
        res.render("home/detail", {
            book: result.get({ plain: true }),
            "page-title": result.title
        });
    } catch (ex) {
        console.log(`Error in GetDetail: ${ex}`);
    }
}