import context from "../context/AppContext.js";

export async function GetIndex(req, res, next) {
  try {
    const result = await context.PublisherModel.findAll();
    const publishers = result.map((r) => r.dataValues);

    res.render("publisher/index", {
      publishersList: publishers,
      hasPublishers: publishers.length > 0,
      "page-title": "Publishers list",
    });
  } catch (err) {
    console.error("Error fetching publishers:", err);
  }
}

export async function GetCreate(req, res, next) {
  res.render("publisher/save", {
    editMode: false,
    "page-title": "New Publisher",
  });
}

export async function PostCreate(req, res, next) {
  try {
    const { name, phone, city } = req.body;

    await context.PublisherModel.create({ name, phone, city });

    res.redirect("/publishers/index");
  } catch (err) {
    console.error("Error creating publisher:", err);
  }
}

export async function GetEdit(req, res, next) {
  try {
    const id = req.params.publisherId;
    const result = await context.PublisherModel.findOne({ where: { id } });

    if (!result) {
      return res.redirect("/publishers/index");
    }

    const publisher = result.dataValues;

    res.render("publisher/save", {
      editMode: true,
      publisher,
      "page-title": `Edit Publisher: ${publisher.name}`,
    });
  } catch (err) {
    console.error("Error fetching publisher:", err);
  }
}

export async function PostEdit(req, res, next) {
  try {
    const { name, phone, city, publisherId } = req.body;

    const result = await context.PublisherModel.findOne({ where: { id: publisherId } });

    if (!result) {
      return res.redirect("/publishers/index");
    }

    await context.PublisherModel.update(
      { name, phone, city },
      { where: { id: publisherId } }
    );

    res.redirect("/publishers/index");
  } catch (err) {
    console.error("Error updating publisher:", err);
  }
}

export async function Delete(req, res, next) {
  try {
    const id = req.body.publisherId;

    const result = await context.PublisherModel.findOne({ where: { id } });

    if (!result) {
      return res.redirect("/publishers/index");
    }

    await context.PublisherModel.destroy({ where: { id } });

    res.redirect("/publishers/index");
  } catch (err) {
    console.error("Error deleting publisher:", err);
  }
}