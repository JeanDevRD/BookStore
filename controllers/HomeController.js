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
                t.name.toLowerCase().includes(serchTerm.toLowerCase())
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