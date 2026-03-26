import context from "../context/AppContext.js";
import path from "path";
import fs from "fs";
import { projectRoot } from "../utils/Paths.js";
import { sendEmail } from "../services/EmailServices.js";

export async function GetIndex(req, res, next) {
  try {
    const result = await context.BookModel.findAll({
      include: [
        { model: context.AuthorModel },
        { model: context.CategoryModel },
        { model: context.PublisherModel },
      ],
    });

    const books = result.map((r) => r.get({ plain: true }));

    res.render("book/index", {
      booksList: books,
      hasBooks: books.length > 0,
      "page-title": "Books list",
    });
  } catch (err) {
    console.error("Error fetching books:", err);
  }
}

export async function GetCreate(req, res, next) {
  try {
    const categoriesResult = await context.CategoryModel.findAll();
    const authorsResult = await context.AuthorModel.findAll();
    const publishersResult = await context.PublisherModel.findAll();

    const categories = categoriesResult.map((r) => r.dataValues);
    const authors = authorsResult.map((r) => r.dataValues);
    const publishers = publishersResult.map((r) => r.dataValues);

    res.render("book/save", {
      editMode: false,
      categoriesList: categories,
      hasCategories: categories.length > 0,
      authorsList: authors,
      hasAuthors: authors.length > 0,
      publishersList: publishers,
      hasPublishers: publishers.length > 0,
      "page-title": "New Book",
    });
  } catch (err) {
    console.error("Error fetching data for book creation:", err);
  }
}

export async function PostCreate(req, res, next) {
  try {
    const { title, publicationYear, categoriesId, athorId, publisherId } = req.body;
    const coverImage = req.file;
    const coverImagePath = "\\" + path.relative("public", coverImage.path);

    await context.BookModel.create({
      title: title,
      publicationYear,
      coverImage: coverImagePath,
      categoriesId,
      athorId,
      publisherId,
    });

    const authorResult = await context.AuthorModel.findOne({ where: { id: athorId } });
    if (authorResult) {
      const author = authorResult.dataValues;
      await sendEmail({
        to: author.email,
        subject: "Nuevo libro publicado",
        html: `<p>Hola ${author.name},</p><p>Se ha publicado un nuevo libro de tu autoría: <strong>${title}</strong>.</p>`,
      });
    }

    res.redirect("/books/index");
  } catch (err) {
    console.error("Error creating book:", err);
  }
}

export async function GetEdit(req, res, next) {
  try {
    const id = req.params.bookId;
    const bookResult = await context.BookModel.findOne({ where: { id } });

    if (!bookResult) {
      return res.redirect("/books/index");
    }

    const book = bookResult.dataValues;

    const categoriesResult = await context.CategoryModel.findAll();
    const authorsResult = await context.AuthorModel.findAll();
    const publishersResult = await context.PublisherModel.findAll();

    const categories = categoriesResult.map((r) => r.dataValues);
    const authors = authorsResult.map((r) => r.dataValues);
    const publishers = publishersResult.map((r) => r.dataValues);

    res.render("book/save", {
      editMode: true,
      book,
      categoriesList: categories,
      hasCategories: categories.length > 0,
      authorsList: authors,
      hasAuthors: authors.length > 0,
      publishersList: publishers,
      hasPublishers: publishers.length > 0,
      "page-title": `Edit Book: ${book.title}`,
    });
  } catch (err) {
    console.error("Error fetching book for edit:", err);
  }
}

export async function PostEdit(req, res, next) {
  try {
    const { title, publicationYear, categoriesId, athorId, publisherId, bookId } = req.body;
    const coverImage = req.file;
    let coverImagePath = null;

    const book = await context.BookModel.findOne({ where: { id: bookId } });

    if (!book) {
      return res.redirect("/books/index");
    }

    if (coverImage) {
      coverImagePath = "\\" + path.relative("public", coverImage.path);
    } else {
      coverImagePath = book.coverImage;
    }

    await context.BookModel.update(
      {
        title: title,
        publicationYear,
        coverImage: coverImagePath,
        categoriesId,
        athorId,
        publisherId,
      },
      { where: { id: bookId } }
    );

    res.redirect("/books/index");
  } catch (err) {
    console.error("Error updating book:", err);
  }
}

export async function Delete(req, res, next) {
  try {
    const id = req.body.bookId;

    const book = await context.BookModel.findOne({ where: { id } });

    if (!book) {
      return res.redirect("/books/index");
    }

    if (book.coverImage) {
      const coverImagePath = path.join(projectRoot, "public", book.coverImage);
      if (fs.existsSync(coverImagePath)) {
        fs.unlinkSync(coverImagePath);
      }
    }

    await context.BookModel.destroy({ where: { id } });

    res.redirect("/books/index");
  } catch (err) {
    console.error("Error deleting book:", err);
  }
}

export async function GetDelete(req, res, next) {
    const id = req.params.bookId;
    try {
        const result = await context.BookModel.findOne({
            where: { id },
            include: [{ model: context.AuthorModel }]
        });
        if (!result) return res.redirect("/books/index");
        return res.render("book/delete", {
            book: result.get({ plain: true }),
            "page-title": `Eliminar libro: ${result.title}`
        });
    } catch (err) {
        console.error("Error fetching book for delete", err);
    }
}